// Recon: load each public page once, screenshot, list visible inputs/buttons. No typing.
import { createRequire } from 'module';
const SP=process.env.HERO_FILM_WORKDIR || '/tmp/hero-film-work'; // holds pw/ (playwright-core) and hero-film/ (raw captures)
const require = createRequire(SP+'/pw/package.json');
const { chromium } = require('playwright-core');
const [name,url] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:false, args:['--window-size=1280,900'] });
const ctx = await browser.newContext({ viewport:{width:1280,height:800}, deviceScaleFactor:1 });
const page = await ctx.newPage();
try { await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000}); } catch(e){ console.log('goto err',e.message); }
await page.waitForTimeout(6000);
console.log('final url', page.url(), 'title', await page.title());
await page.screenshot({path:`${SP}/hero-film/recon/${name}.png`});
const info = await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<1600};
  const d=e=>{const r=e.getBoundingClientRect();return `${e.tagName} id=${e.id} name=${e.name||''} type=${e.type||''} ph="${e.placeholder||''}" aria="${e.getAttribute('aria-label')||''}" cls="${(e.className&&e.className.baseVal===undefined?e.className:'').toString().slice(0,60)}" text="${(e.innerText||e.value||'').trim().slice(0,40)}" @${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`};
  return [...document.querySelectorAll('input,textarea,button,[role=button]')].filter(vis).slice(0,40).map(d);
});
console.log(info.join('\n'));
const frames = page.frames().map(f=>f.url()).filter(u=>/captcha|challenge|turnstile|consent|cookie|onetrust|didomi/i.test(u));
console.log('suspicious frames', frames);
await browser.close();
