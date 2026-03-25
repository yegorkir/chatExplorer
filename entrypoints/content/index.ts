import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['https://chat.openai.com/*', 'https://chatgpt.com/*'],
  main() {
    // Extraction/export logic will live in `src/core/*`.
    // Content script entrypoint stays minimal for now.
  },
});

