/**
 * Encryption utilities for CORTEX.
 * Uses Web Crypto API with AES-GCM and PBKDF2 key derivation.
 */

import type { VaultExport } from './types';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

async function deriveKey(passphrase: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: string, passphrase: string): Promise<VaultExport> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const saltBuf = salt.buffer.slice(0) as ArrayBuffer;
  const ivBuf = iv.buffer.slice(0) as ArrayBuffer;
  const key = await deriveKey(passphrase, saltBuf);
  const encoder = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivBuf },
    key,
    encoder.encode(data)
  );
  return {
    version: 1,
    exportedAt: Date.now(),
    salt: arrayBufferToBase64(saltBuf),
    iv: arrayBufferToBase64(ivBuf),
    ciphertext: arrayBufferToBase64(ciphertext),
  };
}

export async function decryptData(vault: VaultExport, passphrase: string): Promise<string> {
  const saltBuf = base64ToArrayBuffer(vault.salt);
  const ivBuf = base64ToArrayBuffer(vault.iv);
  const ciphertext = base64ToArrayBuffer(vault.ciphertext);
  const key = await deriveKey(passphrase, saltBuf);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuf },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

/** Create a verifier hash from a passphrase for app lock */
export async function createVerifier(passphrase: string): Promise<{ verifier: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltBuf = salt.buffer.slice(0) as ArrayBuffer;
  const key = await deriveKey(passphrase, saltBuf);
  const encoder = new TextEncoder();
  const zeroIv = new ArrayBuffer(12);
  const exported = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: zeroIv },
    key,
    encoder.encode('cortex-verify')
  );
  return {
    verifier: arrayBufferToBase64(exported),
    salt: arrayBufferToBase64(saltBuf),
  };
}

/** Verify a passphrase against a stored verifier */
export async function verifyPassphrase(
  passphrase: string,
  storedVerifier: string,
  storedSalt: string
): Promise<boolean> {
  try {
    const saltBuf = base64ToArrayBuffer(storedSalt);
    const key = await deriveKey(passphrase, saltBuf);
    const ciphertext = base64ToArrayBuffer(storedVerifier);
    const zeroIv = new ArrayBuffer(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: zeroIv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted) === 'cortex-verify';
  } catch {
    return false;
  }
}
