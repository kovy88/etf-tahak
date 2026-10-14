/** E-mail odeslaný z formuláře, uložený v sessionStorage a sdílený mezi všemi formuláři. */
const KEY = "etf_lead";
const listeners = new Set<() => void>();
let memory: string | null = null;

function read(): string | null {
  if (memory !== null) return memory;
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null; // úložiště může být zablokované (privátní okno)
  }
}

export function getLeadEmail(): string | null {
  return read();
}

export function setLeadEmail(email: string): void {
  memory = email;
  try {
    sessionStorage.setItem(KEY, email);
  } catch {
    /* zůstane jen v paměti */
  }
  listeners.forEach((l) => l());
}

export function subscribeLead(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
