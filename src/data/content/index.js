import { lesson1Content } from './lesson-1.js';
import { lesson2Content } from './lesson-2.js';
import { lesson3Content } from './lesson-3.js';
import { lesson4Content } from './lesson-4.js';
import { lesson5Content } from './lesson-5.js';
import { lesson6Content } from './lesson-6.js';

export const lessonContents = [
  lesson1Content,
  lesson2Content,
  lesson3Content,
  lesson4Content,
  lesson5Content,
  lesson6Content,
];

export const lessonContentRegistry = Object.fromEntries(
  lessonContents.map((content) => [content.lessonId, content]),
);

export function getLessonContent(lessonId) {
  return lessonContentRegistry[lessonId];
}

export {
  lesson1Content,
  lesson2Content,
  lesson3Content,
  lesson4Content,
  lesson5Content,
  lesson6Content,
};
