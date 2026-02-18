'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleExportDiagnostics = () => {
    const diagnostics = {
      error: this.state.error?.message || 'Unknown error',
      stack: this.state.error?.stack || '',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
    const blob = new Blob([JSON.stringify(diagnostics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cortex-diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a4e 0%, #0077ff 74%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          color: '#fff',
          padding: 40,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(30px)',
            borderRadius: 24,
            padding: 40,
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.18)',
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: 48, color: '#ff6666', marginBottom: 16 }} />
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 12px' }}>Something went wrong</h1>
            <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Cortex encountered an unexpected error. Your data is safe in IndexedDB.
            </p>
            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                fontSize: 12,
                background: 'rgba(0,0,0,0.3)',
                padding: 12,
                borderRadius: 8,
                overflow: 'auto',
                maxHeight: 120,
                marginBottom: 20,
                opacity: 0.6,
              }}>
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: '#0066ff',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Reset App
              </button>
              <button
                onClick={this.handleExportDiagnostics}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Export Diagnostics
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
