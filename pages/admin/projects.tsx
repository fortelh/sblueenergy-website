import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  id: string;
  titleEN: string;
  titleDE: string;
  descriptionEN: string;
  descriptionDE: string;
  image: string;
}

export default function ManageProjects() {
  const { t } = useTranslation(['admin', 'common']);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    titleEN: '',
    titleDE: '',
    descriptionEN: '',
    descriptionDE: '',
    image: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage({ type: 'error', text: 'Failed to load projects' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage({ type: 'success', text: 'Project updated successfully' });
      } else {
        await axios.post('/api/projects', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage({ type: 'success', text: 'Project created successfully' });
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save project' });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Project deleted successfully' });
      fetchProjects();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete project' });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      titleEN: '',
      titleDE: '',
      descriptionEN: '',
      descriptionDE: '',
      image: '',
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{t('manageProjects')}</h1>
          </div>

          {/* Create/Edit Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingId ? 'Edit Project' : 'Create New Project'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title (English)</label>
                  <input
                    type="text"
                    name="titleEN"
                    value={formData.titleEN || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title (Deutsch)</label>
                  <input
                    type="text"
                    name="titleDE"
                    value={formData.titleDE || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                  <textarea
                    name="descriptionEN"
                    value={formData.descriptionEN || ''}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Deutsch)</label>
                  <textarea
                    name="descriptionDE"
                    value={formData.descriptionDE || ''}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingId ? 'Update' : 'Create'} Project
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 font-medium"
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Projects List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{project.titleEN}</p>
                          <p className="text-sm text-gray-600">{project.titleDE}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {project.image && (
                          <div className="relative w-12 h-12">
                            <Image
                              src={project.image}
                              alt={project.titleEN}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(project)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-blue-600"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          {t('delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
