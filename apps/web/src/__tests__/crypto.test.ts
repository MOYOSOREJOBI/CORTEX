import { describe, it, expect } from 'vitest';
import { encryptData, decryptData, createVerifier, verifyPassphrase } from '@/lib/crypto';

describe('encryptData and decryptData', () => {
  it('encrypts and decrypts data correctly', async () => {
    const data = JSON.stringify({ hello: 'world', items: [1, 2, 3] });
    const passphrase = 'test-passphrase-123';
    const vault = await encryptData(data, passphrase);

    expect(vault.version).toBe(1);
    expect(vault.salt).toBeTruthy();
    expect(vault.iv).toBeTruthy();
    expect(vault.ciphertext).toBeTruthy();
    expect(vault.exportedAt).toBeGreaterThan(0);

    const decrypted = await decryptData(vault, passphrase);
    expect(decrypted).toBe(data);
  });

  it('fails with wrong passphrase', async () => {
    const data = 'secret data';
    const vault = await encryptData(data, 'correct-pass');
    await expect(decryptData(vault, 'wrong-pass')).rejects.toThrow();
  });

  it('produces different ciphertexts for same data', async () => {
    const data = 'same data';
    const v1 = await encryptData(data, 'pass');
    const v2 = await encryptData(data, 'pass');
    expect(v1.ciphertext).not.toBe(v2.ciphertext);
  });

  it('handles empty string', async () => {
    const vault = await encryptData('', 'pass');
    const decrypted = await decryptData(vault, 'pass');
    expect(decrypted).toBe('');
  });

  it('handles large data', async () => {
    const data = 'x'.repeat(100000);
    const vault = await encryptData(data, 'pass');
    const decrypted = await decryptData(vault, 'pass');
    expect(decrypted).toBe(data);
  });
});

describe('createVerifier and verifyPassphrase', () => {
  it('creates and verifies passphrase', async () => {
    const { verifier, salt } = await createVerifier('mypass');
    expect(verifier).toBeTruthy();
    expect(salt).toBeTruthy();
    const valid = await verifyPassphrase('mypass', verifier, salt);
    expect(valid).toBe(true);
  });

  it('rejects wrong passphrase', async () => {
    const { verifier, salt } = await createVerifier('correctpass');
    const valid = await verifyPassphrase('wrongpass', verifier, salt);
    expect(valid).toBe(false);
  });

  it('handles empty passphrase', async () => {
    const { verifier, salt } = await createVerifier('');
    const valid = await verifyPassphrase('', verifier, salt);
    expect(valid).toBe(true);
  });
});
