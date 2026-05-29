import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Navigation() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = router.pathname.startsWith('/admin');
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Sblueenergy
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:flex gap-8 items-center`}>
          {!isAdmin && (
            <>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                {t('nav.home')}
              </Link>
              <Link href="/projects" className="hover:text-blue-600 transition-colors">
                {t('nav.projects')}
              </Link>
              <Link href="/about" className="hover:text-blue-600 transition-colors">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="hover:text-blue-600 transition-colors">
                {t('nav.contact')}
              </Link>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                {t('nav.admin')}
              </Link>
            </>
          )}
          {isAdmin && token && (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              {t('nav.logout')}
            </button>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale = i18n.language === 'en' ? 'de' : 'en';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
    >
      {i18n.language === 'en' ? 'DE' : 'EN'}
    </button>
  );
}
