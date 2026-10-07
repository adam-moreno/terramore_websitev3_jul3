// Real-time capture of a public domain-lookup interaction via CDP Page.startScreencast.
// Usage: node capture.mjs <source>   (config below). Types only "terramore.io".
import { createRequire } from 'module';
import fs from 'fs';
const SP=process.env.HERO_FILM_WORKDIR || '/tmp/hero-film-work'; // holds pw/ (playwright-core) and hero-film/ (raw captures)
const require = createRequire(SP+'/pw/package.json');
const { chromium } = require('playwright-core');
const DOMAIN='terramore.io';
const CFG = {
  similarweb: { url:'https://www.similarweb.com/website/', input:'input.app-search__input', cta:'button[type=submit].swui-button',
    cookies: async p => { await clickIf(p,'#CybotCookiebotDialogBodyButtonDecline'); }, wait:25000 },
  'website-grader': { url:'https://website.grader.com/', input:'input[type=url]', cta:'button[type=submit].button.primary',
    cookies: async p => { await clickIf(p,'#hs-eu-decline-button'); }, wait:8000 },
  ahrefs: { url:'https://ahrefs.com/website-authority-checker', input:'input[placeholder="Enter domain"]', cta:'button[type=submit][class*=button]',
    cookies: async p => { await clickIf(p,'button.cky-btn-do-not-sell'); await p.waitForTimeout(800);
      const cb=p.locator('#ckyCCPAOptOut'); if(await cb.count() && !(await cb.isChecked().catch(()=>true))) await cb.check({force:true}).catch(()=>{});
      await clickIf(p,'button.cky-btn-confirm'); await clickIf(p,'button.cky-banner-btn-close');
      for(let i=0;i<30;i++){ const open=await p.evaluate(()=>[...document.querySelectorAll('.cky-modal, .cky-consent-container, .cky-preference-center')].some(e=>{const r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).opacity!=='0';})); if(!open) break; await p.waitForTimeout(500);} }, wait:25000 },
  wappalyzer: { url:'https://www.wappalyzer.com/lookup/', input:'main input[type=text], input[type=text]', cta:'button[aria-label="Enter a company website appended action"]',
    cookies: async p => {}, wait:25000 },
  semrush: { url:'https://www.semrush.com/siteaudit/', input:'input[name=website]', cta:'form button[type=submit]',
    cookies: async p => { await clickIf(p,'button.ch2-open-personal-data-btn'); await p.waitForTimeout(1000);
      // in the preferences dialog, prefer a reject/deny/save-with-defaults option
      for (const s of ['button:has-text("Reject")','button:has-text("Deny")','button:has-text("Confirm")','button:has-text("Save")']) { if (await clickIf(p,s)) break; } }, wait:30000 },
};
async function clickIf(p,sel){ try{ const l=p.locator(sel).first(); if(await l.isVisible({timeout:1500})){ await l.click({timeout:3000}); return true;} }catch{} return false; }
const name=process.argv[2]; const c=CFG[name]; if(!c) throw new Error('unknown source');
const out=`${SP}/hero-film/raw/${name}`; fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out+'/frames',{recursive:true});
const browser = await chromium.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:false, args:['--window-size=1280,900'] });
const ctx = await browser.newContext({ viewport:{width:1280,height:800}, deviceScaleFactor:1 });
const page = await ctx.newPage();
const events=[]; const T0={v:0}; const now=()=>Date.now()/1000;
const ev=(e,extra={})=>{ const r={t:+(now()-T0.v).toFixed(3),e,...extra}; events.push(r); console.log(JSON.stringify(r)); };
page.on('framenavigated', f=>{ if(f===page.mainFrame() && T0.v) ev('nav',{url:f.url()}); });
await page.goto(c.url,{waitUntil:'domcontentloaded',timeout:45000}).catch(e=>console.log('goto',e.message));
await page.waitForTimeout(6000);
await c.cookies(page); await page.waitForTimeout(2000);
await page.screencastPrep;
const cdp = await ctx.newCDPSession(page); const frames=[]; let n=0;
cdp.on('Page.screencastFrame', async f=>{ const i=++n; const fn=`frames/${String(i).padStart(5,'0')}.jpg`;
  fs.writeFileSync(`${out}/${fn}`, Buffer.from(f.data,'base64')); frames.push({fn, ts:f.metadata.timestamp});
  cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId}).catch(()=>{}); });
T0.v=now(); ev('record_start',{url:page.url()});
await cdp.send('Page.startScreencast',{format:'jpeg',quality:92,maxWidth:1280,maxHeight:800,everyNthFrame:1});
await page.waitForTimeout(1500);                     // A: initial state
const visBox = async sel => page.evaluate(sel=>{ for(const el of document.querySelectorAll(sel)){ const r=el.getBoundingClientRect(); const cs=getComputedStyle(el); if(r.width>4&&r.height>4&&r.bottom>0&&r.top<800&&cs.visibility!=='hidden'&&cs.display!=='none'){ return {x:r.x,y:r.y,width:r.width,height:r.height,label:(el.innerText||el.placeholder||el.getAttribute('aria-label')||'').trim().slice(0,40)}; } } return null; }, sel);
const box=await visBox(c.input); if(!box){ await page.screenshot({path:`${out}/fail.png`}); throw new Error('no visible input'); }
await page.mouse.move(box.x+box.width/2-150, box.y+box.height/2+120); await page.mouse.move(box.x+40, box.y+box.height/2,{steps:20});
await page.mouse.click(box.x+40, box.y+box.height/2); ev('focus_click');            // B: focus (real mouse click at input)
const focused = await page.evaluate(sel=>{ const a=document.activeElement; return a && a.matches(sel); }, c.input);
if(!focused){ ev('focus_fallback'); await page.evaluate(sel=>{ for(const el of document.querySelectorAll(sel)){ if(el.offsetWidth>4){ el.focus(); return; } } }, c.input); }
await page.waitForTimeout(900);
ev('type_start');                                    // C: typing, 70–120 ms per key
for (const ch of DOMAIN){ await page.keyboard.type(ch); await page.waitForTimeout(70+Math.round(Math.random()*50)); }
ev('type_end'); await page.waitForTimeout(800);
const cb=await visBox(c.cta);
if(cb){ await page.mouse.move(cb.x+cb.width/2, cb.y+cb.height/2,{steps:15}); await page.waitForTimeout(250); }
ev('cta_click',{target:cb&&cb.label}); if(cb) await page.mouse.click(cb.x+cb.width/2, cb.y+cb.height/2); else { ev('cta_missing_press_enter'); await page.keyboard.press('Enter'); }  // D
await page.waitForTimeout(c.wait);                  // E–H: loading, transition, reveal
ev('wait_end',{url:page.url()});
await page.screenshot({path:`${out}/end-state.png`});
await cdp.send('Page.stopScreencast'); await page.waitForTimeout(500);
ev('record_stop',{url:page.url(), title:await page.title()});
fs.writeFileSync(`${out}/frames.json`, JSON.stringify({t0_wall:T0.v, frames},null,1));
fs.writeFileSync(`${out}/events.json`, JSON.stringify(events,null,1));
console.log('frames',frames.length, 'captured', new Date().toISOString());
await browser.close();
