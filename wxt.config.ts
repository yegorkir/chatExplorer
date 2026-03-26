import { defineConfig } from 'wxt';

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: 'chatExplorer',
    version: '0.0.0',
    permissions: ['activeTab', 'scripting'],
    action: {
      default_title: 'chatExplorer',
      default_popup: 'entrypoints/popup/index.html',
    },
    icons: {
      16: 'icon-16.png',
      32: 'icon-32.png',
      48: 'icon-48.png',
      128: 'icon-128.png',
    },
    background: {
      service_worker: 'entrypoints/background/index.ts',
      type: 'module',
    },
  },
});

