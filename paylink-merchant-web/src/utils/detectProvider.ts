export type Provider = 'TNM' | 'AIRTEL' | 'UNKNOWN';

const TNM_PREFIXES = ['088', '089', '099'];
const AIRTEL_PREFIXES = ['098', '097', '075', '076', '077', '078'];

export function detectProvider(phone: string): Provider {
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('265') ? digits.slice(3) : digits;

  if (TNM_PREFIXES.some((p) => local.startsWith(p))) return 'TNM';
  if (AIRTEL_PREFIXES.some((p) => local.startsWith(p))) return 'AIRTEL';
  return 'UNKNOWN';
}
