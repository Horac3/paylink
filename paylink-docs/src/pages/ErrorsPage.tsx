import { PageLayout } from '../components/layout/PageLayout';
import { CodeBlock } from '../components/docs/CodeBlock';

interface ErrorRow {
  status: number;
  code: string;
  description: string;
}

const httpErrors: ErrorRow[] = [
  { status: 400, code: 'VALIDATION_ERROR', description: 'Request body failed validation. Check the errors array for field-level details.' },
  { status: 401, code: 'UNAUTHORIZED', description: 'Missing or invalid Bearer token.' },
  { status: 403, code: 'FORBIDDEN', description: 'Token is valid but the merchant does not own this resource.' },
  { status: 404, code: 'NOT_FOUND', description: 'Resource not found.' },
  { status: 409, code: 'CONFLICT', description: 'Duplicate resource (e.g. email already registered).' },
  { status: 422, code: 'DOMAIN_ERROR', description: 'Business rule violation — see the message field.' },
  { status: 500, code: 'INTERNAL_ERROR', description: 'Unexpected server error. Retry with exponential backoff.' },
];

const railErrors: ErrorRow[] = [
  { status: 0, code: 'INVALID_PHONE', description: 'The MSISDN is not a valid TNM or Airtel number.' },
  { status: 0, code: 'SUBSCRIBER_NOT_FOUND', description: 'The mobile number is not registered with the operator.' },
  { status: 0, code: 'INSUFFICIENT_FUNDS', description: 'Payer has insufficient funds (PawaPay).' },
  { status: 0, code: 'PAYER_DECLINED', description: 'Payer rejected the USSD prompt.' },
  { status: 0, code: 'MISSING_RECEIPT_NUMBER', description: 'TNM refund requires the original receipt_number from settlement.' },
  { status: 0, code: 'RAIL_UNAVAILABLE', description: 'Operator API returned a 5xx or connection error. Will be retried.' },
  { status: 0, code: 'RAIL_TIMEOUT', description: 'Network timeout connecting to the operator. Will be retried.' },
  { status: 0, code: 'RAIL_AUTH_ERROR', description: 'Credentials rejected by the operator. Check TNM_PASSWORD / AIRTEL_CLIENT_SECRET.' },
];

const errorShape = `{
  "statusCode": 422,
  "error": "DOMAIN_ERROR",
  "message": "Transaction is not in SUCCESS state",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "path": "/refunds"
}`;

function ErrorTable({ rows }: { rows: ErrorRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            {rows[0]?.status !== 0 && (
              <th className="text-left px-4 py-2.5 text-xs text-text-secondary font-medium w-20">Status</th>
            )}
            <th className="text-left px-4 py-2.5 text-xs text-text-secondary font-medium w-52">Code</th>
            <th className="text-left px-4 py-2.5 text-xs text-text-secondary font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.code} className={`border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-bg' : 'bg-surface/30'}`}>
              {row.status !== 0 && (
                <td className="px-4 py-2.5 font-mono text-xs text-warning">{row.status}</td>
              )}
              <td className="px-4 py-2.5 font-mono text-xs text-accent">{row.code}</td>
              <td className="px-4 py-2.5 text-xs text-text-secondary">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ErrorsPage() {
  return (
    <PageLayout
      title="Error Codes"
      description="PayLink uses standard HTTP status codes. Business-rule violations return 422 with a machine-readable error code."
    >
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-3">Error Response Shape</h2>
        <CodeBlock code={errorShape} language="json" />
      </section>

      <section>
        <h2 className="text-base font-semibold text-text-primary mb-3">HTTP Errors</h2>
        <ErrorTable rows={httpErrors} />
      </section>

      <section>
        <h2 className="text-base font-semibold text-text-primary mb-3">Rail / Domain Errors</h2>
        <p className="text-sm text-text-secondary mb-4">
          These appear in the <code className="text-accent font-mono">error</code> field of a 422 response when a payment rail or domain rule rejects an operation.
        </p>
        <ErrorTable rows={railErrors} />
      </section>
    </PageLayout>
  );
}
