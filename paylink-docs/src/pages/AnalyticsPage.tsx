import { PageLayout } from '../components/layout/PageLayout';
import { EndpointDoc } from '../components/docs/EndpointDoc';
import { analyticsEndpoints } from '../data/endpoints';

export function AnalyticsPage() {
  return (
    <PageLayout
      title="Analytics"
      description="Get collection snapshots for individual payment links or aggregated across all links for a merchant."
    >
      {analyticsEndpoints.map((ep) => (
        <EndpointDoc key={ep.id} endpoint={ep} />
      ))}
    </PageLayout>
  );
}
