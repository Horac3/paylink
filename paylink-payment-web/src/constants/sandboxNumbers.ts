/**
 * PawaPay sandbox test numbers for Malawi.
 * These numbers trigger deterministic outcomes in the sandbox environment.
 * Only used in development — never shown in production builds.
 */

export type SandboxStatus = 'COMPLETED' | 'SUBMITTED' | 'FAILED'
export type SandboxOperation = 'DEPOSIT' | 'PAYOUT'

export interface SandboxNumber {
  msisdn: string           // E.164 full number e.g. 265883456049
  localDigits: string      // 9-digit local e.g. 883456049
  operation: SandboxOperation
  expectedStatus: SandboxStatus
  failureCode?: string
  providerCode: 'TNM_MWI' | 'AIRTEL_MWI'
  label: string
}

export const SANDBOX_NUMBERS: SandboxNumber[] = [
  // ── TNM (88x) ──────────────────────────────────────────────────────────────
  {
    msisdn: '265883456049', localDigits: '883456049', operation: 'DEPOSIT',
    expectedStatus: 'FAILED', failureCode: 'INSUFFICIENT_BALANCE',
    providerCode: 'TNM_MWI', label: 'TNM · Insufficient Balance',
  },
  {
    msisdn: '265883456069', localDigits: '883456069', operation: 'DEPOSIT',
    expectedStatus: 'FAILED', failureCode: 'UNSPECIFIED_FAILURE',
    providerCode: 'TNM_MWI', label: 'TNM · Unspecified Failure',
  },
  {
    msisdn: '265883456129', localDigits: '883456129', operation: 'DEPOSIT',
    expectedStatus: 'SUBMITTED',
    providerCode: 'TNM_MWI', label: 'TNM · Submitted (awaiting callback)',
  },
  {
    msisdn: '265883456789', localDigits: '883456789', operation: 'DEPOSIT',
    expectedStatus: 'COMPLETED',
    providerCode: 'TNM_MWI', label: 'TNM · Completed',
  },
  {
    msisdn: '265883456089', localDigits: '883456089', operation: 'PAYOUT',
    expectedStatus: 'FAILED', failureCode: 'RECIPIENT_NOT_FOUND',
    providerCode: 'TNM_MWI', label: 'TNM · Recipient Not Found',
  },
  {
    msisdn: '265883456119', localDigits: '883456119', operation: 'PAYOUT',
    expectedStatus: 'FAILED', failureCode: 'UNSPECIFIED_FAILURE',
    providerCode: 'TNM_MWI', label: 'TNM · Unspecified Failure',
  },
  {
    msisdn: '265883456129', localDigits: '883456129', operation: 'PAYOUT',
    expectedStatus: 'SUBMITTED',
    providerCode: 'TNM_MWI', label: 'TNM · Submitted (awaiting callback)',
  },
  {
    msisdn: '265883456789', localDigits: '883456789', operation: 'PAYOUT',
    expectedStatus: 'COMPLETED',
    providerCode: 'TNM_MWI', label: 'TNM · Completed',
  },

  // ── TNM (99x) ──────────────────────────────────────────────────────────────
  {
    msisdn: '265993456049', localDigits: '993456049', operation: 'DEPOSIT',
    expectedStatus: 'FAILED', failureCode: 'INSUFFICIENT_BALANCE',
    providerCode: 'TNM_MWI', label: 'TNM · Insufficient Balance',
  },
  {
    msisdn: '265993456069', localDigits: '993456069', operation: 'DEPOSIT',
    expectedStatus: 'FAILED', failureCode: 'UNSPECIFIED_FAILURE',
    providerCode: 'TNM_MWI', label: 'TNM · Unspecified Failure',
  },
  {
    msisdn: '265993456129', localDigits: '993456129', operation: 'DEPOSIT',
    expectedStatus: 'SUBMITTED',
    providerCode: 'TNM_MWI', label: 'TNM · Submitted (awaiting callback)',
  },
  {
    msisdn: '265993456789', localDigits: '993456789', operation: 'DEPOSIT',
    expectedStatus: 'COMPLETED',
    providerCode: 'TNM_MWI', label: 'TNM · Completed',
  },
  {
    msisdn: '265993456089', localDigits: '993456089', operation: 'PAYOUT',
    expectedStatus: 'FAILED', failureCode: 'RECIPIENT_NOT_FOUND',
    providerCode: 'TNM_MWI', label: 'TNM · Recipient Not Found',
  },
  {
    msisdn: '265993456119', localDigits: '993456119', operation: 'PAYOUT',
    expectedStatus: 'FAILED', failureCode: 'UNSPECIFIED_FAILURE',
    providerCode: 'TNM_MWI', label: 'TNM · Unspecified Failure',
  },
  {
    msisdn: '265993456129', localDigits: '993456129', operation: 'PAYOUT',
    expectedStatus: 'SUBMITTED',
    providerCode: 'TNM_MWI', label: 'TNM · Submitted (awaiting callback)',
  },
  {
    msisdn: '265993456789', localDigits: '993456789', operation: 'PAYOUT',
    expectedStatus: 'COMPLETED',
    providerCode: 'TNM_MWI', label: 'TNM · Completed',
  },
]

export const SANDBOX_DEPOSIT_NUMBERS = SANDBOX_NUMBERS.filter((n) => n.operation === 'DEPOSIT')

export function lookupSandboxDeposit(msisdn: string): SandboxNumber | undefined {
  const normalized = msisdn.replace(/\D/g, '')
  return SANDBOX_DEPOSIT_NUMBERS.find((n) => n.msisdn === normalized)
}
