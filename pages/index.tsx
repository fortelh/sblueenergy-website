import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import axios from 'axios';

interface Project {
  id: string;
  titleEN: string;
  titleDE: string;
  descriptionEN: string;
  descriptionDE: string;
  image: string;
}

interface HomePageData {
  id: string;
  introductionEN: string;
  introductionDE: string;
  heroImage: string;
}

interface HomeProps {
  homeData: HomePageData;
  projects: Project[];
}

export default function Home({ homeData, projects }: HomeProps) {
  const { t, i18n } = useTranslation(['home', 'common']);
  const isGerman = i18n.language === 'de';

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-teal-600 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">{t('hero')}</h1>
          <p className="text-xl">{t('heroSubtitle')}</p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="container-custom py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            {isGerman ? homeData.introductionDE : homeData.introductionEN}
          </p>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">{t('projects')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {projects.slice(0, 3).map((project) => (
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
                  <h3 className="text-xl font-bold mb-2">
                    {isGerman ? project.titleDE : project.titleEN}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isGerman ? project.descriptionDE : project.descriptionEN}
                  </p>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {t('viewProjects')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/projects" className="btn-primary inline-block">
              {t('viewProjects')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  try {
    const homeRes = await axios.get(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/pages/home`);
    const projectsRes = await axios.get(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects`);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['home', 'common'])),
        homeData: homeRes.data || { introductionEN: '', introductionDE: '', heroImage: '' },
        projects: projectsRes.data || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['home', 'common'])),
        homeData: { introductionEN: '', introductionDE: '', heroImage: '' },
        projects: [],
      },
      revalidate: 10,
    };
  }
};
