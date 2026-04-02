import { PageLayout } from '../components/layout/PageLayout';
import { EndpointDoc } from '../components/docs/EndpointDoc';
import { linksEndpoints } from '../data/endpoints';

export function LinksPage() {
  return (
    <PageLayout
      title="Payment Links"
      description="Create shareable payment links. Supports one-time fixed amounts, open (payer-defined amount), and recurring billing."
    >
      {linksEndpoints.map((ep) => (
        <EndpointDoc key={ep.id} endpoint={ep} />
      ))}
    </PageLayout>
  );
}
