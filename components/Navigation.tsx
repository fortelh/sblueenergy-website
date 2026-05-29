import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SblueenergyLogo from './SblueenergyLogo';

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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <SblueenergyLogo size="md" />
          <div>
            <h1 className="text-xl font-bold text-blue-600">Sblueenergy</h1>
            <p className="text-xs text-green-600 font-semibold">Renewable Energy</p>
          </div>
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
        <div className={`${isOpen ? 'block' : 'hidden'} md:flex gap-8 items-center absolute md:static top-full left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}>
          {!isAdmin && (
            <>
              <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
                {t('nav.home')}
              </Link>
              <Link href="/projects" className="hover:text-blue-600 transition-colors font-medium">
                {t('nav.projects')}
              </Link>
              <Link href="/about" className="hover:text-blue-600 transition-colors font-medium">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="hover:text-blue-600 transition-colors font-medium">
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
      className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg font-medium transition-all"
    >
      {i18n.language === 'en' ? 'DE 🇩🇪' : 'EN 🇬🇧'}
    </button>
  );
}
