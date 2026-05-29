import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  const { t } = useTranslation(['admin', 'common']);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-600 text-white py-8">
          <div className="container-custom flex justify-between items-center">
            <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Edit Home Page */}
            <Link href="/admin/edit-home">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{t('editHome')}</h2>
                <p className="text-gray-600">Edit introduction text and hero image</p>
              </div>
            </Link>

            {/* Edit About Page */}
            <Link href="/admin/edit-about">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{t('editAbout')}</h2>
                <p className="text-gray-600">Edit company description and team info</p>
              </div>
            </Link>

            {/* Manage Projects */}
            <Link href="/admin/projects">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{t('manageProjects')}</h2>
                <p className="text-gray-600">Create, edit, and delete projects</p>
              </div>
            </Link>

            {/* Contact Settings */}
            <Link href="/admin/settings">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{t('contactSettings')}</h2>
                <p className="text-gray-600">Configure contact form email address</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['admin', 'common'])),
    },
  };
};
