#!/bin/bash
# Cut 1–5 s reference clips + stills from each real-time raw recording.
set -e
SP=${HERO_FILM_WORKDIR:-/tmp/hero-film-work}/hero-film
DEST=/Users/adammoreno/Projects/terramore-website-growth-system/docs/hero-film/references/scene-01-diagnose
F=/opt/homebrew/bin/ffmpeg
clip(){ # src letter name start dur frames...
  local s=$1 l=$2 n=$3 st=$4 du=$5; shift 5
  mkdir -p $DEST/$s
  $F -y -loglevel error -ss $st -i $SP/raw/$s/raw.mp4 -t $du -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -an -movflags +faststart $DEST/$s/reference-$l-$n.mp4
  local i=1; for t in "$@"; do $F -y -loglevel error -ss $t -i $SP/raw/$s/raw.mp4 -frames:v 1 $DEST/$s/frame-$l-0$i.png; i=$((i+1)); done
}
clip similarweb a input 1.5 3.5  1.6 2.5 3.6 4.9
clip similarweb b submit 5.0 3.0 5.2 5.8 6.2 7.5
clip website-grader a input 1.5 3.5 1.6 2.05 2.4 3.5 4.8
clip website-grader b submit 5.0 3.0 5.3 5.6 5.9 7.5
clip ahrefs a input 1.5 3.7 1.6 2.5 3.6 5.0
clip ahrefs b submit 5.2 5.0 5.5 6.1 9.5 10.0
clip wappalyzer a input 1.5 3.5 1.6 2.15 2.6 3.6 4.8
clip wappalyzer b submit 5.0 4.0 5.5 5.8 6.0 6.5 8.5
clip semrush a input 1.5 3.5 1.6 2.5 3.4 4.8
clip semrush b loading 5.0 4.0 5.5 6.5 7.05 7.6 8.5
for s in similarweb website-grader ahrefs wappalyzer semrush; do cp $SP/raw/$s/raw.mp4 $DEST/$s/raw-full.mp4; done
