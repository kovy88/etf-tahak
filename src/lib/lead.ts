/**
 * Odeslání leadu. ZATÍM STUB: nic neukládá, vždy uspěje. F5 ho nahradí voláním POST /api/lead.
 */
import type { FormLocation } from "@/content/form";

export interface LeadInput {
  email: string;
  location: FormLocation;
}

export async function submitLead(input: LeadInput): Promise<{ ok: true }> {
  void input;
  return { ok: true };
}
