import { useEffect, useState } from 'react';

const SUPPORTED_ORIGINS = [
  'https://chatgpt.com',
  'https://chat.openai.com',
];

function isSupportedUrl(url: string): boolean {
  try {
    return SUPPORTED_ORIGINS.includes(new URL(url).origin);
  } catch {
    return false;
  }
}

export function App() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url;
      setSupported(url ? isSupportedUrl(url) : false);
    });
  }, []);

  const label =
    supported === null
      ? 'Checking page\u2026'
      : supported
        ? 'ChatGPT page detected'
        : 'Unsupported tab';

  return (
    <main style={{ width: 360, padding: 12, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 16, margin: 0 }}>chatExplorer</h1>
      <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13, opacity: 0.8 }}>
        {label}
      </p>
    </main>
  );
}

