/**
 * PawaPay sandbox test numbers for Malawi.
 * These numbers trigger deterministic outcomes in the sandbox environment.
 * Only used in development — never shown in production builds.
 */

export type SandboxStatus = 'COMPLETED' | 'SUBMITTED' | 'FAILED'

export interface SandboxNumber {
  msisdn: string        // E.164 e.g. 265883456049
  localDigits: string   // 9-digit local e.g. 883456049
  expectedStatus: SandboxStatus
  failureCode?: string
  providerCode: 'TNM_MWI' | 'AIRTEL_MWI'
  label: string
}

/** Deposit test numbers (used when payer pays into a link) */
export const SANDBOX_DEPOSIT_NUMBERS: SandboxNumber[] = [
  // TNM (88x)
  {
    msisdn: '265883456049', localDigits: '883456049',
    expectedStatus: 'FAILED', failureCode: 'INSUFFICIENT_BALANCE',
    providerCode: 'TNM_MWI', label: 'TNM · Insufficient Balance',
  },
  {
    msisdn: '265883456069', localDigits: '883456069',
    expectedStatus: 'FAILED', failureCode: 'UNSPECIFIED_FAILURE',
    providerCode: 'TNM_MWI', label: 'TNM · Unspecified Failure',
  },
  {
    msisdn: '265883456129', localDigits: '883456129',
    expectedStatus: 'SUBMITTED',
    providerCode: 'TNM_MWI', label: 'TNM · Submitted',
  },
  {
    msisdn: '265883456789', localDigits: '883456789',
    expectedStatus: 'COMPLETED',
    providerCode: 'TNM_MWI', label: 'TNM · Completed',
  },
  // TNM (99x)
  {
    msisdn: '265993456049', localDigits: '993456049',
    expectedStatus: 'FAILED', failureCode: 'INSUFFICIENT_BALANCE',
    providerCode: 'TNM_MWI', label: 'TNM · Insufficient Balance',
  },
  {
    msisdn: '265993456069', localDigits: '993456069',
    expectedStatus: 'FAILED', failureCode: 'UNSPECIFIED_FAILURE',
    providerCode: 'TNM_MWI', label: 'TNM · Unspecified Failure',
  },
  {
    msisdn: '265993456129', localDigits: '993456129',
    expectedStatus: 'SUBMITTED',
    providerCode: 'TNM_MWI', label: 'TNM · Submitted',
  },
  {
    msisdn: '265993456789', localDigits: '993456789',
    expectedStatus: 'COMPLETED',
    providerCode: 'TNM_MWI', label: 'TNM · Completed',
  },
]
