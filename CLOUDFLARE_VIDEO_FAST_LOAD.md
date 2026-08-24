# Cloudflare: Make Foundation Course Videos Load Faster

Your videos are served from **R2** at:

- Base URL: `https://pub-ebfd3500fb2e4d449346ae4c5c507e84.r2.dev`
- Example: `https://pub-ebfd3500fb2e4d449346ae4c5c507e84.r2.dev/Foundations_Portrait_Mar1426_Module0.mov`

**Important:** Cache Rules and Edge TTL in Cloudflare are set **per domain (zone)**. The default R2 URL (`*.r2.dev`) is not a zone you manage, so you can’t add Cache Rules to it. To use the steps below, serve videos from a **custom domain** (e.g. `videos.terramore.io`) that points to your R2 bucket and is in your Cloudflare account.

---

## 1. Use a Custom Domain for R2 (if you haven’t already)

1. In **Cloudflare Dashboard** → **R2** → select your bucket.
2. Open **Settings** → **Public access** (or **Custom Domains**).
3. Add a **custom domain** (e.g. `videos.terramore.io`) and follow the CNAME/activation steps.
4. After it’s active, use that domain in the site (e.g. `https://videos.terramore.io/Foundations_Portrait_Mar1426_Module0.mov`).

Then the following rules apply to that domain.

---

## 2. Enable Strong Caching for Video URLs

**Where:** Cloudflare Dashboard → your **domain (e.g. terramore.io)** → **Caching** → **Cache Rules**.

1. Click **Create rule**.
2. **Name:** e.g. `Cache video aggressively`.
3. **When:** “Custom filter expression”:
   - **Field:** `URI Path`
   - **Operator:** `ends with`
   - **Value:** `.mov`
   - If you later use MP4: add another condition with **Operator** `or`, **Field** `URI Path`, **ends with** `.mp4`.
4. **Then:**  
   - **Eligible for cache:** Yes  
   - **Edge TTL:** Override  
   - **Time to live:** 1 year (e.g. `31536000` seconds, or use the 1-year preset if available).  
   - **Options:** Cache Level = **Standard** or **Aggressive** if available in the rule.
5. **Deploy** / Save.

**Optional:** In **Caching** → **Configuration**, set **Caching Level** to **Standard** or **Aggressive** for the zone (or keep default and rely on the rule above for video paths).

---

## 3. Confirm Range Request Support (206 Partial Content)

Videos load faster when the server supports **Range requests** (`Accept-Ranges: bytes` and `206 Partial Content`), so the browser can request chunks and start playback before the full file is downloaded.

**Check origin (R2):**  
From a terminal, run (use your real URL; if you use a custom domain, use that host):

```bash
# Test default R2 URL
curl -I -H "Range: bytes=0-1023" "https://pub-ebfd3500fb2e4d449346ae4c5c507e84.r2.dev/Foundations_Portrait_Mar1426_Module0.mov"
```

**What you want to see:**

- `HTTP/1.1 206 Partial Content`
- Header: `Accept-Ranges: bytes`
- Header: `Content-Range: bytes 0-1023/<total-size>`

If you get `200 OK` and no `Content-Range`, the server is not using range requests for that URL; playback may wait for more data. R2 with public access often supports range requests; this test confirms it.

**If you use a custom domain,** run the same `curl -I -H "Range: bytes=0-1023" "https://videos.terramore.io/Foundations_Portrait_Mar1426_Module0.mov"` and confirm you still get `206` and `Accept-Ranges: bytes`. Cloudflare should pass range requests through to R2.

---

## 4. (Optional) Single Page Rule for Video TTL

If you prefer **Page Rules** (legacy) instead of Cache Rules:

1. **Rules** → **Page Rules** → **Create Page Rule**.
2. **URL:** `*videos.terramore.io/*.mov` (or your video path pattern).
3. **Setting:** **Cache Level** = Cache Everything; **Edge Cache TTL** = 1 year.
4. Save.

Prefer **Cache Rules** (section 2) when possible; they’re the modern way.

---

## 5. Monitor Cache and Performance

- **Caching** → **Cache Analytics** (or **Analytics & Logs** → **Caching**): check cache hit ratio and response times for your video paths.
- **R2** → **Metrics**: check egress and requests for the bucket.

---

## 6. Video Encoding (for fastest start)

Cloudflare can’t re-encode files; this is done before upload:

- **Format:** MP4 with **Fast Start** (moov atom at the beginning) so the browser can start playback after minimal bytes.
- **Codec:** H.264 video + AAC audio for broad support and good compression.
- **Content-Type:** `video/mp4` (R2 usually sets this from extension; for `.mov` it may be `video/quicktime`).

If you can export H.264 MP4 (Fast Start) in addition to or instead of `.mov`, use those URLs in the app and add `.mp4` to your Cache Rule (section 2) for best speed and compatibility.

---

## Quick checklist

| Step | Action |
|------|--------|
| 1 | Add custom domain for R2 bucket (e.g. `videos.terramore.io`) and use it in the site. |
| 2 | Create a **Cache Rule** for URLs ending in `.mov` (and `.mp4`) with Edge TTL = 1 year. |
| 3 | Run `curl -I -H "Range: bytes=0-1023" "<video-url>"` and confirm `206` and `Accept-Ranges: bytes`. |
| 4 | Check **Cache Analytics** for cache hit ratio and response times. |
| 5 | (Optional) Provide MP4 Fast Start versions and link those in the app for faster start and better browser support. |

If you tell me whether you’re already using a custom domain for these videos (and its hostname), I can adapt the Cache Rule expression and curl examples to match exactly.
