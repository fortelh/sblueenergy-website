import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface AboutPageData {
  id?: string;
  descriptionEN: string;
  descriptionDE: string;
  teamInfoEN?: string;
  teamInfoDE?: string;
}

export default function EditAbout() {
  const { t } = useTranslation(['admin', 'common']);
  const router = useRouter();
  const [formData, setFormData] = useState<AboutPageData>({
    descriptionEN: '',
    descriptionDE: '',
    teamInfoEN: '',
    teamInfoDE: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await axios.get('/api/pages/about', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
        setMessage({ type: 'error', text: t('error') });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, t]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put('/api/pages/about', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: t('saved') });
    } catch (error) {
      setMessage({ type: 'error', text: t('error') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{t('editAbout')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* English Description */}
            <div className="mb-6">
              <label htmlFor="descriptionEN" className="block text-sm font-medium text-gray-700 mb-2">
                Description (English)
              </label>
              <textarea
                id="descriptionEN"
                name="descriptionEN"
                value={formData.descriptionEN}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* German Description */}
            <div className="mb-6">
              <label htmlFor="descriptionDE" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Deutsch)
              </label>
              <textarea
                id="descriptionDE"
                name="descriptionDE"
                value={formData.descriptionDE}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* English Team Info */}
            <div className="mb-6">
              <label htmlFor="teamInfoEN" className="block text-sm font-medium text-gray-700 mb-2">
                Team Info (English) - Optional
              </label>
              <textarea
                id="teamInfoEN"
                name="teamInfoEN"
                value={formData.teamInfoEN || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* German Team Info */}
            <div className="mb-6">
              <label htmlFor="teamInfoDE" className="block text-sm font-medium text-gray-700 mb-2">
                Team Info (Deutsch) - Optional
              </label>
              <textarea
                id="teamInfoDE"
                name="teamInfoDE"
                value={formData.teamInfoDE || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Message Alert */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
              >
                {saving ? 'Saving...' : t('save')}
              </button>
              <Link href="/admin/dashboard" className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium transition-colors">
                {t('cancel')}
              </Link>
            </div>
          </form>
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
