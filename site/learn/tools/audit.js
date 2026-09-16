#!/usr/bin/env node
/* Render every chapter and flag rendering smells: leaked fences, raw markdown, empty sections. */
const fs = require('fs'), path = require('path');
const MD = require('../assets/js/md.js');
const dir = path.join(__dirname, '..', 'courses');
let issues = 0;
fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_')).sort().forEach(f => {
  const c = MD.parseCourse(fs.readFileSync(path.join(dir, f), 'utf8'));
  c.chapters.forEach(ch => {
    const html = MD.render(ch.body) + MD.render(ch.exercises || '') + ch.interview.map(i => MD.render(i.a)).join('');
    const flags = [];
    if (/```/.test(html.replace(/<pre>[\s\S]*?<\/pre>/g, ''))) flags.push('leaked ``` fence');
    if (/<p>#{1,6}\s/.test(html)) flags.push('raw heading in paragraph');
    if (/<p>\s*\|/.test(html)) flags.push('table not parsed');
    if (/<p>(-|\*|\d+\.)\s/.test(html)) flags.push('list not parsed');
    if (/\*\*[^<]*\*\*/.test(html.replace(/<pre>[\s\S]*?<\/pre>/g, '').replace(/<code>[\s\S]*?<\/code>/g, ''))) flags.push('raw ** bold');
    if (ch.tryit && ch.tryit.code.trim().length < 10) flags.push('tiny tryit');
    if (flags.length) { issues++; console.log(`${f} :: ${ch.level} / ${ch.title} (line ${ch.line}) -> ${flags.join(', ')}`); }
  });
});
console.log(issues ? `\n${issues} chapters with rendering smells` : 'No rendering smells found');
