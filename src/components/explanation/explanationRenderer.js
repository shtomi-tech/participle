import { escapeHtml } from '../../lib/dom.js';

const calloutKinds = new Set(['POINT', 'RULE', 'CAUTION', '入試POINT']);

function renderCallout(callout) {
  const kind = calloutKinds.has(callout.kind) ? callout.kind : 'POINT';
  const className = kind === '入試POINT' ? 'exam-point' : kind.toLowerCase();
  return `<aside class="lesson-callout ${className}" data-callout-kind="${escapeHtml(kind)}"><strong>${escapeHtml(kind)}</strong><p>${escapeHtml(callout.text)}</p></aside>`;
}

function renderExample(example, index) {
  return `
    <article class="lesson-example" data-example-id="${escapeHtml(example.id ?? `example-${index + 1}`)}">
      <p class="lesson-example-label">Example ${index + 1}</p>
      <p class="lesson-example-english" lang="en">${escapeHtml(example.english)}</p>
      <p class="lesson-example-translation">${escapeHtml(example.translation)}</p>
      ${example.structure ? `<p class="lesson-example-structure"><strong>Structure</strong> ${escapeHtml(example.structure)}</p>` : ''}
      ${example.point ? `<p class="lesson-example-point"><strong>Point</strong> ${escapeHtml(example.point)}</p>` : ''}
    </article>`;
}

function renderExamples(examples) {
  if (!Array.isArray(examples) || examples.length === 0) return '';
  return `<div class="lesson-example-grid" data-examples>${examples.map(renderExample).join('')}</div>`;
}

function renderTextList(items, className, label, kind) {
  return `
    <section class="lesson-list-section ${className}" data-explanation-kind="${escapeHtml(kind)}">
      <h3>${escapeHtml(label)}</h3>
      <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </section>`;
}

function renderReviewItems(items) {
  if (!Array.isArray(items) || items.length === 0) return '';
  return `
    <section class="lesson-review-notes" data-explanation-kind="detailed-review">
      <h2>Detailed Review</h2>
      ${items.map((item) => `
        <article class="lesson-review-note">
          <h3>${escapeHtml(item.title)}</h3>
          ${item.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
        </article>`).join('')}
    </section>`;
}

function renderSources(sourceEvidence) {
  return `
    <section class="lesson-sources" data-explanation-kind="source-evidence">
      <h3>Source evidence</h3>
      <ul>${sourceEvidence.map((evidence) => `<li><code>${escapeHtml(evidence.source)}:${escapeHtml(evidence.section)}</code> — ${escapeHtml(evidence.concept)}</li>`).join('')}</ul>
    </section>`;
}

function renderSectionSources(sourceEvidence) {
  return `<ul class="lesson-section-sources" aria-label="この説明の出典">${sourceEvidence.map((evidence) => `<li><code>${escapeHtml(evidence.source)}:${escapeHtml(evidence.section)}</code> — ${escapeHtml(evidence.concept)}</li>`).join('')}</ul>`;
}

export function renderExplanationContent(content, { includeClosingSections = true } = {}) {
  return `
    <div class="lesson-explanation" data-explanation-content>
      <p class="lesson-introduction" data-explanation-introduction>${escapeHtml(content.introduction)}</p>
      ${content.sections.map((section) => `
        <section class="lesson-explanation-section" data-explanation-section="${escapeHtml(section.id)}">
          <h2>${escapeHtml(section.title)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
          ${renderExamples(section.examples)}
          ${(section.callouts ?? []).map(renderCallout).join('')}
          ${renderSectionSources(section.sourceEvidence)}
        </section>`).join('')}
      ${renderTextList(content.keyRules, 'key-rules', 'Key Rules', 'key-rules')}
      ${renderTextList(content.commonMistakes, 'common-mistakes', 'よくある間違い', 'common-mistakes')}
      ${renderTextList(content.examPoints, 'exam-points', '入試POINT', 'exam-points')}
      ${includeClosingSections ? renderExplanationClosing(content) : ''}
    </div>`;
}

export function renderExplanationClosing(content) {
  return `${renderReviewItems(content.detailedReview)}${renderTextList(content.summary, 'lesson-summary', 'Lesson Summary', 'summary')}${renderSources(content.sourceEvidence)}`;
}

export function mountExplanation(root, content, options = {}) {
  if (!root || typeof root.innerHTML !== 'string') throw new TypeError('An explanation root is required');
  root.innerHTML = renderExplanationContent(content, options);
  return () => {
    root.innerHTML = '';
  };
}
