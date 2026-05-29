import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import axios from 'axios';

interface AboutPageData {
  id: string;
  descriptionEN: string;
  descriptionDE: string;
  teamInfoEN?: string;
  teamInfoDE?: string;
}

interface AboutProps {
  aboutData: AboutPageData;
}

export default function About({ aboutData }: AboutProps) {
  const { t, i18n } = useTranslation(['about', 'common']);
  const isGerman = i18n.language === 'de';

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg">{t('description')}</p>
        </div>
      </section>

      {/* About Content */}
      <section className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">About Sblueenergy</h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {isGerman ? aboutData.descriptionDE : aboutData.descriptionEN}
            </p>
          </div>

          {/* Team Section */}
          {(aboutData.teamInfoEN || aboutData.teamInfoDE) && (
            <div className="bg-gray-50 rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">{t('teamSection')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {isGerman ? aboutData.teamInfoDE : aboutData.teamInfoEN}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps<AboutProps> = async ({ locale }) => {
  try {
    const res = await axios.get(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/pages/about`);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['about', 'common'])),
        aboutData: res.data || { descriptionEN: '', descriptionDE: '' },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching about data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['about', 'common'])),
        aboutData: { descriptionEN: '', descriptionDE: '' },
      },
      revalidate: 10,
    };
  }
};
