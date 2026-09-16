#!/usr/bin/env node
/* Validate every course in courses/ against CONTENT-SPEC.md. Usage: node tools/validate.js [course-id ...] */
const fs = require('fs'), path = require('path');
const MD = require('../assets/js/md.js');
const dir = path.join(__dirname, '..', 'courses');
const only = process.argv.slice(2);
let files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
if (only.length) files = files.filter(f => only.includes(f.replace(/\.md$/, '')));
let totalErr = 0, totalWarn = 0, totalCh = 0, totalWords = 0, totalQuiz = 0, totalIQ = 0;
const summary = [];
for (const f of files.sort()) {
  const id = f.replace(/\.md$/, '');
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const course = MD.parseCourse(text);
  const { errors, warnings } = MD.validateCourse(course, id);
  const ch = course.chapters.length, words = course.chapters.reduce((a, c) => a + c.words, 0);
  const quiz = course.chapters.reduce((a, c) => a + c.quiz.length, 0), iq = course.chapters.reduce((a, c) => a + c.interview.length, 0);
  totalCh += ch; totalWords += words; totalQuiz += quiz; totalIQ += iq; totalErr += errors.length; totalWarn += warnings.length;
  summary.push({ id, ch, words, quiz, iq, errors: errors.length, warnings: warnings.length });
  if (errors.length || (warnings.length && process.env.WARN)) {
    console.log(`\n== ${f} ==`);
    errors.forEach(e => console.log('  ERROR   ' + e));
    if (process.env.WARN) warnings.forEach(w => console.log('  warning ' + w));
  }
}
console.log('\nid'.padEnd(28) + 'chapters  words   quiz  interview  errors  warnings');
summary.forEach(s => console.log(s.id.padEnd(27) + String(s.ch).padStart(8) + String(s.words).padStart(8) + String(s.quiz).padStart(6) + String(s.iq).padStart(10) + String(s.errors).padStart(8) + String(s.warnings).padStart(9)));
console.log(`\n${files.length} courses, ${totalCh} chapters, ${totalWords} words, ${totalQuiz} quiz questions, ${totalIQ} interview questions, ${totalErr} errors, ${totalWarn} warnings`);
process.exit(totalErr ? 1 : 0);
