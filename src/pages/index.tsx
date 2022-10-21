import Layout from '../components/layout';
import useUser from '../../lib/useUser';

export default function index() {
  const { user, mutateUser } = useUser({
    redirectTo: '/proyectos',
    redirectIfFound: true,
  });
  return (
    <Layout>
      <header className="bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"></div>
      </header>
    </Layout>
  );
}
