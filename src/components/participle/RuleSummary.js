import { escapeHtml } from '../../lib/dom.js';

export function renderRuleSummary(text, { complete = false } = {}) {
  return `<aside class="spec-rule-summary${complete ? ' is-complete' : ''}" data-spec-rule-summary><span>RULE SUMMARY</span><strong>${escapeHtml(text)}</strong></aside>`;
}
