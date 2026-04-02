import type { Endpoint, NavGroup } from '../types';

export const authEndpoints: Endpoint[] = [
  {
    id: 'auth-register',
    method: 'POST',
    path: '/auth/register',
    title: 'Register',
    description: 'Create a new merchant account. Returns a JWT token pair on success.',
    auth: false,
    bodyParams: [
      { name: 'email', type: 'string', required: true, description: 'Merchant email address', example: 'merchant@example.com' },
      { name: 'businessName', type: 'string', required: true, description: 'Business display name', example: 'Acme Ltd' },
      { name: 'password', type: 'string', required: true, description: 'Minimum 8 characters', example: 'Secr3t!pass' },
    ],
    responseExample: {
      merchantId: 'merch_01abc123',
      email: 'merchant@example.com',
      businessName: 'Acme Ltd',
      accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
  {
    id: 'auth-login',
    method: 'POST',
    path: '/auth/login',
    title: 'Login',
    description: 'Authenticate with email and password. Returns a JWT access/refresh token pair.',
    auth: false,
    bodyParams: [
      { name: 'email', type: 'string', required: true, description: 'Merchant email', example: 'merchant@example.com' },
      { name: 'password', type: 'string', required: true, description: 'Account password', example: 'Secr3t!pass' },
    ],
    responseExample: {
      accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      expiresIn: 900,
    },
  },
  {
    id: 'auth-refresh',
    method: 'POST',
    path: '/auth/refresh',
    title: 'Refresh Token',
    description: 'Exchange a refresh token for a new access/refresh token pair. Refresh tokens rotate on use.',
    auth: false,
    bodyParams: [
      { name: 'refreshToken', type: 'string', required: true, description: 'The refresh token from login/register', example: 'eyJhbGc...' },
    ],
    responseExample: {
      accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      expiresIn: 900,
    },
  },
  {
    id: 'auth-logout',
    method: 'POST',
    path: '/auth/logout',
    title: 'Logout',
    description: 'Invalidate the current session. The client should discard all tokens. Returns 204 No Content.',
    auth: true,
    responseExample: null,
  },
  {
    id: 'auth-me',
    method: 'GET',
    path: '/auth/me',
    title: 'Get Current Merchant',
    description: 'Retrieve the authenticated merchant\'s profile.',
    auth: true,
    responseExample: {
      id: 'merch_01abc123',
      email: 'merchant@example.com',
      businessName: 'Acme Ltd',
      createdAt: '2024-01-15T09:30:00.000Z',
    },
  },
];

export const payerEndpoints: Endpoint[] = [
  {
    id: 'payer-register',
    method: 'POST',
    path: '/payers/register',
    title: 'Register Payer',
    description: 'Register a new payer account. A Firebase OTP is sent to the provided MSISDN for verification.',
    auth: false,
    bodyParams: [
      { name: 'email', type: 'string', required: true, description: 'Payer email address', example: 'payer@example.com' },
      { name: 'msisdn', type: 'string', required: true, description: 'Mobile number in E.164 format', example: '+265881234567' },
    ],
    responseExample: {
      payerId: 'payer_01xyz456',
      email: 'payer@example.com',
      sessionToken: 'eyJhbGc...',
    },
  },
  {
    id: 'payer-verify-otp',
    method: 'POST',
    path: '/payers/verify-otp',
    title: 'Verify OTP',
    description: 'Verify the Firebase OTP received via SMS to activate the payer account.',
    auth: true,
    bodyParams: [
      { name: 'idToken', type: 'string', required: true, description: 'Firebase ID token from OTP verification', example: 'firebase-id-token...' },
    ],
    responseExample: {
      verified: true,
      payerId: 'payer_01xyz456',
    },
  },
  {
    id: 'payer-profile',
    method: 'GET',
    path: '/payers/profile',
    title: 'Get Payer Profile',
    description: 'Retrieve the authenticated payer\'s profile. The MSISDN is never returned.',
    auth: true,
    responseExample: {
      id: 'payer_01xyz456',
      email: 'payer@example.com',
      preferredRail: 'AIRTEL',
      preferredProvider: 'AIRTEL_MALAWI',
      isVerified: true,
      createdAt: '2024-01-15T09:30:00.000Z',
    },
  },
  {
    id: 'payer-preferred-rail',
    method: 'PUT',
    path: '/payers/preferred-rail',
    title: 'Update Preferred Rail',
    description: 'Set the payer\'s preferred payment rail and provider code.',
    auth: true,
    bodyParams: [
      { name: 'rail', type: 'string', required: true, description: 'Payment rail', example: 'AIRTEL', options: ['PAWAPAY', 'TNM', 'AIRTEL'] },
      { name: 'providerCode', type: 'string', required: false, description: 'Provider code within the rail', example: 'AIRTEL_MALAWI' },
    ],
    responseExample: {
      id: 'payer_01xyz456',
      preferredRail: 'AIRTEL',
      preferredProvider: 'AIRTEL_MALAWI',
    },
  },
  {
    id: 'payer-fcm-token',
    method: 'PATCH',
    path: '/payers/fcm-token',
    title: 'Update FCM Token',
    description: 'Update the Firebase Cloud Messaging token for push notifications. Returns 204 No Content.',
    auth: true,
    bodyParams: [
      { name: 'fcmToken', type: 'string', required: true, description: 'Firebase Cloud Messaging device token', example: 'fMjY_aBcD123...' },
    ],
    responseExample: null,
  },
];

export const linksEndpoints: Endpoint[] = [
  {
    id: 'links-create',
    method: 'POST',
    path: '/links',
    title: 'Create Payment Link',
    description: 'Create a new payment link. Supports one-time, open (any amount), and recurring link types.',
    auth: true,
    bodyParams: [
      { name: 'type', type: 'string', required: true, description: 'Link type', example: 'INVOICE', options: ['INVOICE', 'SUBSCRIPTION', 'DONATION', 'REQUEST'] },
      { name: 'amount', type: 'string', required: false, description: 'Fixed amount (omit for OPEN links)', example: '5000' },
      { name: 'currency', type: 'string', required: true, description: 'ISO 4217 currency code', example: 'MWK' },
      { name: 'recurrenceInterval', type: 'string', required: false, description: 'Required for RECURRING', example: 'MONTHLY', options: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] },
      { name: 'maxCycles', type: 'number', required: false, description: 'Max billing cycles for RECURRING', example: 12 },
      { name: 'expiresAt', type: 'string', required: false, description: 'ISO 8601 expiry datetime', example: '2025-12-31T23:59:59Z' },
      { name: 'metadata', type: 'object', required: false, description: 'Arbitrary key/value pairs attached to payments', example: '{}' },
    ],
    responseExample: {
      id: 'ae8e855e-bbfc-42aa-b4b7-8c630845b454',
      slug: '8o6oO6Az',
      url: 'https://paylink.never9to5ive.com/pay/8o6oO6Az',
    },
  },
  {
    id: 'links-get',
    method: 'GET',
    path: '/links/:id',
    title: 'Get Link',
    description: 'Retrieve a payment link by ID.',
    auth: false,
    pathParams: [
      { name: 'id', type: 'string', required: true, description: 'Payment link ID', example: 'link_01ab23cd' },
    ],
    responseExample: {
      id: 'link_01ab23cd',
      slug: 'ab23cd',
      type: 'INVOICE',
      amount: '5000',
      currency: 'MWK',
      status: 'ACTIVE',
      url: 'https://pay.paylink.mw/ab23cd',
      createdAt: '2024-01-15T09:30:00.000Z',
    },
  },
  {
    id: 'links-cancel',
    method: 'DELETE',
    path: '/links/:id',
    title: 'Cancel Link',
    description: 'Cancel a payment link. Cancelled links cannot be paid. Returns 204 No Content.',
    auth: true,
    pathParams: [
      { name: 'id', type: 'string', required: true, description: 'Payment link ID to cancel', example: 'link_01ab23cd' },
    ],
    responseExample: null,
  },
];

export const paymentEndpoints: Endpoint[] = [
  {
    id: 'pay-initiate',
    method: 'POST',
    path: '/pay/:slug/initiate',
    title: 'Initiate Payment',
    description: 'Trigger a USSD push payment for a link. The rail is auto-detected from the MSISDN prefix (TNM: 88/89/99, Airtel: 75-78/97) or can be overridden. Returns a transaction ID immediately; poll `/pay/status/:txnId` for the final result.',
    auth: false,
    pathParams: [
      { name: 'slug', type: 'string', required: true, description: 'Payment link slug', example: 'ab23cd' },
    ],
    bodyParams: [
      { name: 'msisdn', type: 'string', required: false, description: 'Payer mobile number. Auto-detects rail from prefix.', example: '265881234567' },
      { name: 'payerSessionToken', type: 'string', required: false, description: 'Authenticated payer session token (uses saved MSISDN)', example: 'eyJhbGc...' },
      { name: 'providerCode', type: 'string', required: false, description: 'Override provider code', example: 'TNM_MALAWI' },
    ],
    responseExample: {
      transactionId: 'txn_01de45ef',
      status: 'PENDING',
      externalRef: 'uuid-sent-to-provider',
    },
  },
  {
    id: 'pay-status',
    method: 'GET',
    path: '/pay/status/:txnId',
    title: 'Get Transaction Status',
    description: 'Poll the status of a transaction. For TNM/Airtel (polling rails) keep polling until status is `SUCCESS` or `FAILED`. For PawaPay wait for the webhook callback.',
    auth: false,
    pathParams: [
      { name: 'txnId', type: 'string', required: true, description: 'Transaction ID', example: 'txn_01de45ef' },
    ],
    responseExample: {
      transactionId: 'txn_01de45ef',
      status: 'SUCCESS',
      externalRef: 'uuid-sent-to-provider',
    },
  },
];

export const refundEndpoints: Endpoint[] = [
  {
    id: 'refunds-initiate',
    method: 'POST',
    path: '/refunds',
    title: 'Initiate Refund',
    description: 'Initiate a full or partial refund for a settled transaction. Only `SUCCESS` transactions can be refunded. A transaction cannot have more than one active (PENDING/ACCEPTED) refund at a time.',
    auth: true,
    bodyParams: [
      { name: 'transactionId', type: 'string', required: true, description: 'ID of the transaction to refund', example: 'txn_01de45ef' },
      { name: 'amount', type: 'string', required: true, description: 'Refund amount (cannot exceed gross amount)', example: '2500' },
      { name: 'reason', type: 'string', required: true, description: 'Reason for the refund', example: 'Customer request' },
    ],
    responseExample: {
      refundId: 'ref_01gh67ij',
      transactionId: 'txn_01de45ef',
      amount: '2500',
      currency: 'MWK',
      status: 'PENDING',
      reason: 'Customer request',
      createdAt: '2024-01-15T10:00:00.000Z',
    },
  },
  {
    id: 'refunds-get',
    method: 'GET',
    path: '/refunds/:id',
    title: 'Get Refund',
    description: 'Retrieve a specific refund by ID. Scoped to the authenticated merchant.',
    auth: true,
    pathParams: [
      { name: 'id', type: 'string', required: true, description: 'Refund ID', example: 'ref_01gh67ij' },
    ],
    responseExample: {
      id: 'ref_01gh67ij',
      transactionId: 'txn_01de45ef',
      amount: '2500',
      currency: 'MWK',
      status: 'COMPLETED',
      reason: 'Customer request',
      createdAt: '2024-01-15T10:00:00.000Z',
      resolvedAt: '2024-01-15T10:05:00.000Z',
    },
  },
  {
    id: 'refunds-list',
    method: 'GET',
    path: '/refunds',
    title: 'List Refunds',
    description: 'List all refunds for the authenticated merchant, paginated.',
    auth: true,
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)', example: 1 },
      { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 20)', example: 20 },
    ],
    responseExample: {
      data: [
        {
          id: 'ref_01gh67ij',
          transactionId: 'txn_01de45ef',
          amount: '2500',
          currency: 'MWK',
          status: 'COMPLETED',
          reason: 'Customer request',
          createdAt: '2024-01-15T10:00:00.000Z',
        },
      ],
      meta: { page: 1, limit: 20, total: 1 },
    },
  },
];

export const analyticsEndpoints: Endpoint[] = [
  {
    id: 'analytics-link',
    method: 'GET',
    path: '/analytics/links/:id',
    title: 'Link Analytics',
    description: 'Get a performance snapshot for a specific payment link: total collected, transaction counts by status, and conversion rate.',
    auth: true,
    pathParams: [
      { name: 'id', type: 'string', required: true, description: 'Payment link ID', example: 'link_01ab23cd' },
    ],
    responseExample: {
      linkId: 'link_01ab23cd',
      totalCollected: '125000',
      currency: 'MWK',
      successCount: 25,
      failedCount: 3,
      pendingCount: 1,
      conversionRate: 0.89,
    },
  },
  {
    id: 'analytics-merchant',
    method: 'GET',
    path: '/analytics/merchant',
    title: 'Merchant Analytics',
    description: 'Aggregated analytics across all merchant payment links.',
    auth: true,
    responseExample: {
      totalCollected: '450000',
      currency: 'MWK',
      successCount: 90,
      failedCount: 8,
      pendingCount: 2,
      activeLinks: 5,
      conversionRate: 0.91,
    },
  },
];

export const allEndpoints = [
  ...authEndpoints,
  ...payerEndpoints,
  ...linksEndpoints,
  ...paymentEndpoints,
  ...refundEndpoints,
  ...analyticsEndpoints,
];

export const navGroups: NavGroup[] = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Overview', path: '/' },
      { label: 'Authentication', path: '/auth' },
    ],
  },
  {
    label: 'Payers',
    items: [
      { label: 'Payer Accounts', path: '/payers' },
    ],
  },
  {
    label: 'Links & Payments',
    items: [
      { label: 'Payment Links', path: '/links' },
      { label: 'Initiate Payment', path: '/payments' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Refunds', path: '/refunds' },
      { label: 'Analytics', path: '/analytics' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { label: 'Error Codes', path: '/errors' },
    ],
  },
];
