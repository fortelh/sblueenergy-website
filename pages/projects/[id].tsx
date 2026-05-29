import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import axios from 'axios';

interface Project {
  id: string;
  titleEN: string;
  titleDE: string;
  descriptionEN: string;
  descriptionDE: string;
  image: string;
}

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const { t, i18n } = useTranslation(['projects', 'common']);
  const isGerman = i18n.language === 'de';

  return (
    <div>
      {/* Back Link */}
      <div className="container-custom pt-8">
        <Link href="/projects" className="text-blue-600 hover:text-blue-800 font-semibold">
          ← {t('back')}
        </Link>
      </div>

      {/* Project Content */}
      <section className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Project Image */}
          {project.image && (
            <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={project.image}
                alt={isGerman ? project.titleDE : project.titleEN}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Project Title */}
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {isGerman ? project.titleDE : project.titleEN}
          </h1>

          {/* Project Description */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {isGerman ? project.descriptionDE : project.descriptionEN}
          </div>
        </div>
      </section>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await axios.get(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects`);
    const projects = res.data || [];

    const paths = projects.flatMap((project: Project) => [
      { params: { id: project.id }, locale: 'en' },
      { params: { id: project.id }, locale: 'de' },
    ]);

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching projects for paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<ProjectDetailProps> = async ({ locale, params }) => {
  try {
    const res = await axios.get(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects/${params?.id}`);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['projects', 'common'])),
        project: res.data,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return {
      notFound: true,
    };
  }
};
