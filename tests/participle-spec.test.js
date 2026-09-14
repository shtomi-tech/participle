import assert from 'node:assert/strict';
import test from 'node:test';
import { participleLessons } from '../src/data/participle-course.js';
import { defaultParticipleProgress, normalizeParticipleProgress } from '../src/lib/participle-progress.js';

test('Lesson 1-5 spec data keeps the required learning checkpoints', () => {
  assert.deepEqual(participleLessons.map((lesson) => lesson.stages.length), [5, 5, 5, 5, 5]);
  assert.deepEqual(participleLessons[0].stages[3].questions.map((question) => question.id), ['l1-q1', 'l1-q2']);
  assert.equal(participleLessons[0].stages[3].questions[1].answer, 'noun');
  assert.deepEqual(participleLessons[2].stages[3].questions.map((question) => question.id), ['l3-q1', 'l3-q2', 'l3-q3-a', 'l3-q3-b']);
  assert.equal(participleLessons[2].stages[2].advanced.title.includes('1語でも後ろ'), true);
  assert.equal(participleLessons[3].stages[2].rapid.length, 3);
  assert.equal(participleLessons[3].stages[2].rapid[0].formAnswer, 'running');
  assert.deepEqual(participleLessons[4].stages[3].questions.map((question) => question.id), ['l5-q1', 'l5-q2', 'l5-q3', 'l5-q4', 'l5-q5']);
  assert.ok(participleLessons[4].stages[3].questions.every((question) => question.noun && question.verb && question.relationAnswer));
});

test('Participle progress restores completed steps and two final scores', () => {
  const defaults = defaultParticipleProgress();
  assert.deepEqual(defaults.lesson5.completedSteps, []);
  const normalized = normalizeParticipleProgress({
    currentLesson: 5,
    lesson5: {
      currentStep: 3,
      completed: false,
      completedSteps: ['look', 'check', 'unknown'],
      quizResults: { 'l5-q1': { formCorrect: true } },
      answerScore: 4,
      reasoningScore: 3,
      finalPassed: true,
    },
  });
  assert.deepEqual(normalized.lesson5.completedSteps, ['look', 'check']);
  assert.equal(normalized.lesson5.currentStep, 3);
  assert.equal(normalized.lesson5.answerScore, 4);
  assert.equal(normalized.lesson5.reasoningScore, 3);
  assert.equal(normalized.lesson5.firstAttemptAnswerScore, 0);
  assert.equal(normalized.lesson5.firstAttemptReasoningScore, 0);
  assert.equal(normalized.lesson5.quizResults['l5-q1'].formCorrect, true);
});
