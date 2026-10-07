import { createRequire } from 'module';
const SP=process.env.HERO_FILM_WORKDIR || '/tmp/hero-film-work'; // holds pw/ (playwright-core) and hero-film/ (raw captures)
const require = createRequire(SP+'/pw/package.json'); const { chromium } = require('playwright-core');
const b = await chromium.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [name,url] of [['with','file:///Users/adammoreno/Projects/terramore-website-growth-system/docs/hero-film/scene-01-reference-board.html'],['without',`file://${SP}/hero-film/boardtest/scene-01-reference-board.html`]]) {
  const p = await b.newPage({viewport:{width:1440,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url); await p.waitForTimeout(2500);
  const info = await p.evaluate(()=>({videos:[...document.querySelectorAll('video')].map(v=>v.readyState).join(','), ph:document.querySelectorAll('.placeholder').length, imgs:[...document.querySelectorAll('img')].filter(i=>i.naturalWidth>0).length}));
  console.log(name, JSON.stringify(info), errs);
  await p.screenshot({path:`${SP}/hero-film/sheets/board-${name}.png`});
}
await b.close();
