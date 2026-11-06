# ImpulsDigital 3D Reel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a truthful 15-second, 1080 × 1920, 60 fps Instagram Reel that flies continuously over the live ImpulsDigital website and lands on the approved closing message.

**Architecture:** Keep the production isolated in `video/impuls-reel/`. A Playwright capture script reads the deployed website and creates four curated section images plus transparent layer images and a JSON manifest. A Remotion composition uses CSS 3D transforms, section-level focus blur and lifted layers to create one continuous camera move; separate scripts render review stills, the final H.264 MP4 and machine-verifiable output metadata.

**Tech Stack:** Node.js 24, Playwright Core with installed Google Chrome, React, Remotion, Sharp, Node test runner, `ffprobe-static`.

---

## File map

- Create `video/impuls-reel/package.json` — isolated dependencies and commands.
- Create `video/impuls-reel/.gitignore` — exclude generated captures, frames and MP4 files.
- Create `video/impuls-reel/src/config.mjs` — format, timing and review-frame constants.
- Create `video/impuls-reel/src/manifest.mjs` — capture manifest validation.
- Create `video/impuls-reel/src/timeline.mjs` — deterministic camera and layer timing.
- Create `video/impuls-reel/scripts/capture-page.mjs` — capture public website sections and layer PNGs.
- Create `video/impuls-reel/src/index.ts` — register Remotion root.
- Create `video/impuls-reel/src/Root.tsx` — declare composition metadata.
- Create `video/impuls-reel/src/ImpulsReel.tsx` — continuous 3D flight and end card.
- Create `video/impuls-reel/src/styles.css` — studio, page, layers and safe-area styling.
- Create `video/impuls-reel/scripts/render-stills.mjs` — render the seven approved review frames.
- Create `video/impuls-reel/scripts/verify-output.mjs` — validate codec, dimensions, duration and frame rate.
- Create `video/impuls-reel/tests/config.test.mjs` — format and timing contract.
- Create `video/impuls-reel/tests/manifest.test.mjs` — manifest schema contract.
- Create `video/impuls-reel/tests/timeline.test.mjs` — continuous movement and endpoint contract.
- Generate `video/impuls-reel/public/capture/manifest.json` and PNG assets.
- Generate `video/impuls-reel/output/review/*.png` and `video/impuls-reel/output/impuls-reel-vertical.mp4`.

The website files `index.html`, `styles.css`, `script.js` and the five application projects remain unchanged.

### Task 1: Scaffold the isolated video workspace

**Files:**
- Create: `video/impuls-reel/package.json`
- Create: `video/impuls-reel/.gitignore`
- Create: `video/impuls-reel/src/config.mjs`
- Test: `video/impuls-reel/tests/config.test.mjs`

- [ ] **Step 1: Create the workspace and install exact dependency families**

Run from the ImpulsDigital repository:

```powershell
New-Item -ItemType Directory -Force -Path video/impuls-reel/src,video/impuls-reel/scripts,video/impuls-reel/tests,video/impuls-reel/public/capture,video/impuls-reel/output/review
Set-Location video/impuls-reel
npm init -y
npm install react react-dom remotion @remotion/cli @remotion/renderer @remotion/bundler playwright-core sharp ffprobe-static
```

Expected: `package.json` and `package-lock.json` exist; install exits 0.

- [ ] **Step 2: Add scripts and module mode to `package.json`**

Set these fields without changing the versions written by npm:

```json
{
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "capture": "node scripts/capture-page.mjs",
    "preview": "remotion studio src/index.ts",
    "stills": "node scripts/render-stills.mjs",
    "render": "remotion render src/index.ts ImpulsReel output/impuls-reel-vertical.mp4 --codec h264 --crf 16 --browser-executable=\"C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe\"",
    "verify": "node scripts/verify-output.mjs"
  }
}
```

- [ ] **Step 3: Write the failing format contract**

Create `tests/config.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {VIDEO, REVIEW_SECONDS} from '../src/config.mjs';

test('Instagram Reel contract is fixed', () => {
  assert.deepEqual(VIDEO, {width: 1080, height: 1920, fps: 60, seconds: 15, frames: 900});
});

test('review frames match the approved checkpoints', () => {
  assert.deepEqual(REVIEW_SECONDS, [0, 1.6, 2.5, 5, 6.5, 9.3, 11]);
});
```

- [ ] **Step 4: Run the test and verify failure**

Run: `npm test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/config.mjs`.

- [ ] **Step 5: Implement the immutable format configuration**

Create `src/config.mjs`:

```js
export const VIDEO = Object.freeze({width: 1080, height: 1920, fps: 60, seconds: 15, frames: 900});
export const REVIEW_SECONDS = Object.freeze([0, 1.6, 2.5, 5, 6.5, 9.3, 11]);
export const REVIEW_FRAMES = Object.freeze(REVIEW_SECONDS.map((second) => Math.round(second * VIDEO.fps)));
export const SOURCE_URL = 'https://www.impulsdigital.es/?impuls-reel=20261106';
export const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
```

- [ ] **Step 6: Add generated-file exclusions**

Create `.gitignore`:

```gitignore
node_modules/
public/capture/*.png
public/capture/manifest.json
output/
.remotion/
```

- [ ] **Step 7: Run and commit**

Run: `npm test`

Expected: 2 passing tests.

```powershell
git add video/impuls-reel/package.json video/impuls-reel/package-lock.json video/impuls-reel/.gitignore video/impuls-reel/src/config.mjs video/impuls-reel/tests/config.test.mjs
git commit -m "build: scaffold Impuls reel"
```

### Task 2: Define the capture manifest and deterministic timeline

**Files:**
- Create: `video/impuls-reel/src/manifest.mjs`
- Create: `video/impuls-reel/src/timeline.mjs`
- Test: `video/impuls-reel/tests/manifest.test.mjs`
- Test: `video/impuls-reel/tests/timeline.test.mjs`

- [ ] **Step 1: Write failing manifest tests**

Create `tests/manifest.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {validateManifest} from '../src/manifest.mjs';

const valid = {
  sourceUrl: 'https://www.impulsdigital.es/',
  viewport: {width: 1440, height: 900, scale: 2},
  sections: ['hero', 'webs', 'ia', 'apps'].map((id) => ({id, file: `${id}.png`, width: 1440, height: 900})),
  layers: ['brasa', 'turnia', 'stay', 'stock', 'cotiza'].map((id) => ({id, sectionId: 'apps', file: `${id}.png`, x: 0, y: 0, width: 96, height: 96}))
};

test('accepts the four sections and five application layers', () => {
  assert.equal(validateManifest(valid), true);
});

test('rejects a manifest missing an application logo', () => {
  assert.throws(() => validateManifest({...valid, layers: valid.layers.slice(1)}), /five application layers/);
});
```

- [ ] **Step 2: Write failing timeline tests**

Create `tests/timeline.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {cameraAt, layerLiftAt} from '../src/timeline.mjs';

test('flight never reverses before the rise', () => {
  let previous = cameraAt(0).travel;
  for (let frame = 1; frame <= 510; frame += 1) {
    const current = cameraAt(frame).travel;
    assert.ok(current >= previous, `travel reversed at frame ${frame}`);
    previous = current;
  }
});

test('camera is overhead at 9.3 seconds and landed at 10 seconds', () => {
  assert.ok(cameraAt(558).tilt <= 1);
  assert.equal(cameraAt(600).phase, 'end-card');
});

test('each app logo lifts only during the apps passage', () => {
  assert.equal(layerLiftAt('turnia', 250), 0);
  assert.ok(layerLiftAt('turnia', 390) > 0);
  assert.equal(layerLiftAt('turnia', 540), 0);
});
```

- [ ] **Step 3: Run tests and verify failure**

Run: `npm test`

Expected: FAIL for missing `manifest.mjs` and `timeline.mjs`.

- [ ] **Step 4: Implement strict manifest validation**

Create `src/manifest.mjs`:

```js
const SECTION_IDS = ['hero', 'webs', 'ia', 'apps'];
const APP_IDS = ['brasa', 'turnia', 'stay', 'stock', 'cotiza'];

export function validateManifest(manifest) {
  if (!manifest || typeof manifest.sourceUrl !== 'string') throw new Error('sourceUrl is required');
  const sectionIds = manifest.sections?.map(({id}) => id) ?? [];
  if (JSON.stringify(sectionIds) !== JSON.stringify(SECTION_IDS)) throw new Error('four ordered sections are required');
  const appIds = manifest.layers?.filter(({sectionId}) => sectionId === 'apps').map(({id}) => id) ?? [];
  if (JSON.stringify(appIds) !== JSON.stringify(APP_IDS)) throw new Error('five application layers are required');
  for (const item of [...manifest.sections, ...manifest.layers]) {
    if (!item.file || item.width <= 0 || item.height <= 0) throw new Error(`invalid asset: ${item.id}`);
  }
  return true;
}
```

- [ ] **Step 5: Implement a monotonic five-phase timeline**

Create `src/timeline.mjs`:

```js
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const mix = (a, b, amount) => a + (b - a) * amount;
const smooth = (value) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

export function cameraAt(frame) {
  if (frame < 510) {
    const t = frame / 510;
    return {phase: 'flight', travel: smooth(t), tilt: 56, scale: mix(1.12, 0.92, t)};
  }
  if (frame < 558) {
    const t = smooth((frame - 510) / 48);
    return {phase: 'rise', travel: 1, tilt: mix(56, 0, t), scale: mix(0.92, 0.48, t)};
  }
  if (frame < 600) {
    const t = smooth((frame - 558) / 42);
    return {phase: 'dive', travel: 1, tilt: 0, scale: mix(0.48, 1.02, t)};
  }
  return {phase: 'end-card', travel: 1, tilt: 0, scale: mix(1.02, 1.04, smooth((frame - 600) / 300))};
}

const liftWindows = {brasa: [315, 415], turnia: [330, 430], stay: [345, 445], stock: [360, 460], cotiza: [375, 475]};
export function layerLiftAt(id, frame) {
  const [start, end] = liftWindows[id] ?? [0, 0];
  if (frame <= start || frame >= end) return 0;
  const half = (start + end) / 2;
  return frame <= half ? smooth((frame - start) / (half - start)) : smooth((end - frame) / (end - half));
}
```

- [ ] **Step 6: Run and commit**

Run: `npm test`

Expected: 7 passing tests.

```powershell
git add video/impuls-reel/src/manifest.mjs video/impuls-reel/src/timeline.mjs video/impuls-reel/tests/manifest.test.mjs video/impuls-reel/tests/timeline.test.mjs
git commit -m "test: define reel capture and timeline contracts"
```

### Task 3: Capture the deployed website without modifying it

**Files:**
- Create: `video/impuls-reel/scripts/capture-page.mjs`
- Generate: `video/impuls-reel/public/capture/manifest.json`
- Generate: `video/impuls-reel/public/capture/*.png`

- [ ] **Step 1: Implement section and transparent-layer capture**

Create `scripts/capture-page.mjs` with these exact selectors and output rules:

```js
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {chromium} from 'playwright-core';
import {CHROME_PATH, SOURCE_URL} from '../src/config.mjs';
import {validateManifest} from '../src/manifest.mjs';

const output = path.resolve('public/capture');
const sections = [
  {id: 'hero', selector: '.hero'},
  {id: 'webs', selector: '#webs'},
  {id: 'ia', selector: '#ia'},
  {id: 'apps', selector: '#apps'}
];
const layers = [
  ['brasa', '#apps .app-card:nth-of-type(1) .app-logo'],
  ['turnia', '#apps .app-card:nth-of-type(2) .app-logo'],
  ['stay', '#apps .app-card:nth-of-type(3) .app-logo'],
  ['stock', '#apps .app-card:nth-of-type(4) .app-logo'],
  ['cotiza', '#apps .app-card:nth-of-type(5) .app-logo']
];

await mkdir(output, {recursive: true});
const browser = await chromium.launch({headless: true, executablePath: CHROME_PATH, args: ['--force-device-scale-factor=1']});
const page = await browser.newPage({viewport: {width: 1440, height: 900}, deviceScaleFactor: 2});
await page.goto(SOURCE_URL, {waitUntil: 'networkidle'});
await page.evaluate(async () => {
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = 'auto';
});

const manifest = {sourceUrl: SOURCE_URL, viewport: {width: 1440, height: 900, scale: 2}, sections: [], layers: []};
for (const {id, selector} of sections) {
  const locator = page.locator(selector).first();
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  const file = `${id}.png`;
  await locator.screenshot({path: path.join(output, file), animations: 'disabled'});
  await sharp(path.join(output, file)).metadata();
  manifest.sections.push({id, file, width: box.width, height: box.height});
}

const appsBox = await page.locator('#apps').boundingBox();
for (const [id, selector] of layers) {
  const locator = page.locator(selector).first();
  const box = await locator.boundingBox();
  const file = `${id}.png`;
  await locator.screenshot({path: path.join(output, file), omitBackground: true, animations: 'disabled'});
  await sharp(path.join(output, file)).metadata();
  manifest.layers.push({id, sectionId: 'apps', file, x: box.x - appsBox.x, y: box.y - appsBox.y, width: box.width, height: box.height});
}

validateManifest(manifest);
await writeFile(path.join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await browser.close();
console.log(`PASS captured ${manifest.sections.length} sections and ${manifest.layers.length} layers`);
```

- [ ] **Step 2: Capture and validate**

Run: `npm run capture`

Expected: `PASS captured 4 sections and 5 layers`.

- [ ] **Step 3: Visually inspect source assets**

Open `public/capture/hero.png`, `webs.png`, `ia.png`, `apps.png` and the five logo PNGs. Confirm current truthful copy, no cookie/banner overlays and no missing fonts or images.

- [ ] **Step 4: Commit only the capture script**

Generated PNG files remain ignored.

```powershell
git add video/impuls-reel/scripts/capture-page.mjs
git commit -m "feat: capture Impuls reel source layers"
```

### Task 4: Build the continuous 3D composition

**Files:**
- Create: `video/impuls-reel/src/index.ts`
- Create: `video/impuls-reel/src/Root.tsx`
- Create: `video/impuls-reel/src/ImpulsReel.tsx`
- Create: `video/impuls-reel/src/styles.css`

- [ ] **Step 1: Register the Remotion composition**

Create `src/index.ts`:

```ts
import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';
registerRoot(RemotionRoot);
```

Create `src/Root.tsx`:

```tsx
import React from 'react';
import {Composition} from 'remotion';
import {ImpulsReel} from './ImpulsReel';

export const RemotionRoot: React.FC = () => (
  <Composition id="ImpulsReel" component={ImpulsReel} durationInFrames={900} fps={60} width={1080} height={1920} />
);
```

- [ ] **Step 2: Implement the flight, rise, dive and end card**

Create `src/ImpulsReel.tsx`. It must:

```tsx
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import manifest from '../public/capture/manifest.json';
import {cameraAt, layerLiftAt} from './timeline.mjs';
import './styles.css';

const orderedSections = manifest.sections;
const SECTION_GAP = 96;
const sectionTop = (index: number) => orderedSections.slice(0, index).reduce((sum, section) => sum + section.height + SECTION_GAP, 0);
const contentHeight = sectionTop(orderedSections.length);

export const ImpulsReel: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = cameraAt(frame);
  const travelPx = camera.travel * Math.max(0, contentHeight - 1600);
  const landed = camera.phase === 'end-card';
  return (
    <AbsoluteFill className="studio">
      <div className={`film ${landed ? 'film--landed' : ''}`} style={{
        transform: `perspective(1880px) translate3d(-50%, ${landed ? 320 : 1160 - travelPx}px, 0) rotateX(${camera.tilt}deg) scale(${camera.scale})`
      }}>
        {orderedSections.map((section, index) => {
          const screenY = sectionTop(index) - travelPx;
          const blur = Math.min(14, Math.abs(screenY - 720) / 180);
          return <Img key={section.id} className="section-shot" src={staticFile(`capture/${section.file}`)} style={{top: sectionTop(index), height: section.height, filter: `blur(${blur}px)`}} />;
        })}
        {manifest.layers.map((layer) => {
          const lift = layerLiftAt(layer.id, frame);
          return <Img key={layer.id} className="lifted-layer" src={staticFile(`capture/${layer.file}`)} style={{
            left: layer.x,
            top: sectionTop(3) + layer.y,
            width: layer.width,
            height: layer.height,
            transform: `translateZ(${lift * 80}px) rotateX(${-lift * 24}deg) scale(${1 + lift * 0.28})`,
            boxShadow: `0 ${12 + lift * 28}px ${24 + lift * 40}px rgba(10,12,20,${0.22 + lift * 0.18})`
          }} />;
        })}
      </div>
      <div className="end-copy" style={{opacity: interpolate(frame, [602, 640], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div className="brand-pill">Impuls<span>.</span></div>
        <h1>No solo creamos webs.<br />Construimos herramientas.</h1>
        <p>Impulsá lo que viene.</p>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Add the visual system and Reels safe areas**

Create `src/styles.css` with:

```css
*{box-sizing:border-box} body{margin:0;font-family:Arial,sans-serif}.studio{overflow:hidden;background:radial-gradient(circle at 50% 42%,#f9fbfb 0,#f2f3f6 78%);color:#11131a}.studio::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle,transparent 58%,rgba(32,36,54,.08) 100%)}.film{position:absolute;left:50%;width:1440px;height:7200px;transform-origin:50% 0;transform-style:preserve-3d;border-radius:24px;overflow:hidden;background:#090a10;box-shadow:0 48px 120px rgba(26,31,48,.28);will-change:transform}.film--landed{height:1018px;width:960px;border-radius:38px;top:630px;overflow:hidden}.section-shot{position:absolute;left:0;width:1440px;object-fit:fill;border-radius:24px;will-change:filter}.lifted-layer{position:absolute;object-fit:contain;transform-origin:center;transform-style:preserve-3d;will-change:transform}.end-copy{position:absolute;left:70px;right:70px;top:118px;text-align:center;z-index:4}.brand-pill{display:inline-flex;padding:12px 22px;border:1px solid rgba(20,25,36,.14);border-radius:999px;background:rgba(255,255,255,.86);font-size:28px;font-weight:800}.brand-pill span{color:#8b5cf6}.end-copy h1{margin:38px 0 12px;font-size:70px;line-height:1.02;letter-spacing:-3px}.end-copy p{margin:0;color:#777982;font-family:Georgia,serif;font-size:78px;font-style:italic;line-height:1}.end-copy{padding-top:34px}@media (prefers-reduced-motion:reduce){.film,.lifted-layer{will-change:auto}}
```

- [ ] **Step 4: Launch preview and inspect animation continuously**

Run: `npm run preview`

Expected: Remotion Studio opens `ImpulsReel`; no missing assets or console errors. Scrub frames 0, 150, 300, 510, 558, 600 and 899. Confirm there is no reverse travel, hard cut or logo distortion.

- [ ] **Step 5: Commit**

```powershell
git add video/impuls-reel/src/index.ts video/impuls-reel/src/Root.tsx video/impuls-reel/src/ImpulsReel.tsx video/impuls-reel/src/styles.css
git commit -m "feat: animate Impuls 3D reel"
```

### Task 5: Render and approve the seven control frames

**Files:**
- Create: `video/impuls-reel/scripts/render-stills.mjs`
- Generate: `video/impuls-reel/output/review/*.png`

- [ ] **Step 1: Implement deterministic still rendering**

Create `scripts/render-stills.mjs`:

```js
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import {CHROME_PATH, REVIEW_FRAMES} from '../src/config.mjs';

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const compositions = await getCompositions(serveUrl, {browserExecutable: CHROME_PATH});
const composition = compositions.find(({id}) => id === 'ImpulsReel');
if (!composition) throw new Error('ImpulsReel composition not found');
await mkdir('output/review', {recursive: true});
for (const frame of REVIEW_FRAMES) {
  await renderStill({serveUrl, composition, frame, output: `output/review/frame-${String(frame).padStart(3, '0')}.png`, browserExecutable: CHROME_PATH, imageFormat: 'png'});
}
console.log(`PASS rendered ${REVIEW_FRAMES.length} review stills`);
```

- [ ] **Step 2: Render the controls**

Run: `npm run stills`

Expected: `PASS rendered 7 review stills`.

- [ ] **Step 3: Review every still before rendering video**

Confirm:

- Frame 0: hero and studio floor read immediately.
- Frame 96: hero remains legible and motion has begun.
- Frame 150: service transition remains centred.
- Frame 300: application section enters focus.
- Frame 390: five approved application marks are visible or lifting.
- Frame 558: full strip is overhead and centred.
- Frame 660: closing message is fully readable within Reels safe areas.

If any check fails, adjust only `timeline.mjs`, `ImpulsReel.tsx` or `styles.css`, rerun `npm test` and rerender all seven stills.

- [ ] **Step 4: Commit the still renderer and approved timing changes**

```powershell
git add video/impuls-reel/scripts/render-stills.mjs video/impuls-reel/src
git commit -m "test: approve Impuls reel control frames"
```

### Task 6: Render and verify the final MP4

**Files:**
- Create: `video/impuls-reel/scripts/verify-output.mjs`
- Generate: `video/impuls-reel/output/impuls-reel-vertical.mp4`

- [ ] **Step 1: Implement objective output verification**

Create `scripts/verify-output.mjs`:

```js
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import ffprobePath from 'ffprobe-static';

const file = 'output/impuls-reel-vertical.mp4';
const result = spawnSync(ffprobePath.path, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], {encoding: 'utf8'});
if (result.status !== 0) throw new Error(result.stderr || 'ffprobe failed');
const info = JSON.parse(result.stdout);
const video = info.streams.find(({codec_type}) => codec_type === 'video');
assert.equal(video.codec_name, 'h264');
assert.equal(video.width, 1080);
assert.equal(video.height, 1920);
assert.equal(video.avg_frame_rate, '60/1');
const duration = Number(info.format.duration);
assert.ok(duration >= 14.95 && duration <= 15.05, `unexpected duration ${duration}`);
console.log(`PASS h264 ${video.width}x${video.height} 60fps ${duration.toFixed(2)}s`);
```

- [ ] **Step 2: Run all automated checks before rendering**

Run: `npm test`

Expected: 7 passing tests.

- [ ] **Step 3: Render the final video**

Run: `npm run render`

Expected: `output/impuls-reel-vertical.mp4` exists and the Remotion render completes without dropped or failed frames.

- [ ] **Step 4: Verify technical metadata**

Run: `npm run verify`

Expected: `PASS h264 1080x1920 60fps 15.00s`.

- [ ] **Step 5: Watch the complete MP4 twice**

First pass without sound: confirm the story is understandable and closing text is readable for at least 3.5 seconds. Second pass at normal playback: confirm steady motion, no shimmer, no page jump, no transparent-layer halo and no content under Instagram control zones.

- [ ] **Step 6: Commit production scripts, not generated media**

```powershell
git add video/impuls-reel/scripts/verify-output.mjs video/impuls-reel/package.json video/impuls-reel/package-lock.json
git commit -m "chore: verify Impuls reel output"
```

The MP4 remains a local deliverable unless Marcos explicitly asks to add it to version control or publish it.
