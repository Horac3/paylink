import { PageLayout } from '../components/layout/PageLayout';
import { EndpointDoc } from '../components/docs/EndpointDoc';
import { refundEndpoints } from '../data/endpoints';

export function RefundsPage() {
  return (
    <PageLayout
      title="Refunds"
      description="Initiate full or partial refunds for settled transactions. Only SUCCESS transactions can be refunded. One active refund per transaction at a time."
    >
      {refundEndpoints.map((ep) => (
        <EndpointDoc key={ep.id} endpoint={ep} />
      ))}
    </PageLayout>
  );
}
