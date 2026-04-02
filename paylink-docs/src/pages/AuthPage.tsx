import { PageLayout } from '../components/layout/PageLayout';
import { EndpointDoc } from '../components/docs/EndpointDoc';
import { authEndpoints } from '../data/endpoints';

export function AuthPage() {
  return (
    <PageLayout
      title="Authentication"
      description="Register and authenticate merchant accounts. All protected endpoints require an Authorization: Bearer <token> header."
    >
      {authEndpoints.map((ep) => (
        <EndpointDoc key={ep.id} endpoint={ep} />
      ))}
    </PageLayout>
  );
}
