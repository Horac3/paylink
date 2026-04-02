import { PageLayout } from '../components/layout/PageLayout';
import { EndpointDoc } from '../components/docs/EndpointDoc';
import { payerEndpoints } from '../data/endpoints';

export function PayerPage() {
  return (
    <PageLayout
      title="Payer Accounts"
      description="Register payers, verify their mobile number via Firebase OTP, and manage preferences like preferred payment rail."
    >
      {payerEndpoints.map((ep) => (
        <EndpointDoc key={ep.id} endpoint={ep} />
      ))}
    </PageLayout>
  );
}
