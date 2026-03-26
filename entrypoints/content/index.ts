import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['https://chat.openai.com/*', 'https://chatgpt.com/*'],
  main() {
    // Content script entrypoint for future extraction logic.
  },
});

