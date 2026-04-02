import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { CodeBlock } from '../components/docs/CodeBlock';

const quickstart = `# 1. Register a merchant account
curl -X POST http://localhost:3000/auth/register \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"you@example.com","businessName":"Acme Ltd","password":"Secr3t!pass"}'

# 2. Create a payment link
curl -X POST http://localhost:3000/links \\
  -H 'Authorization: Bearer <accessToken>' \\
  -H 'Content-Type: application/json' \\
  -d '{"type":"ONE_TIME","amount":"5000","currency":"MWK"}'

# 3. Initiate a payment (MSISDN auto-detects rail)
curl -X POST http://localhost:3000/pay/<slug>/initiate \\
  -H 'Content-Type: application/json' \\
  -d '{"msisdn":"265881234567"}'

# 4. Poll for the result
curl http://localhost:3000/pay/status/<transactionId>`;

interface QuickLinkProps {
  to: string;
  title: string;
  description: string;
  badge: string;
}

function QuickLink({ to, title, description, badge }: QuickLinkProps) {
  return (
    <Link
      to={to}
      className="block border border-border rounded-xl p-5 bg-surface hover:border-accent/50 transition-colors group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{title}</span>
        <span className="text-xs font-mono bg-border/40 text-text-secondary px-1.5 py-0.5 rounded">{badge}</span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
    </Link>
  );
}

export function HomePage() {
  return (
    <PageLayout
      title="PayLink API Reference"
      description="Accept mobile money payments in Malawi via TNM Mpamba, Airtel Money, and PawaPay — from a single API."
    >
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickLink to="/auth" title="Authentication" description="Register, login, and manage merchant tokens." badge="JWT" />
          <QuickLink to="/payers" title="Payer Accounts" description="Register payers, verify MSISDN via OTP, manage preferences." badge="Firebase" />
          <QuickLink to="/links" title="Payment Links" description="Create shareable payment links (invoice, subscription, donation, request)." badge="Links" />
          <QuickLink to="/payments" title="Initiate Payment" description="Trigger USSD push; poll or receive webhook on settlement." badge="USSD" />
          <QuickLink to="/refunds" title="Refunds" description="Partial and full refunds for settled transactions." badge="Post-payment" />
          <QuickLink to="/analytics" title="Analytics" description="Per-link and merchant-wide collection snapshots." badge="Reporting" />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">Quickstart</h2>
        <CodeBlock code={quickstart} language="bash" label="shell" />
      </section>

      <section>
        <h2 className="text-base font-semibold text-text-primary mb-3">Base URL</h2>
        <p className="text-sm text-text-secondary mb-3">
          All endpoints are relative to the base URL. Use the <strong className="text-text-primary">Config</strong> button (top right) to point the Try-It panel at your running instance.
        </p>
        <CodeBlock code="http://localhost:3000" language="text" />
      </section>

      <section>
        <h2 className="text-base font-semibold text-text-primary mb-3">Payment Rails</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-2.5 text-xs text-text-secondary font-medium">Rail</th>
                <th className="text-left px-4 py-2.5 text-xs text-text-secondary font-medium">Provider</th>
                <th className="text-left px-4 py-2.5 text-xs text-text-secondary font-medium">Prefixes</th>
                <th className="text-left px-4 py-2.5 text-xs text-text-secondary font-medium">Settlement</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-bg">
                <td className="px-4 py-2.5 font-mono text-xs text-accent">TNM</td>
                <td className="px-4 py-2.5 text-xs text-text-secondary">TNM Mpamba</td>
                <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">88, 89, 99</td>
                <td className="px-4 py-2.5 text-xs text-text-secondary">Polling (30s × 20)</td>
              </tr>
              <tr className="border-b border-border bg-surface/30">
                <td className="px-4 py-2.5 font-mono text-xs text-accent">AIRTEL</td>
                <td className="px-4 py-2.5 text-xs text-text-secondary">Airtel Money</td>
                <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">75, 76, 77, 78, 97</td>
                <td className="px-4 py-2.5 text-xs text-text-secondary">Polling (30s × 20)</td>
              </tr>
              <tr className="bg-bg">
                <td className="px-4 py-2.5 font-mono text-xs text-accent">PAWAPAY</td>
                <td className="px-4 py-2.5 text-xs text-text-secondary">PawaPay aggregator</td>
                <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">all others</td>
                <td className="px-4 py-2.5 text-xs text-text-secondary">Webhook callback</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </PageLayout>
  );
}
