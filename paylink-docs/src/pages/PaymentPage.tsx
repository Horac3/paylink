import { PageLayout } from '../components/layout/PageLayout';
import { EndpointDoc } from '../components/docs/EndpointDoc';
import { paymentEndpoints } from '../data/endpoints';

export function PaymentPage() {
  return (
    <PageLayout
      title="Initiate Payment"
      description="Trigger a USSD push payment via a link slug. The rail is auto-detected from the MSISDN prefix. Poll the status endpoint until SUCCESS or FAILED."
    >
      {paymentEndpoints.map((ep) => (
        <EndpointDoc key={ep.id} endpoint={ep} />
      ))}
    </PageLayout>
  );
}
