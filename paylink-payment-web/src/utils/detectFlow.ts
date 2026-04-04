/**
 * Determines which payment flow to use based on URL parameters.
 * - RECIPIENT: ?r= query param is present (pre-filled recipient token)
 * - GUEST:     fallback — user enters their own number
 */
export type FlowType = 'RECIPIENT' | 'GUEST'

export function detectFlow(searchParams: URLSearchParams): FlowType {
  if (searchParams.has('r') && searchParams.get('r')) {
    return 'RECIPIENT'
  }
  return 'GUEST'
}

export function getRecipientToken(searchParams: URLSearchParams): string | null {
  return searchParams.get('r')
}
