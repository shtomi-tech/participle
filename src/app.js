import { escapeHtml } from './lib/dom.js';
import { getLessonBySlug, lessons } from './data/lessons.js';
import { getLessonContent } from './data/content/index.js';
import { getProblemById, getProblemsByType } from './data/problems/index.js';
import { mountDemoProblem } from './components/demos/registry.js';
import { mountExplanation, renderExplanationClosing } from './components/explanation/explanationRenderer.js';
import { getLessonProgress, isLessonStepComplete, markLessonStepComplete } from './lib/lesson-progress.js';

const app = document.querySelector('#app');

function getRoute() {
  const parts = window.location.hash.replace(/^#/, '').split('/');
  if (parts[0] === 'lessons' && parts[1]) return { page: 'lesson', slug: decodeURIComponent(parts.slice(1).join('/')) };
  return { page: 'home' };
}

function renderHome() {
  document.title = '分詞インタラクティブ教材';
  const lessonCards = lessons.map((lesson, index) => `
    <article class="lesson-card">
      <p class="step-label">${escapeHtml(lesson.label)}</p>
      <h2>${escapeHtml(lesson.title)}</h2>
      <p>${escapeHtml(lesson.description)}</p>
      <a class="button" href="#lessons/${escapeHtml(lesson.slug)}">${index === 0 ? 'Lesson 1を始める' : `${escapeHtml(lesson.label)}へ進む`} →</a>
    </article>`).join('');
  app.innerHTML = `
    <main class="home shell">
      <p class="eyebrow">Participle / explanation first</p>
      <h1>分詞を見たら、<span>名詞と動詞の関係を見る。</span></h1>
      <p class="lead">解説と例文を先に読み、文構造を見てからInteractionで確認し、最後に大学入試形式へ応用します。</p>
      <p class="learning-loop" aria-label="Learning loop">LEARN → SEE → TOUCH → PRACTICE → REVIEW</p>
      <section class="lesson-list" aria-label="Lessons">
        ${lessonCards}
      </section>
    </main>`;
}

function setupAssessment({ section, type, problems, heading, counter, componentRoot, previous, next }) {
  if (problems.length === 0) {
    section.hidden = true;
    return () => {};
  }

  let problemIndex = 0;
  let cleanup = null;
  const headingLabels = {
    'exam-multiple-choice': '4択問題',
    'word-order': '語句整序問題',
    'practice-multiple-choice': 'Lesson 6 Practical',
  };

  function renderAssessment(shouldFocus = false) {
    cleanup?.();
    cleanup = null;
    const problem = problems[problemIndex];
    counter.textContent = `${problemIndex + 1} / ${problems.length}`;
    heading.textContent = `${headingLabels[type] ?? type} ${problemIndex + 1} / ${problems.length}`;
    previous.disabled = problemIndex === 0;
    next.disabled = problemIndex === problems.length - 1;
    cleanup = mountDemoProblem(type, componentRoot, problem, { onComplete() {} });
    if (shouldFocus) heading.focus({ preventScroll: true });
  }

  previous.addEventListener('click', () => {
    if (problemIndex === 0) return;
    problemIndex -= 1;
    renderAssessment(true);
  });
  next.addEventListener('click', () => {
    if (problemIndex >= problems.length - 1) return;
    problemIndex += 1;
    renderAssessment(true);
  });
  renderAssessment();
  return () => cleanup?.();
}

function renderLesson(lesson) {
  document.title = `${lesson.label}: ${lesson.title}`;
  const content = getLessonContent(lesson.id);
  if (!content) throw new Error(`Missing lesson content: ${lesson.id}`);
  const lessonIndex = lessons.findIndex((entry) => entry.id === lesson.id);
  const previousLesson = lessons[lessonIndex - 1];
  const nextLesson = lessons[lessonIndex + 1];
  const examProblems = getProblemsByType('exam-multiple-choice').filter((problem) => problem.lessonId === lesson.id);
  const wordOrderProblems = getProblemsByType('word-order').filter((problem) => problem.lessonId === lesson.id && problem.assessmentKind === 'entrance');
  const practicalProblems = getProblemsByType('practice-multiple-choice').filter((problem) => problem.lessonId === lesson.id);
  let stepIndex = 0;
  let completedStepIds = new Set();
  let cleanup = null;

  app.innerHTML = `
    <main class="lesson-page shell">
      <div class="topline"><a href="#">← Lesson list</a><span>${escapeHtml(lesson.id)} · Lesson ${lessonIndex + 1} / ${lessons.length}</span></div>
      <header class="lesson-header">
        <p class="eyebrow">${escapeHtml(lesson.label)}</p>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p>${escapeHtml(lesson.description)}</p>
        <div class="goal"><span>Learning goal</span><p>${escapeHtml(lesson.learningGoal)}</p></div>
      </header>

      <section class="lesson-explanation-shell" data-lesson-explanation aria-labelledby="learn-heading">
        <p class="eyebrow">LEARN · SEE</p>
        <h2 id="learn-heading">このLessonで学ぶこと</h2>
        <div data-explanation-root></div>
      </section>

      <section class="lesson-interactive" data-lesson-interactive aria-labelledby="interactive-heading">
        <p class="eyebrow">TOUCH</p>
        <h2 id="interactive-heading">Interactive Check</h2>
        <p class="lesson-transition">ここまで学んだ内容を、実際に操作して確認しましょう。</p>
        <div class="lesson-player" aria-labelledby="step-title">
          <div class="progress-row"><strong data-step-label></strong><span data-progress-text></span></div>
          <div class="progress-bar" aria-hidden="true"><span data-progress-bar></span></div>
          <div class="step-copy"><p class="eyebrow">Current step</p><h3 id="step-title" tabindex="-1" data-step-title></h3><p data-step-instruction></p></div>
          <div class="lesson-component" data-lesson-component></div>
          <div class="lesson-completion" data-lesson-completion role="status" aria-live="polite"></div>
          <nav class="lesson-navigation" aria-label="Lesson navigation">
            <button class="button secondary" type="button" data-previous>← Previous</button>
            <button class="button" type="button" data-next>Next →</button>
          </nav>
        </div>
      </section>

      <section class="lesson-assessment" data-assessment-section="exam" aria-labelledby="exam-heading">
        <p class="eyebrow">PRACTICE</p>
        <h2 id="exam-heading">大学入試形式に挑戦</h2>
        <p class="assessment-introduction">解説した判断ルールを、初見に近い4択問題へ適用します。誤答しても正答と全選択肢の理由を確認して次へ進めます。</p>
        <div class="assessment-player">
          <div class="assessment-progress"><strong data-exam-heading tabindex="-1"></strong><span data-exam-counter></span></div>
          <div data-exam-component></div>
          <nav class="assessment-navigation" aria-label="4択問題 navigation">
            <button class="button secondary" type="button" data-exam-previous>← 前の問題</button>
            <button class="button" type="button" data-exam-next>次の問題 →</button>
          </nav>
        </div>
      </section>

      <section class="lesson-assessment" data-assessment-section="word-order" aria-labelledby="word-order-heading">
        <p class="eyebrow">PRACTICE</p>
        <h2 id="word-order-heading">入試形式の語句整序に挑戦</h2>
        <p class="assessment-introduction">語句のまとまりを組み立て、正解後に名詞・元動詞・分詞の関係を確認します。</p>
        <div class="assessment-player">
          <div class="assessment-progress"><strong data-word-order-heading tabindex="-1"></strong><span data-word-order-counter></span></div>
          <div data-word-order-component></div>
          <nav class="assessment-navigation" aria-label="語句整序問題 navigation">
            <button class="button secondary" type="button" data-word-order-previous>← 前の問題</button>
            <button class="button" type="button" data-word-order-next>次の問題 →</button>
          </nav>
        </div>
      </section>

      <section class="lesson-assessment" data-assessment-section="practical" aria-labelledby="practical-heading">
        <p class="eyebrow">PRACTICE · LESSON 6</p>
        <h2 id="practical-heading">Lesson 6 Practical</h2>
        <p class="assessment-introduction">OCRで確認できた問題と、欠落箇所を明示的に復元した問題で、形・構造の判断を仕上げます。</p>
        <div class="assessment-player">
          <div class="assessment-progress"><strong data-practical-heading tabindex="-1"></strong><span data-practical-counter></span></div>
          <div data-practical-component></div>
          <nav class="assessment-navigation" aria-label="Lesson 6 Practical navigation">
            <button class="button secondary" type="button" data-practical-previous>← 前の問題</button>
            <button class="button" type="button" data-practical-next>次の問題 →</button>
          </nav>
        </div>
      </section>

      <section class="lesson-closing" data-lesson-closing aria-label="Lesson review">
        <p class="eyebrow">REVIEW</p>
        <div data-closing-root></div>
      </section>

      <nav class="lesson-switcher" aria-label="Move between lessons">
        ${previousLesson ? `<a class="button secondary" href="#lessons/${escapeHtml(previousLesson.slug)}">← ${escapeHtml(previousLesson.label)}</a>` : '<span></span>'}
        ${nextLesson ? `<a class="button secondary" href="#lessons/${escapeHtml(nextLesson.slug)}">${escapeHtml(nextLesson.label)} →</a>` : '<span class="lesson-switcher-end">All foundation lessons shown</span>'}
      </nav>
    </main>`;

  const explanationRoot = app.querySelector('[data-explanation-root]');
  mountExplanation(explanationRoot, content, { includeClosingSections: false });
  app.querySelector('[data-closing-root]').innerHTML = renderExplanationClosing(content);

  const stepLabel = app.querySelector('[data-step-label]');
  const progressText = app.querySelector('[data-progress-text]');
  const progressBar = app.querySelector('[data-progress-bar]');
  const stepTitle = app.querySelector('[data-step-title]');
  const instruction = app.querySelector('[data-step-instruction]');
  const componentRoot = app.querySelector('[data-lesson-component]');
  const completion = app.querySelector('[data-lesson-completion]');
  const previous = app.querySelector('[data-previous]');
  const next = app.querySelector('[data-next]');

  function updateProgress() {
    const progress = getLessonProgress(lesson, completedStepIds);
    progressText.textContent = `${progress.completedCount} / ${progress.totalCount} steps complete · ${progress.percentage}%`;
    progressBar.style.width = `${progress.percentage}%`;
    return progress;
  }

  function getLessonCompletionMessage(progress) {
    if (!progress.allComplete) return 'Step complete — 次の関係へ進めます。';
    if (lessonIndex === lessons.length - 1) return 'All lessons complete — 分詞を見たら、名詞と動詞の関係を見る。';
    return 'Lesson complete — このLessonを最後まで確認しました。';
  }

  function renderStep(shouldFocus = true) {
    const step = lesson.steps[stepIndex];
    const stepComplete = isLessonStepComplete(completedStepIds, step.id);
    cleanup?.();
    stepLabel.textContent = `Step ${stepIndex + 1} / ${lesson.steps.length}`;
    updateProgress();
    stepTitle.textContent = step.title;
    instruction.textContent = step.instruction;
    completion.textContent = stepComplete ? 'Step complete — 次の関係へ進めます。' : '';
    previous.disabled = stepIndex === 0;
    next.disabled = stepIndex === lesson.steps.length - 1 || !stepComplete;
    cleanup = mountDemoProblem(step.interactionType, componentRoot, getProblemForStep(step), {
      onComplete(result) {
        if (result.reset) {
          completedStepIds = new Set([...completedStepIds].filter((id) => id !== step.id));
          const progress = updateProgress();
          completion.textContent = progress.allComplete ? getLessonCompletionMessage(progress) : '';
          next.disabled = true;
          return;
        }
        if (!result.correct) return;
        completedStepIds = markLessonStepComplete(completedStepIds, step.id);
        const progress = updateProgress();
        completion.textContent = getLessonCompletionMessage(progress);
        next.disabled = stepIndex === lesson.steps.length - 1;
      },
    });
    if (shouldFocus) stepTitle.focus({ preventScroll: true });
  }

  function getProblemForStep(step) {
    const problem = getProblemById(step.problemId);
    if (!problem) throw new Error(`Missing problem: ${step.problemId}`);
    return problem;
  }

  previous.addEventListener('click', () => {
    if (stepIndex === 0) return;
    stepIndex -= 1;
    renderStep();
  });
  next.addEventListener('click', () => {
    if (stepIndex >= lesson.steps.length - 1 || next.disabled) return;
    stepIndex += 1;
    renderStep();
  });

  const examCleanup = setupAssessment({
    section: app.querySelector('[data-assessment-section="exam"]'),
    type: 'exam-multiple-choice',
    problems: examProblems,
    heading: app.querySelector('[data-exam-heading]'),
    counter: app.querySelector('[data-exam-counter]'),
    componentRoot: app.querySelector('[data-exam-component]'),
    previous: app.querySelector('[data-exam-previous]'),
    next: app.querySelector('[data-exam-next]'),
  });
  const wordOrderCleanup = setupAssessment({
    section: app.querySelector('[data-assessment-section="word-order"]'),
    type: 'word-order',
    problems: wordOrderProblems,
    heading: app.querySelector('[data-word-order-heading]'),
    counter: app.querySelector('[data-word-order-counter]'),
    componentRoot: app.querySelector('[data-word-order-component]'),
    previous: app.querySelector('[data-word-order-previous]'),
    next: app.querySelector('[data-word-order-next]'),
  });
  const practicalCleanup = setupAssessment({
    section: app.querySelector('[data-assessment-section="practical"]'),
    type: 'practice-multiple-choice',
    problems: practicalProblems,
    heading: app.querySelector('[data-practical-heading]'),
    counter: app.querySelector('[data-practical-counter]'),
    componentRoot: app.querySelector('[data-practical-component]'),
    previous: app.querySelector('[data-practical-previous]'),
    next: app.querySelector('[data-practical-next]'),
  });

  renderStep(false);
  return () => {
    cleanup?.();
    examCleanup();
    wordOrderCleanup();
    practicalCleanup();
  };
}

function render() {
  const route = getRoute();
  const lesson = route.page === 'lesson' ? getLessonBySlug(route.slug) : null;
  if (lesson) renderLesson(lesson);
  else renderHome();
}

window.addEventListener('hashchange', () => {
  render();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});
render();
