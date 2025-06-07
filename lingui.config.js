/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  sourceLocale: 'ko',
  locales: ['en', 'ko'],
  catalogs: [
    {
      path: '<rootDir>/src/locale/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
}
