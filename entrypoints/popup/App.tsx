import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const SUPPORTED_ORIGINS = [
  'https://chatgpt.com',
  'https://chat.openai.com',
];

type PageStatus =
  | 'loading'
  | 'unsupported'
  | 'no-conversation'
  | 'probe-unavailable'
  | 'conversation'
  | 'extraction-failed';

interface ExtractedMessage {
  role: string;
  text: string;
}

type TitleSource = 'suffix' | 'raw' | 'none';

interface ExtractionDiagnostics {
  turnCount: number;
  messageCount: number;
  /** Turns that contained a role element but yielded empty text and showed
   *  no recognisable rich-content signals — likely a genuine parse failure. */
  emptyTextCount: number;
  /** Turns found in the DOM but missing the expected role sub-element. */
  skippedTurnCount: number;
  /** Turns with a role element but no extractable text, where media/rich
   *  content (img, canvas, iframe …) was detected instead. */
  unsupportedTurnCount: number;
  /** Messages whose text came from the role container itself, not a
   *  specific content element (.markdown / .whitespace-pre-wrap). */
  fallbackTextCount: number;
  titleSource: TitleSource;
}

interface ExtractionPreview {
  title: string | null;
  messages: ExtractedMessage[];
  diagnostics: ExtractionDiagnostics;
}

type ConfidenceLevel = 'ok' | 'suspicious';

interface ConfidenceResult {
  level: ConfidenceLevel;
  reasons: string[];
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function isSupportedUrl(url: string): boolean {
  try {
    return SUPPORTED_ORIGINS.includes(new URL(url).origin);
  } catch {
    return false;
  }
}

function deriveConfidence(
  d: ExtractionDiagnostics,
  title: string | null,
): ConfidenceResult {
  const hard: string[] = [];
  const soft: string[] = [];

  // Zero messages is always a hard signal regardless of cause.
  if (d.messageCount === 0) hard.push('No messages extracted');

  // Structural failures (skipped + genuinely empty) are hard only when they
  // affect a significant share of turns (>20%).  A handful of oddball turns
  // in a long conversation are demoted to soft notes.
  const hardFailCount = d.skippedTurnCount + d.emptyTextCount;
  const significant = d.turnCount > 0 && hardFailCount / d.turnCount > 0.2;

  if (d.skippedTurnCount > 0) {
    const msg = `${d.skippedTurnCount} turn(s) could not be parsed`;
    (significant ? hard : soft).push(msg);
  }
  if (d.emptyTextCount > 0) {
    const msg = `${d.emptyTextCount} turn(s) with empty text`;
    (significant ? hard : soft).push(msg);
  }

  // Purely informational — never hard.
  if (d.unsupportedTurnCount > 0)
    soft.push(`${d.unsupportedTurnCount} rich-content turn(s) skipped`);
  if (d.fallbackTextCount > 0)
    soft.push(`${d.fallbackTextCount} message(s) used fallback text extraction`);
  if (title === null) soft.push('No conversation title detected');

  const isSuspicious = hard.length > 0;
  return {
    level: isSuspicious ? 'suspicious' : 'ok',
    reasons: isSuspicious ? [...hard, ...soft] : [],
  };
}

const PREVIEW_COUNT = 3;
const PREVIEW_TEXT_LIMIT = 120;

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '\u2026';
}

// ---------------------------------------------------------------------------
// Async page interaction
// ---------------------------------------------------------------------------

type ProbeResult = 'conversation' | 'no-conversation' | 'probe-unavailable';

async function probeConversation(tabId: number): Promise<ProbeResult> {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      // Intentionally uses the same selector that extractConversation
      // iterates, so a passing probe guarantees extraction has turns to
      // work with.  Earlier versions also checked [data-message-id] but
      // extraction never used that selector, causing false mismatches.
      func: () =>
        document.querySelector('[data-testid^="conversation-turn-"]') !== null,
    });
    if (result?.result === true) return 'conversation';
    if (result?.result === false) return 'no-conversation';
    return 'probe-unavailable';
  } catch {
    return 'probe-unavailable';
  }
}

async function extractConversation(tabId: number): Promise<ExtractionPreview | null> {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const rawTitle = document.title;
        const sfx = ' - ChatGPT';
        let title: string | null = null;
        let titleSource: 'suffix' | 'raw' | 'none' = 'none';

        if (rawTitle.endsWith(sfx)) {
          const t = rawTitle.slice(0, -sfx.length).trim();
          title = t || null;
          titleSource = t ? 'suffix' : 'none';
        } else if (rawTitle !== 'ChatGPT') {
          title = rawTitle;
          titleSource = 'raw';
        }

        const turns = document.querySelectorAll('[data-testid^="conversation-turn-"]');
        const messages: { role: string; text: string }[] = [];
        let skippedTurnCount = 0;
        let emptyTextCount = 0;
        let unsupportedTurnCount = 0;
        let fallbackTextCount = 0;

        for (const turn of turns) {
          const roleEl = turn.querySelector('[data-message-author-role]');
          if (!roleEl) {
            skippedTurnCount++;
            continue;
          }

          // roleEl was found via attribute selector so getAttribute
          // won't return null, but we keep ?? as a defensive fallback.
          const role = roleEl.getAttribute('data-message-author-role') ?? 'unknown';

          const specificEl = roleEl.querySelector('.markdown, .whitespace-pre-wrap');
          const contentEl = specificEl ?? roleEl;
          const text = contentEl.textContent?.trim() ?? '';

          if (!text) {
            // Distinguish rich-content turns (images, canvas, embeds) from
            // genuinely empty/malformed turns.
            const hasMedia = roleEl.querySelector(
              'img, canvas, iframe, video, audio, [role="img"]',
            ) !== null;
            if (hasMedia) {
              unsupportedTurnCount++;
            } else {
              emptyTextCount++;
            }
            continue;
          }

          if (!specificEl) fallbackTextCount++;
          messages.push({ role, text });
        }

        return {
          title,
          messages,
          diagnostics: {
            turnCount: turns.length,
            messageCount: messages.length,
            skippedTurnCount,
            emptyTextCount,
            unsupportedTurnCount,
            fallbackTextCount,
            titleSource,
          },
        };
      },
    });

    const data = result?.result;
    if (data && Array.isArray(data.messages) && data.diagnostics) {
      return data as ExtractionPreview;
    }
    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

const STATUS_LABEL: Record<PageStatus, string> = {
  loading: 'Checking page\u2026',
  unsupported: 'Unsupported tab',
  'no-conversation': 'Supported page, but no conversation found',
  'probe-unavailable': 'Supported page, but page probe is unavailable',
  conversation: 'Conversation page detected',
  'extraction-failed': 'Conversation detected, but extraction failed',
};

export function App() {
  const [status, setStatus] = useState<PageStatus>('loading');
  const [preview, setPreview] = useState<ExtractionPreview | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceResult | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      const url = tab?.url;

      if (!url || !isSupportedUrl(url)) {
        setStatus('unsupported');
        return;
      }

      if (!tab.id) {
        setStatus('probe-unavailable');
        return;
      }

      const probeResult = await probeConversation(tab.id);
      if (probeResult !== 'conversation') {
        setStatus(probeResult);
        return;
      }

      const data = await extractConversation(tab.id);
      if (!data) {
        setStatus('extraction-failed');
        return;
      }

      setPreview(data);
      setConfidence(deriveConfidence(data.diagnostics, data.title));
      setStatus('conversation');
    });
  }, []);

  return (
    <main style={{ width: 360, padding: 12, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 16, margin: 0 }}>chatExplorer</h1>
      <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13, opacity: 0.8 }}>
        {STATUS_LABEL[status]}
      </p>

      {status === 'conversation' && preview && confidence && (
        <section style={{ marginTop: 12 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
            {preview.title ?? 'Untitled conversation'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.6 }}>
            {preview.messages.length} message{preview.messages.length !== 1 ? 's' : ''}
          </p>

          <p
            style={{
              margin: '8px 0 0',
              fontSize: 12,
              fontWeight: 600,
              color: confidence.level === 'ok' ? '#2e7d32' : '#e65100',
            }}
          >
            {confidence.level === 'ok'
              ? 'Extraction looks valid'
              : 'Extraction may be incomplete'}
          </p>
          {confidence.level === 'suspicious' && confidence.reasons.length > 0 && (
            <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: 11, opacity: 0.7 }}>
              {confidence.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
          {confidence.level === 'ok' && preview.diagnostics.unsupportedTurnCount > 0 && (
            <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.55, fontStyle: 'italic' }}>
              {preview.diagnostics.unsupportedTurnCount} rich-content turn(s) were skipped
            </p>
          )}

          {preview.messages.length > 0 && (
            <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none' }}>
              {preview.messages.slice(0, PREVIEW_COUNT).map((msg, i) => (
                <li key={i} style={{ fontSize: 12, marginTop: i > 0 ? 6 : 0 }}>
                  <strong style={{ opacity: 0.7 }}>{msg.role}:</strong>{' '}
                  {truncate(msg.text, PREVIEW_TEXT_LIMIT)}
                </li>
              ))}
              {preview.messages.length > PREVIEW_COUNT && (
                <li style={{ fontSize: 12, marginTop: 6, opacity: 0.5, fontStyle: 'italic' }}>
                  +{preview.messages.length - PREVIEW_COUNT} more
                </li>
              )}
            </ul>
          )}
        </section>
      )}

      {status === 'extraction-failed' && (
        <p style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
          Try refreshing the page and reopening the popup.
        </p>
      )}
    </main>
  );
}

