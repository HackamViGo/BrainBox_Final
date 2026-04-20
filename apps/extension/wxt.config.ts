import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'BrainBox',
    version: '2.0.0',
    description: 'Premium AI conversation organizer.',
    permissions: ['storage', 'contextMenus', 'tabs', 'alarms', 'activeTab', 'scripting', 'webNavigation'],
    host_permissions: [
      'https://gemini.google.com/*',
      'https://chatgpt.com/*',
      'https://claude.ai/*',
      'https://*.brainbox.ai/*',
      'http://localhost:3000/*',
    ],
  },
  vite: () => ({
    build: {
      minify: 'oxc',
      cssMinify: 'lightningcss',
      target: 'chrome120',
    },
    server: {
      port: 3001,
    },
  }),
});
