/**
 * Privacy page — "/privacy"
 * Describes the privacy-first design philosophy of CORTEX.
 * Emphasizes on-device processing and zero data exfiltration.
 */

import PageWrapper from '@/components/PageWrapper';

export const metadata = {
  title: 'Privacy — CORTEX',
  description: 'Privacy-first design principles of the CORTEX memory system.',
};

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 600,
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #fff, #0066ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Privacy by Design
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '15px' }}>
        Your data never leaves your device. That&apos;s not a feature — it&apos;s the architecture.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {[
          {
            icon: '🔒',
            title: 'On-Device Processing',
            desc: 'All indexing, OCR, embedding generation, and search happen entirely on your device. No API calls, no cloud sync, no external dependencies. Core ML and Vision frameworks run locally.',
          },
          {
            icon: '🛡️',
            title: 'Encrypted Storage',
            desc: 'All indexed memories are encrypted at rest using Apple CryptoKit (AES-GCM). Encryption keys are stored in the Secure Enclave via Keychain with biometric access control.',
          },
          {
            icon: '📡',
            title: 'Zero Telemetry',
            desc: 'CORTEX collects no analytics, no crash reports, no usage data by default. There are no tracking pixels, no third-party SDKs, no network requests. Period.',
          },
          {
            icon: '🗑️',
            title: 'Full Data Control',
            desc: 'Delete any memory, clear all indexes, or wipe the entire database at any time. Deletion is immediate and permanent — no "30-day retention" tricks.',
          },
          {
            icon: '🔑',
            title: 'Keychain Integration',
            desc: 'Sensitive configuration (encryption keys, user preferences) stored in iOS Keychain with kSecAttrAccessibleWhenUnlockedThisDeviceOnly protection level.',
          },
          {
            icon: '✅',
            title: 'No Cloud Dependencies',
            desc: 'CORTEX works in airplane mode. No iCloud sync, no Firebase, no Supabase. The app is fully functional without any network connectivity.',
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 6px' }}>
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
