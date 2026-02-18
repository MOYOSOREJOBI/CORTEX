'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { generateId } from '@/lib/db';
import { MAX_TAG_LENGTH, MAX_TAGS_PER_MEMORY, MAX_TITLE_LENGTH, AUTOSAVE_DEBOUNCE_MS } from '@/lib/constants';
import type { Memory } from '@/lib/types';

type ViewMode = 'list' | 'add' | 'edit';

export default function MemoriesTab() {
  const { memories, addMemory, updateMemory, removeMemory, restoreMemory, showToast, addActivity, trackEvent } = useApp();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [sensitivity, setSensitivity] = useState<Memory['sensitivity']>('normal');
  const [filterTag, setFilterTag] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTagInput, setBulkTagInput] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setTagsInput('');
    setSensitivity('normal');
    setTitleError('');
    setBodyError('');
    setEditingMemory(null);
  };

  const validateForm = (): boolean => {
    let valid = true;
    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else if (title.length > MAX_TITLE_LENGTH) {
      setTitleError(`Title must be under ${MAX_TITLE_LENGTH} characters.`);
      valid = false;
    } else {
      setTitleError('');
    }
    if (!body.trim()) {
      setBodyError('Body is required.');
      valid = false;
    } else {
      setBodyError('');
    }
    return valid;
  };

  const parseTags = (input: string): string[] => {
    return input
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, MAX_TAGS_PER_MEMORY)
      .map((t) => t.slice(0, MAX_TAG_LENGTH));
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    const memory: Memory = {
      id: generateId(),
      title: title.trim(),
      body: body.trim(),
      tags: parseTags(tagsInput),
      source: 'manual',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinned: false,
      sensitivity,
    };
    await addMemory(memory);
    addActivity('Add Memory', memory.title);
    trackEvent({ type: 'add_memory', detail: memory.title });
    showToast('success', `Memory "${memory.title}" added.`);
    resetForm();
    setViewMode('list');
  };

  const handleSaveEdit = async () => {
    if (!editingMemory) return;
    if (!validateForm()) return;
    const updated: Memory = {
      ...editingMemory,
      title: title.trim(),
      body: body.trim(),
      tags: parseTags(tagsInput),
      sensitivity,
      updatedAt: Date.now(),
    };
    await updateMemory(updated);
    addActivity('Edit Memory', updated.title);
    trackEvent({ type: 'edit_memory', detail: updated.title });
    showToast('success', `Memory "${updated.title}" saved.`);
    resetForm();
    setViewMode('list');
  };

  const handleEdit = (mem: Memory) => {
    setEditingMemory(mem);
    setTitle(mem.title);
    setBody(mem.body);
    setTagsInput(mem.tags.join(', '));
    setSensitivity(mem.sensitivity);
    setViewMode('edit');
  };

  const handleDelete = async (mem: Memory) => {
    const deleted = await removeMemory(mem.id);
    if (deleted) {
      addActivity('Delete Memory', mem.title);
      trackEvent({ type: 'delete_memory', detail: mem.title });
      showToast('info', `Memory "${mem.title}" deleted.`, () => {
        restoreMemory(deleted);
        addActivity('Undo Delete', mem.title);
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = window.confirm(`Delete ${selectedIds.size} memories? This cannot be undone.`);
    if (!confirmed) return;
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await removeMemory(id);
    }
    addActivity('Bulk Delete', `${ids.length} memories`);
    showToast('info', `${ids.length} memories deleted.`);
    setSelectedIds(new Set());
  };

  const handleBulkTag = async () => {
    if (selectedIds.size === 0 || !bulkTagInput.trim()) return;
    const newTags = parseTags(bulkTagInput);
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      const mem = memories.find((m) => m.id === id);
      if (mem) {
        const mergedTags = Array.from(new Set([...mem.tags, ...newTags])).slice(0, MAX_TAGS_PER_MEMORY);
        await updateMemory({ ...mem, tags: mergedTags, updatedAt: Date.now() });
      }
    }
    addActivity('Bulk Tag', `${selectedIds.size} memories`);
    showToast('success', `Tags added to ${selectedIds.size} memories.`);
    setSelectedIds(new Set());
    setBulkTagInput('');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let imported = 0;
    for (const file of Array.from(files)) {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        const mem: Memory = {
          id: generateId(),
          title: file.name.replace(/\.(txt|md)$/, ''),
          body: text,
          tags: ['imported'],
          source: 'import',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          pinned: false,
          sensitivity: 'normal',
        };
        await addMemory(mem);
        imported++;
      }
    }
    if (imported > 0) {
      addActivity('Import', `${imported} files`);
      trackEvent({ type: 'import', detail: `${imported} files` });
      showToast('success', `${imported} file(s) imported.`);
    }
    e.target.value = '';
  };

  // Autosave for edit mode
  useEffect(() => {
    if (viewMode !== 'edit' || !editingMemory) return;
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(async () => {
      if (title.trim() && body.trim()) {
        const updated: Memory = {
          ...editingMemory,
          title: title.trim(),
          body: body.trim(),
          tags: parseTags(tagsInput),
          sensitivity,
          updatedAt: Date.now(),
        };
        await updateMemory(updated);
        setEditingMemory(updated);
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (autosaveRef.current) clearTimeout(autosaveRef.current);
    };
  }, [title, body, tagsInput, sensitivity, viewMode, editingMemory, updateMemory]);

  const filteredMemories = filterTag.trim()
    ? memories.filter((m) => m.tags.some((t) => t.toLowerCase().includes(filterTag.toLowerCase())))
    : memories;

  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
  };

  const btnStyle: React.CSSProperties = {
    padding: '10px 18px',
    background: '#0066ff',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <>
        <header style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>
            {viewMode === 'add' ? 'Add Memory' : 'Edit Memory'}
          </h1>
          <button
            onClick={() => { resetForm(); setViewMode('list'); }}
            style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)' }}
            aria-label="Cancel"
          >
            Cancel
          </button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, opacity: 0.7, display: 'block', marginBottom: 4 }}>Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Memory title"
              style={{ ...inputStyle, borderColor: titleError ? '#ff4444' : undefined }}
              aria-label="Title"
              aria-invalid={!!titleError}
            />
            {titleError && <p style={{ color: '#ff4444', fontSize: 12, margin: '4px 0 0' }}>{titleError}</p>}
          </div>
          <div>
            <label style={{ fontSize: 13, opacity: 0.7, display: 'block', marginBottom: 4 }}>Body *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Memory body"
              rows={8}
              style={{ ...inputStyle, resize: 'vertical' }}
              aria-label="Body"
              aria-invalid={!!bodyError}
            />
            {bodyError && <p style={{ color: '#ff4444', fontSize: 12, margin: '4px 0 0' }}>{bodyError}</p>}
          </div>
          <div>
            <label style={{ fontSize: 13, opacity: 0.7, display: 'block', marginBottom: 4 }}>Tags (comma separated)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="tag1, tag2, tag3"
              style={inputStyle}
              aria-label="Tags"
            />
          </div>
          <div>
            <label style={{ fontSize: 13, opacity: 0.7, display: 'block', marginBottom: 4 }}>Sensitivity</label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value as Memory['sensitivity'])}
              style={{ ...inputStyle, cursor: 'pointer' }}
              aria-label="Sensitivity level"
            >
              <option value="normal">Normal</option>
              <option value="sensitive">Sensitive</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
          <button
            onClick={viewMode === 'add' ? handleAdd : handleSaveEdit}
            style={btnStyle}
          >
            {viewMode === 'add' ? 'Add Memory' : 'Save Changes'}
          </button>
          {viewMode === 'edit' && (
            <p style={{ fontSize: 12, opacity: 0.5 }}>Autosave is active. Changes save automatically.</p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <header style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Memories</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setViewMode('add')} style={btnStyle} aria-label="Add memory">
              <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add
            </button>
            <label style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fas fa-file-import" /> Import
              <input
                type="file"
                accept=".txt,.md"
                multiple
                onChange={handleImportFile}
                style={{ display: 'none' }}
                aria-label="Import files"
              />
            </label>
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              style={{ ...btnStyle, background: showBulkActions ? 'rgba(0,102,255,0.3)' : 'rgba(255,255,255,0.1)' }}
              aria-label="Toggle bulk actions"
            >
              <i className="fas fa-check-double" />
            </button>
          </div>
        </div>
      </header>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          placeholder="Filter by tag..."
          style={inputStyle}
          aria-label="Filter by tag"
        />
      </div>

      {showBulkActions && selectedIds.size > 0 && (
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          padding: '10px 14px',
          background: 'rgba(0,102,255,0.1)',
          borderRadius: 10,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 13 }}>{selectedIds.size} selected</span>
          <button onClick={handleBulkDelete} style={{ ...btnStyle, background: '#cc3333', fontSize: 12, padding: '6px 12px' }}>
            Delete
          </button>
          <input
            value={bulkTagInput}
            onChange={(e) => setBulkTagInput(e.target.value)}
            placeholder="Add tags"
            style={{ ...inputStyle, width: 'auto', flex: 1, padding: '6px 10px', fontSize: 12 }}
            aria-label="Bulk tag input"
          />
          <button onClick={handleBulkTag} style={{ ...btnStyle, fontSize: 12, padding: '6px 12px' }}>
            Tag
          </button>
        </div>
      )}

      {sortedMemories.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', opacity: 0.6 }}>
          <i className="fas fa-layer-group" style={{ fontSize: 32, marginBottom: 12, display: 'block' }} />
          <p>No memories yet.</p>
          <p style={{ fontSize: 13 }}>Click Add to create your first memory.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sortedMemories.map((mem) => (
            <div
              key={mem.id}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${selectedIds.has(mem.id) ? 'rgba(0,102,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              {showBulkActions && (
                <input
                  type="checkbox"
                  checked={selectedIds.has(mem.id)}
                  onChange={() => toggleSelect(mem.id)}
                  style={{ marginTop: 4, cursor: 'pointer' }}
                  aria-label={`Select ${mem.title}`}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {mem.pinned && <i className="fas fa-thumbtack" style={{ fontSize: 12, color: '#0066ff' }} />}
                    {mem.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleEdit(mem)}
                      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6, padding: 4 }}
                      aria-label={`Edit ${mem.title}`}
                    >
                      <i className="fas fa-pen" />
                    </button>
                    <button
                      onClick={() => handleDelete(mem)}
                      style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', opacity: 0.6, padding: 4 }}
                      aria-label={`Delete ${mem.title}`}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: 13, opacity: 0.7, margin: '6px 0', lineHeight: 1.5 }}>
                  {mem.body.length > 150 ? mem.body.slice(0, 150) + '...' : mem.body}
                </p>
                {mem.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                    {mem.tags.map((tag) => (
                      <span key={tag} style={{
                        padding: '2px 8px',
                        background: 'rgba(0,102,255,0.2)',
                        borderRadius: 6,
                        fontSize: 11,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: 11, opacity: 0.4, margin: '6px 0 0' }}>
                  {new Date(mem.updatedAt).toLocaleDateString()} {new Date(mem.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
