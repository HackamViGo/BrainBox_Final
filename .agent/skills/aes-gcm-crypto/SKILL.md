---
name: aes-gcm-crypto
description: "AES-GCM encryption standards for extension storage using Web Crypto API."
---

# AES-GCM Crypto Standards

## 1. Requirement

All sensitive tokens (JWTs) stored in `chrome.storage.local` MUST be encrypted using **AES-GCM**.

## 2. Implementation (`crypto.subtle`)

- Use `window.crypto.subtle` for all operations.
- **Key Derivation**: Use PBKDF2 with a user-supplied passphrase or a machine-bound secret to derive the AES key.
- **IV (Initialization Vector)**: Must be unique for EVERY encryption operation (standard 12 bytes for GCM).

## 3. Storage Pattern

Store the `ciphertext`, `iv`, and `salt` as a combined object or separate fields.

```typescript
{
  ciphertext: "...",
  iv: "...",
  salt: "..."
}
```

## 4. Prohibitions

- NEVER store encryption keys in plain text.
- NEVER reuse IVs.
- Avoid external crypto libraries (use native Web Crypto).
