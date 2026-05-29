import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import SblueenergyLogoLarge from './SblueenergyLogoLarge';

export default function Footer() {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12">
                <SblueenergyLogoLarge variant="dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Sblueenergy</h3>
                <p className="text-xs text-green-400">Renewable Energy</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">Leading the future of renewable energy with sustainable solutions.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/" className="hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link href="/projects" className="hover:text-green-400 transition-colors">Projects</Link></li>
              <li><Link href="/about" className="hover:text-green-400 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm">Email: info@sblueenergy.com</p>
            <p className="text-gray-300 text-sm">Address: Energy Street 123, Green City</p>
            <p className="text-gray-300 text-sm">Phone: +1 (555) 123-4567</p>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Facebook</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>{t('footer.copyright')} | {currentYear}</p>
          <p className="mt-2">Designed with ♻️ for a sustainable future</p>
        </div>
      </div>
    </footer>
  );
}
