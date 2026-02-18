/**
 * Landing page — "/" route
 * Premium dark-themed hero page for CORTEX.
 * Features animated gradient background, glassmorphism feature cards,
 * and a CTA linking to the demo dashboard.
 */

import Link from 'next/link';
import CortexLogo from '@/components/CortexLogo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MadeByBadge from '@/components/MadeByBadge';

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a4e 50%, #0a0a1a 100%)',
        color: '#fff',
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)',
          animation: 'float1 20s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,119,255,0.12) 0%, transparent 70%)',
          animation: 'float2 25s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)',
          animation: 'float3 18s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Keyframe animations via style tag */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, 30px) scale(1.1); }
          66% { transform: translate(-30px, 50px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, -20px) scale(1.05); }
          66% { transform: translate(30px, -40px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-50px, 30px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-title {
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 700;
          letter-spacing: -2px;
          background: linear-gradient(135deg, #fff 0%, #0066ff 50%, #00aaff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1.1;
          animation: fadeInUp 0.8s ease-out;
        }
        .hero-tagline {
          font-size: clamp(16px, 2.5vw, 22px);
          color: rgba(255,255,255,0.7);
          margin: 20px 0 0;
          font-weight: 300;
          letter-spacing: 0.5px;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          max-width: 900px;
          width: 100%;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }
        .feature-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .feature-icon {
          font-size: 36px;
          margin-bottom: 16px;
          display: block;
        }
        .feature-card h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px;
        }
        .feature-card p {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          margin: 0;
          line-height: 1.6;
        }
        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: #0066ff;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.3px;
          transition: all 0.3s ease;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }
        .cta-button:hover {
          background: #0055dd;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,102,255,0.4);
        }
      `}</style>

      <Navbar />

      {/* Hero section */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 40px 60px',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          gap: '48px',
        }}
      >
        {/* Logo + Title */}
        <div>
          <CortexLogo size={64} />
          <h1 className="hero-title">CORTEX</h1>
          <p className="hero-tagline">
            Intelligent On-Device Memory. Private by Design.
          </p>
        </div>

        {/* Feature cards */}
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">🧠</span>
            <h3>Smart Indexing</h3>
            <p>
              Photos, PDFs, Notes — automatically indexed on-device using
              Vision OCR, NaturalLanguage NER, and Core ML embeddings.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔍</span>
            <h3>Hybrid Search</h3>
            <p>
              Semantic + keyword search powered by SQLite FTS5 and on-device
              vector similarity. Find anything instantly.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Privacy First</h3>
            <p>
              All processing happens on-device. Your data never leaves.
              Encrypted storage with CryptoKit and Keychain.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link href="/demo" className="cta-button">
          Explore Dashboard <span>→</span>
        </Link>
      </main>

      <Footer />
      <MadeByBadge />
    </div>
  );
}
