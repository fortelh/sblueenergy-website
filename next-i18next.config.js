const path = require('path');

const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },
  ns: ['common', 'home', 'about', 'projects', 'contact', 'admin'],
  defaultNS: 'common',
  localePath: path.resolve('./public/locales'),
  interpolation: {
    escapeValue: false,
  },
};

module.exports = config;
