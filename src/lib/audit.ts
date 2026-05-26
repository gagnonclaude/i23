import { createAdminClient } from "@/lib/supabase/admin";

export type AuditAction =
  | "compte.suppression"
  | "stripe.checkout.session_created"
  | "stripe.webhook.signature_invalide"
  | "stripe.webhook.abonnement_active"
  | "stripe.webhook.abonnement_mis_a_jour"
  | "stripe.webhook.abonnement_annule"
  | "bilan.upsert"
  | "initialisation.upsert"
  | "quiz.badge_attribue"
  | "schema.created"
  | "auth.login.succes"
  | "auth.login.echec"
  | "auth.signup.succes"
  | "auth.signup.echec"
  | "consentement.modifie"
  | "auth.logout";

interface AuditPayload {
  action: AuditAction;
  user_id?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Enregistre une action sensible dans la table audit_logs.
 * Ne bloque jamais -- les erreurs de logging sont silencieuses.
 */
export async function logAudit({ action, user_id, ip, metadata }: AuditPayload): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("audit_logs").insert({
      action,
      user_id: user_id ?? null,
      ip: ip ?? null,
      metadata: metadata ?? {},
    });
  } catch {
    // Le logging ne doit jamais faire planter l'app
  }
}
