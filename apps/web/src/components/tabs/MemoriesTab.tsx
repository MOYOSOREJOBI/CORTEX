'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { generateId } from '@/lib/db';
import { MAX_TAG_LENGTH, MAX_TAGS_PER_MEMORY, MAX_TITLE_LENGTH, AUTOSAVE_DEBOUNCE_MS } from '@/lib/constants';
import type { Memory } from '@/lib/types';

type ViewMode = 'list' | 'add' | 'edit';
type SortMode = 'updated' | 'created' | 'title';

export default function MemoriesTab() {
  const { memories, addMemory, updateMemory, removeMemory, restoreMemory, showToast, addActivity, trackEvent } = useApp();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [sensitivity, setSensitivity] = useState<Memory['sensitivity']>('normal');
  const [filterTag, setFilterTag] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('updated');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTagInput, setBulkTagInput] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetForm = () => {
    setTitle(''); setBody(''); setTagsInput(''); setSensitivity('normal');
    setTitleError(''); setBodyError(''); setEditingMemory(null);
  };

  const validateForm = (): boolean => {
    let valid = true;
    if (!title.trim()) { setTitleError('Title is required.'); valid = false; }
    else if (title.length > MAX_TITLE_LENGTH) { setTitleError(`Title must be under ${MAX_TITLE_LENGTH} characters.`); valid = false; }
    else { setTitleError(''); }
    if (!body.trim()) { setBodyError('Body is required.'); valid = false; }
    else { setBodyError(''); }
    return valid;
  };

  const parseTags = (input: string): string[] =>
    input.split(',').map((t) => t.trim()).filter(Boolean).slice(0, MAX_TAGS_PER_MEMORY).map((t) => t.slice(0, MAX_TAG_LENGTH));

  const handleAdd = async () => {
    if (!validateForm()) return;
    const memory: Memory = {
      id: generateId(), title: title.trim(), body: body.trim(), tags: parseTags(tagsInput),
      source: 'manual', createdAt: Date.now(), updatedAt: Date.now(), pinned: false, sensitivity,
    };
    await addMemory(memory);
    addActivity('Add Memory', memory.title);
    trackEvent({ type: 'add_memory', detail: memory.title });
    showToast('success', `Memory "${memory.title}" added.`);
    resetForm(); setViewMode('list');
  };

  const handleSaveEdit = async () => {
    if (!editingMemory || !validateForm()) return;
    const updated: Memory = { ...editingMemory, title: title.trim(), body: body.trim(), tags: parseTags(tagsInput), sensitivity, updatedAt: Date.now() };
    await updateMemory(updated);
    addActivity('Edit Memory', updated.title);
    trackEvent({ type: 'edit_memory', detail: updated.title });
    showToast('success', `Memory "${updated.title}" saved.`);
    resetForm(); setViewMode('list');
  };

  const handleEdit = (mem: Memory) => {
    setEditingMemory(mem); setTitle(mem.title); setBody(mem.body);
    setTagsInput(mem.tags.join(', ')); setSensitivity(mem.sensitivity); setViewMode('edit');
  };

  const handleDelete = async (mem: Memory) => {
    const deleted = await removeMemory(mem.id);
    if (deleted) {
      addActivity('Delete Memory', mem.title);
      trackEvent({ type: 'delete_memory', detail: mem.title });
      showToast('info', `Memory "${mem.title}" deleted.`, () => { restoreMemory(deleted); addActivity('Undo Delete', mem.title); });
    }
  };

  const handleTogglePin = async (mem: Memory) => {
    const updated = { ...mem, pinned: !mem.pinned, updatedAt: Date.now() };
    await updateMemory(updated);
    addActivity(updated.pinned ? 'Pinned' : 'Unpinned', mem.title);
    showToast('success', `Memory ${updated.pinned ? 'pinned' : 'unpinned'}.`);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} memories? This cannot be undone.`)) return;
    for (const id of Array.from(selectedIds)) { await removeMemory(id); }
    addActivity('Bulk Delete', `${selectedIds.size} memories`);
    showToast('info', `${selectedIds.size} memories deleted.`);
    setSelectedIds(new Set());
  };

  const handleBulkTag = async () => {
    if (selectedIds.size === 0 || !bulkTagInput.trim()) return;
    const newTags = parseTags(bulkTagInput);
    for (const id of Array.from(selectedIds)) {
      const mem = memories.find((m) => m.id === id);
      if (mem) {
        const mergedTags = Array.from(new Set([...mem.tags, ...newTags])).slice(0, MAX_TAGS_PER_MEMORY);
        await updateMemory({ ...mem, tags: mergedTags, updatedAt: Date.now() });
      }
    }
    addActivity('Bulk Tag', `${selectedIds.size} memories`);
    showToast('success', `Tags added to ${selectedIds.size} memories.`);
    setSelectedIds(new Set()); setBulkTagInput('');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let imported = 0;
    for (const file of Array.from(files)) {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        await addMemory({
          id: generateId(), title: file.name.replace(/\.(txt|md)$/, ''), body: text,
          tags: ['imported'], source: 'import', createdAt: Date.now(), updatedAt: Date.now(), pinned: false, sensitivity: 'normal',
        });
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

  // Autosave
  useEffect(() => {
    if (viewMode !== 'edit' || !editingMemory) return;
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(async () => {
      if (title.trim() && body.trim()) {
        const updated: Memory = { ...editingMemory, title: title.trim(), body: body.trim(), tags: parseTags(tagsInput), sensitivity, updatedAt: Date.now() };
        await updateMemory(updated);
        setEditingMemory(updated);
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => { if (autosaveRef.current) clearTimeout(autosaveRef.current); };
  }, [title, body, tagsInput, sensitivity, viewMode, editingMemory, updateMemory]);

  const filteredMemories = filterTag.trim()
    ? memories.filter((m) => m.tags.some((t) => t.toLowerCase().includes(filterTag.toLowerCase())))
    : memories;

  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    switch (sortMode) {
      case 'updated': return b.updatedAt - a.updatedAt;
      case 'created': return b.createdAt - a.createdAt;
      case 'title': return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  };
  const btnStyle: React.CSSProperties = {
    padding: '10px 18px', background: '#0066ff', border: 'none', borderRadius: 10,
    color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  };
  const sensitivityColor = (s: Memory['sensitivity']) =>
    s === 'sensitive' ? '#cc8800' : s === 'restricted' ? '#cc3333' : 'rgba(255,255,255,0.4)';

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <>
        <header style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>{viewMode === 'add' ? 'Add Memory' : 'Edit Memory'}</h1>
          <button onClick={() => { resetForm(); setViewMode('list'); }} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)' }} aria-label="Cancel">Cancel</button>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, opacity: 0.7, display: 'block', marginBottom: 4 }}>Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Memory title"
              style={{ ...inputStyle, borderColor: titleError ? '#ff4444' : undefined }} aria-label="Title" aria-invalid={!!titleError} maxLength={MAX_TITLE_LENGTH} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {titleError ? <p style={{ color: '#ff4444', fontSize: 12, margin: 0 }}>{titleError}</p> : <span />}
              <span style={{ fontSize: 11, opacity: 0.3 }}>{title.length}/{MAX_TITLE_LENGTH}</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, opacity: 0.7, display: 'block', marginBottom: 4 }}>Body *</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Memory body" rows={8}
              style={{ ...inputStyle, resize: 'vertical' }} aria-label="Body" aria-invalid={!!bodyError} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {bodyError ? <p style={{ color: '#ff4444', fontSize: 12, margin: 0 }}>{bodyError}</p> : <span />}
              <span style={{ fontSize: 11, opacity: 0.3 }}>{body.length} chars</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, opacity: 0.7, display: 'block', marginBottom: 4 }}>Tags (comma separated)</label>
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="tag1, tag2, tag3" style={inputStyle} aria-label="Tags" />
            {tagsInput.trim() && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                {parseTags(tagsInput).map((tag) => (
                  <span key={tag} style={{ padding: '2px 8px', background: 'rgba(0,102,255,0.2)', borderRadius: 6, fontSize: 11 }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize: 13, opacity: 0.7, display: 'block', marginBottom: 4 }}>Sensitivity</label>
            <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value as Memory['sensitivity'])}
              style={{ ...inputStyle, cursor: 'pointer' }} aria-label="Sensitivity level">
              <option value="normal">Normal</option>
              <option value="sensitive">Sensitive</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
          <button onClick={viewMode === 'add' ? handleAdd : handleSaveEdit} style={btnStyle}>
            {viewMode === 'add' ? 'Add Memory' : 'Save Changes'}
          </button>
          {viewMode === 'edit' && <p style={{ fontSize: 12, opacity: 0.5 }}>Autosave is active. Changes save automatically.</p>}
        </div>
      </>
    );
  }

  return (
    <>
      <header style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Memories</h1>
            <p style={{ fontSize: 13, opacity: 0.5, margin: '4px 0 0' }}>{memories.length} total</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setViewMode('add')} style={btnStyle} aria-label="Add memory">
              <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add
            </button>
            <label style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <i className="fas fa-file-import" /> Import
              <input type="file" accept=".txt,.md" multiple onChange={handleImportFile} style={{ display: 'none' }} aria-label="Import files" />
            </label>
            <button onClick={() => setShowBulkActions(!showBulkActions)}
              style={{ ...btnStyle, background: showBulkActions ? 'rgba(0,102,255,0.3)' : 'rgba(255,255,255,0.1)' }}
              aria-label="Toggle bulk actions" title="Bulk select">
              <i className="fas fa-check-double" />
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input type="text" value={filterTag} onChange={(e) => setFilterTag(e.target.value)} placeholder="Filter by tag..."
          style={{ ...inputStyle, flex: 1, minWidth: 150 }} aria-label="Filter by tag" />
        <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}
          style={{ ...inputStyle, width: 'auto', cursor: 'pointer', minWidth: 140 }} aria-label="Sort order">
          <option value="updated">Sort: Last Updated</option>
          <option value="created">Sort: Date Created</option>
          <option value="title">Sort: Title A-Z</option>
        </select>
      </div>

      {showBulkActions && selectedIds.size > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(0,102,255,0.1)', borderRadius: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{selectedIds.size} selected</span>
          <button onClick={handleBulkDelete} style={{ ...btnStyle, background: '#cc3333', fontSize: 12, padding: '6px 12px' }}>Delete</button>
          <input value={bulkTagInput} onChange={(e) => setBulkTagInput(e.target.value)} placeholder="Add tags"
            style={{ ...inputStyle, width: 'auto', flex: 1, padding: '6px 10px', fontSize: 12 }} aria-label="Bulk tag input" />
          <button onClick={handleBulkTag} style={{ ...btnStyle, fontSize: 12, padding: '6px 12px' }}>Tag</button>
        </div>
      )}

      {sortedMemories.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <i className="fas fa-layer-group" style={{ fontSize: 36, opacity: 0.3, marginBottom: 14, display: 'block' }} />
          <p style={{ opacity: 0.5, fontSize: 15, margin: '0 0 6px' }}>No memories yet.</p>
          <p style={{ opacity: 0.35, fontSize: 13, margin: 0 }}>Click Add to create your first memory, or Import files.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sortedMemories.map((mem) => {
            const isExpanded = expandedId === mem.id;
            return (
              <div key={mem.id} style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${selectedIds.has(mem.id) ? 'rgba(0,102,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14, padding: 16, transition: 'border-color 0.2s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {showBulkActions && (
                    <input type="checkbox" checked={selectedIds.has(mem.id)} onChange={() => toggleSelect(mem.id)}
                      style={{ marginTop: 4, cursor: 'pointer', accentColor: '#0066ff' }} aria-label={`Select ${mem.title}`} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                        onClick={() => setExpandedId(isExpanded ? null : mem.id)}>
                        {mem.pinned && <i className="fas fa-thumbtack" style={{ fontSize: 11, color: '#0066ff' }} />}
                        {mem.title}
                        {mem.sensitivity !== 'normal' && (
                          <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: `${sensitivityColor(mem.sensitivity)}22`, color: sensitivityColor(mem.sensitivity), fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {mem.sensitivity}
                          </span>
                        )}
                      </h3>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => handleTogglePin(mem)} title={mem.pinned ? 'Unpin' : 'Pin'}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: mem.pinned ? '#0066ff' : 'rgba(255,255,255,0.3)' }}
                          aria-label={mem.pinned ? `Unpin ${mem.title}` : `Pin ${mem.title}`}>
                          <i className="fas fa-thumbtack" style={{ fontSize: 12 }} />
                        </button>
                        <button onClick={() => handleEdit(mem)} aria-label={`Edit ${mem.title}`}
                          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, padding: 4 }}>
                          <i className="fas fa-pen" style={{ fontSize: 12 }} />
                        </button>
                        <button onClick={() => handleDelete(mem)} aria-label={`Delete ${mem.title}`}
                          style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', opacity: 0.5, padding: 4 }}>
                          <i className="fas fa-trash" style={{ fontSize: 12 }} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: 13, opacity: 0.65, margin: '6px 0', lineHeight: 1.5, cursor: 'pointer' }}
                      onClick={() => setExpandedId(isExpanded ? null : mem.id)}>
                      {isExpanded ? mem.body : (mem.body.length > 150 ? mem.body.slice(0, 150) + '...' : mem.body)}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      {mem.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {mem.tags.map((tag) => (
                            <span key={tag} style={{ padding: '2px 8px', background: 'rgba(0,102,255,0.2)', borderRadius: 6, fontSize: 11 }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <p style={{ fontSize: 11, opacity: 0.35, margin: 0, whiteSpace: 'nowrap' }}>
                        {new Date(mem.updatedAt).toLocaleDateString()} {new Date(mem.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button onClick={() => navigator.clipboard.writeText(mem.body).then(() => showToast('success', 'Copied to clipboard.'))}
                          style={{ ...btnStyle, fontSize: 12, padding: '6px 12px', background: 'rgba(255,255,255,0.1)' }}>
                          <i className="fas fa-copy" style={{ marginRight: 4 }} /> Copy
                        </button>
                        <button onClick={() => handleEdit(mem)} style={{ ...btnStyle, fontSize: 12, padding: '6px 12px', background: 'rgba(255,255,255,0.1)' }}>
                          <i className="fas fa-pen" style={{ marginRight: 4 }} /> Edit
                        </button>
                        <span style={{ fontSize: 11, opacity: 0.4, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                          Created {new Date(mem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
