// Assemble screencast frames into a real-timed CFR 30fps mp4 using each frame's CDP timestamp.
import fs from 'fs'; import { execFileSync } from 'child_process';
const SP=process.env.HERO_FILM_WORKDIR || '/tmp/hero-film-work'; // holds pw/ (playwright-core) and hero-film/ (raw captures)
const name=process.argv[2]; const dir=`${SP}/hero-film/raw/${name}`;
const {t0_wall,frames}=JSON.parse(fs.readFileSync(`${dir}/frames.json`));
const ev=JSON.parse(fs.readFileSync(`${dir}/events.json`)); const stop=ev.find(e=>e.e==='record_stop').t;
// offset: video time 0 = record_start wall time. first frame placed at its own timestamp.
let lines=['ffconcat version 1.0']; const first=frames[0].ts-t0_wall;
lines.push(`file '${dir}/${frames[0].fn}'`,`duration ${Math.max(first,0.001).toFixed(4)}`); // hold first frame from t=0 (page was static before first change)
for(let i=0;i<frames.length;i++){ const end = i+1<frames.length? frames[i+1].ts : t0_wall+stop; lines.push(`file '${dir}/${frames[i].fn}'`,`duration ${Math.max(end-frames[i].ts,0.001).toFixed(4)}`); }
lines.push(`file '${dir}/${frames[frames.length-1].fn}'`);
fs.writeFileSync(`${dir}/concat.txt`, lines.join('\n'));
execFileSync('/opt/homebrew/bin/ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',`${dir}/concat.txt`,'-vf','fps=30,scale=1280:800:force_original_aspect_ratio=decrease,pad=1280:800:(ow-iw)/2:(oh-ih)/2,format=yuv420p','-c:v','libx264','-crf','18','-preset','medium',`${dir}/raw.mp4`]);
console.log(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',`${dir}/raw.mp4`]).toString().trim(), 'first frame offset', first.toFixed(3));
