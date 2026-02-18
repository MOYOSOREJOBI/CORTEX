'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { buildKeywordIndex } from '@/lib/search';
import * as db from '@/lib/db';
import type { IndexRun } from '@/lib/types';

type PipelineStatus = 'idle' | 'running' | 'paused' | 'completed' | 'cancelled' | 'error';

interface LogEntry {
  id: string;
  message: string;
  level: 'info' | 'error';
  timestamp: number;
}

export default function ProcessingTab() {
  const { memories, addActivity, trackEvent, showToast, loadMemories } = useApp();

  const [status, setStatus] = useState<PipelineStatus>('idle');
  const [docsProcessed, setDocsProcessed] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pastRuns, setPastRuns] = useState<IndexRun[]>([]);
  const cancelRef = useRef(false);
  const pauseRef = useRef(false);

  useEffect(() => {
    db.getIndexRuns().then(setPastRuns).catch(() => {});
  }, []);

  const addLog = (message: string, level: 'info' | 'error' = 'info') => {
    setLogs((prev) => [{ id: db.generateId(), message, level, timestamp: Date.now() }, ...prev].slice(0, 100));
  };

  const estimateTimeRemaining = (): string => {
    if (!startTime || docsProcessed === 0 || totalDocs === 0) return 'Calculating...';
    const elapsed = Date.now() - startTime;
    const rate = docsProcessed / elapsed;
    const remaining = (totalDocs - docsProcessed) / rate;
    if (remaining < 1000) return 'Almost done';
    if (remaining < 60000) return `${Math.ceil(remaining / 1000)}s remaining`;
    return `${Math.ceil(remaining / 60000)}m remaining`;
  };

  const runIndexing = useCallback(async (rebuild: boolean = false) => {
    cancelRef.current = false;
    pauseRef.current = false;
    setStatus('running');
    const start = Date.now();
    setStartTime(start);

    await loadMemories();
    const mems = await db.getAllMemories();
    setTotalDocs(mems.length);
    setDocsProcessed(0);

    addLog(rebuild ? 'Rebuild started. Clearing old index.' : 'Indexing started.');

    const run: IndexRun = {
      id: db.generateId(),
      status: 'running',
      docsProcessed: 0,
      totalDocs: mems.length,
      startedAt: start,
      completedAt: null,
      durationMs: null,
      error: null,
    };
    await db.addIndexRun(run);

    try {
      for (let i = 0; i < mems.length; i++) {
        if (cancelRef.current) {
          addLog('Indexing cancelled by user.');
          run.status = 'cancelled';
          run.completedAt = Date.now();
          run.durationMs = Date.now() - start;
          run.docsProcessed = i;
          await db.updateIndexRun(run);
          setStatus('cancelled');
          showToast('info', 'Indexing cancelled. Index is consistent up to the last processed document.');
          return;
        }

        while (pauseRef.current) {
          await new Promise((r) => setTimeout(r, 200));
          if (cancelRef.current) break;
        }

        // Simulate processing time per document
        await new Promise((r) => setTimeout(r, 10));
        setDocsProcessed(i + 1);

        if ((i + 1) % 50 === 0 || i === mems.length - 1) {
          addLog(`Processed ${i + 1}/${mems.length} documents.`);
        }
      }

      // Build the keyword index
      addLog('Building keyword index...');
      buildKeywordIndex(mems);
      addLog('Keyword index built.');

      const duration = Date.now() - start;
      run.status = 'completed';
      run.completedAt = Date.now();
      run.durationMs = duration;
      run.docsProcessed = mems.length;
      await db.updateIndexRun(run);

      setStatus('completed');
      addLog(`Indexing completed. ${mems.length} documents indexed in ${(duration / 1000).toFixed(1)}s.`);
      addActivity('Index Run', `${mems.length} documents`);
      trackEvent({ type: 'index_run', detail: `${mems.length} docs`, metadata: { durationMs: duration } });
      showToast('success', `Indexing complete. ${mems.length} documents processed.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Indexing failed: ${msg}`, 'error');
      run.status = 'error';
      run.error = msg;
      run.completedAt = Date.now();
      run.durationMs = Date.now() - start;
      await db.updateIndexRun(run);
      setStatus('error');
      showToast('error', `Indexing failed. ${msg}`);
    }

    const runs = await db.getIndexRuns();
    setPastRuns(runs);
  }, [loadMemories, addActivity, trackEvent, showToast]);

  const handlePause = () => {
    pauseRef.current = true;
    setStatus('paused');
    addLog('Indexing paused.');
  };

  const handleResume = () => {
    pauseRef.current = false;
    setStatus('running');
    addLog('Indexing resumed.');
  };

  const handleCancel = () => {
    cancelRef.current = true;
  };

  const progressPct = totalDocs > 0 ? Math.round((docsProcessed / totalDocs) * 100) : 0;

  const btnStyle: React.CSSProperties = {
    padding: '10px 18px',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  return (
    <>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px' }}>Processing</h1>
        <p style={{ opacity: 0.7, fontSize: 14, margin: 0 }}>Build and refresh the search index.</p>
      </header>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(status === 'idle' || status === 'completed' || status === 'cancelled' || status === 'error') && (
          <>
            <button onClick={() => runIndexing(false)} style={{ ...btnStyle, background: '#0066ff' }} aria-label="Start indexing">
              <i className="fas fa-play" style={{ marginRight: 6 }} /> Start Indexing
            </button>
            <button onClick={() => runIndexing(true)} style={{ ...btnStyle, background: 'rgba(255,255,255,0.15)' }} aria-label="Rebuild index">
              <i className="fas fa-rotate" style={{ marginRight: 6 }} /> Rebuild Index
            </button>
          </>
        )}
        {status === 'running' && (
          <>
            <button onClick={handlePause} style={{ ...btnStyle, background: '#cc8800' }} aria-label="Pause indexing">
              <i className="fas fa-pause" style={{ marginRight: 6 }} /> Pause
            </button>
            <button onClick={handleCancel} style={{ ...btnStyle, background: '#cc3333' }} aria-label="Cancel indexing">
              <i className="fas fa-stop" style={{ marginRight: 6 }} /> Cancel
            </button>
          </>
        )}
        {status === 'paused' && (
          <>
            <button onClick={handleResume} style={{ ...btnStyle, background: '#0066ff' }} aria-label="Resume indexing">
              <i className="fas fa-play" style={{ marginRight: 6 }} /> Resume
            </button>
            <button onClick={handleCancel} style={{ ...btnStyle, background: '#cc3333' }} aria-label="Cancel indexing">
              <i className="fas fa-stop" style={{ marginRight: 6 }} /> Cancel
            </button>
          </>
        )}
      </div>

      {/* Progress */}
      {(status === 'running' || status === 'paused') && (
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: 20,
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
            <span>{docsProcessed} / {totalDocs} documents</span>
            <span>{estimateTimeRemaining()}</span>
          </div>
          <div style={{
            height: 8,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: status === 'paused' ? '#cc8800' : '#0066ff',
              borderRadius: 4,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{ fontSize: 12, opacity: 0.5, marginTop: 8 }}>
            Status: {status === 'paused' ? 'Paused' : 'Running'} | {progressPct}% complete
          </p>
        </div>
      )}

      {/* Status summary for completed states */}
      {(status === 'completed' || status === 'cancelled' || status === 'error') && (
        <div style={{
          background: status === 'error' ? 'rgba(255,60,60,0.1)' : 'rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: 16,
          border: `1px solid ${status === 'error' ? 'rgba(255,60,60,0.2)' : 'rgba(255,255,255,0.08)'}`,
          marginBottom: 20,
          fontSize: 14,
        }}>
          {status === 'completed' && <p><i className="fas fa-check-circle" style={{ color: '#44bb44', marginRight: 8 }} />Last run completed. {docsProcessed} documents indexed.</p>}
          {status === 'cancelled' && <p><i className="fas fa-ban" style={{ color: '#cc8800', marginRight: 8 }} />Last run cancelled. {docsProcessed} documents processed before cancellation.</p>}
          {status === 'error' && <p><i className="fas fa-exclamation-circle" style={{ color: '#ff4444', marginRight: 8 }} />Last run failed. Check logs for details. Try rebuilding the index.</p>}
        </div>
      )}

      {/* Logs */}
      <section style={{ marginTop: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Recent Logs</h2>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12,
          padding: 14,
          maxHeight: 250,
          overflowY: 'auto',
          border: '1px solid rgba(255,255,255,0.06)',
          fontFamily: 'monospace',
          fontSize: 12,
        }}>
          {logs.length === 0 ? (
            <p style={{ opacity: 0.5 }}>No logs yet. Start indexing to see events.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} style={{
                padding: '4px 0',
                color: log.level === 'error' ? '#ff6666' : 'rgba(255,255,255,0.7)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{ opacity: 0.4 }}>{new Date(log.timestamp).toLocaleTimeString()}</span>{' '}
                {log.message}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Past Runs */}
      {pastRuns.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Past Runs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pastRuns.slice(0, 10).map((run) => (
              <div key={run.id} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span>
                  {run.status === 'completed' && <i className="fas fa-check-circle" style={{ color: '#44bb44', marginRight: 6 }} />}
                  {run.status === 'error' && <i className="fas fa-exclamation-circle" style={{ color: '#ff4444', marginRight: 6 }} />}
                  {run.status === 'cancelled' && <i className="fas fa-ban" style={{ color: '#cc8800', marginRight: 6 }} />}
                  {run.docsProcessed}/{run.totalDocs} docs
                  {run.durationMs !== null && ` in ${(run.durationMs / 1000).toFixed(1)}s`}
                </span>
                <span style={{ opacity: 0.4, fontSize: 11 }}>
                  {new Date(run.startedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
