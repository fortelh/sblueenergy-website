import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.js';
import Layout from '@/components/Layout';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
