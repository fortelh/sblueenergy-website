import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import axios from 'axios';
import { useState } from 'react';

interface Project {
  id: string;
  titleEN: string;
  titleDE: string;
  descriptionEN: string;
  descriptionDE: string;
  image: string;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const { t, i18n } = useTranslation(['projects', 'common']);
  const isGerman = i18n.language === 'de';
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg">{t('description')}</p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container-custom py-16">
        {paginatedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">{t('noProjects')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={isGerman ? project.titleDE : project.titleEN}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      {isGerman ? project.titleDE : project.titleEN}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {isGerman ? project.descriptionDE : project.descriptionEN}
                    </p>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {t('viewDetails')} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps<ProjectsProps> = async ({ locale }) => {
  try {
    const res = await axios.get(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects`);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['projects', 'common'])),
        projects: res.data || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['projects', 'common'])),
        projects: [],
      },
      revalidate: 10,
    };
  }
};
