import { escapeHtml } from './lib/dom.js';
import { getLessonBySlug, lessons } from './data/lessons.js';
import { getProblemById } from './data/problems/index.js';
import { mountDemoProblem } from './components/demos/registry.js';
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
      <p class="eyebrow">Participle / vertical slice</p>
      <h1>分詞を見たら、<span>名詞と動詞の関係を見る。</span></h1>
      <p class="lead">分詞の形を暗記する前に、説明される名詞と元動詞の関係を操作して確かめます。</p>
      <section class="lesson-list" aria-label="Lessons">
        ${lessonCards}
      </section>
    </main>`;
}

function renderLesson(lesson) {
  document.title = `${lesson.label}: ${lesson.title}`;
  const lessonIndex = lessons.findIndex((entry) => entry.id === lesson.id);
  const previousLesson = lessons[lessonIndex - 1];
  const nextLesson = lessons[lessonIndex + 1];
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
      <section class="lesson-player" aria-labelledby="step-title">
        <div class="progress-row"><strong data-step-label></strong><span data-progress-text></span></div>
        <div class="progress-bar" aria-hidden="true"><span data-progress-bar></span></div>
        <div class="step-copy"><p class="eyebrow">Current step</p><h2 id="step-title" tabindex="-1" data-step-title></h2><p data-step-instruction></p></div>
        <div class="lesson-component" data-lesson-component></div>
        <div class="lesson-completion" data-lesson-completion role="status" aria-live="polite"></div>
        <nav class="lesson-navigation" aria-label="Lesson navigation">
          <button class="button secondary" type="button" data-previous>← Previous</button>
          <button class="button" type="button" data-next>Next →</button>
        </nav>
        <nav class="lesson-switcher" aria-label="Move between lessons">
          ${previousLesson ? `<a class="button secondary" href="#lessons/${escapeHtml(previousLesson.slug)}">← ${escapeHtml(previousLesson.label)}</a>` : '<span></span>'}
          ${nextLesson ? `<a class="button secondary" href="#lessons/${escapeHtml(nextLesson.slug)}">${escapeHtml(nextLesson.label)} →</a>` : '<span class="lesson-switcher-end">All foundation lessons shown</span>'}
        </nav>
      </section>
    </main>`;

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

  renderStep(false);
}

function render() {
  const route = getRoute();
  const lesson = route.page === 'lesson' ? getLessonBySlug(route.slug) : null;
  if (lesson) renderLesson(lesson);
  else renderHome();
}

window.addEventListener('hashchange', render);
render();
