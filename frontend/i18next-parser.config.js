export default {
  locales: ['en', 'id'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{ts,tsx}'],
  sort: true,
  createOldCatalogs: false,
  useKeysAsDefaultValue: true
};
