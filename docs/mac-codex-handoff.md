# Mac Codex Handoff

This note summarizes the current Codex thread so work can continue from another machine, especially a Mac.

## Project

- Repository/workspace: `03_hitoribiz-site_github_init`
- Framework: Next.js 14 App Router / Tailwind CSS
- Main production domain: https://www.hitori-biz.com

## Main New Feature

Added a new independent Wind & Brass Tuner page.

- Page path: `app/wind-brass-tuner/page.tsx`
- Layout/metadata: `app/wind-brass-tuner/layout.tsx`
- URL: https://www.hitori-biz.com/wind-brass-tuner
- Existing string tuner page intentionally preserved:
  - `app/tuner-app/page.tsx`
  - `/tuner-app`

## Wind & Brass Tuner Scope

The new app is for wind and brass players. It supports checking both:

- Written Pitch
- Concert Pitch

Supported transposition choices:

- Concert Pitch
- B-flat Instrument
- E-flat Instrument
- F Instrument

Target notes:

- A4
- B-flat4
- C5
- D5
- E-flat5
- F5
- G5

A4 reference options:

- 440 Hz
- 441 Hz
- 442 Hz
- 443 Hz
- 444 Hz

Default A4 reference:

- 442 Hz

Important examples:

- B-flat Instrument + C5 => Concert Pitch B-flat4
- E-flat Instrument + C5 => Concert Pitch E-flat4
- F Instrument + C5 => Concert Pitch F4
- Concert Pitch + A4 => Concert Pitch A4

## Implementation Notes

The page is a standalone client component. It uses:

- Web Audio API microphone input
- AnalyserNode time-domain data
- Target-frequency-centered autocorrelation
- Median smoothing
- RMS and clarity thresholds
- Reference Tone using OscillatorNode

Reference Tone behavior:

- Plays the selected Concert Pitch
- Stops microphone measurement while playing
- Stops automatically when Start Tuning is pressed

## PWA / Home Screen Assets

Created a gold Wind & Brass Tuner home screen icon set.

Files:

- `public/icons/wind-brass-tuner/icon-1024.png`
- `public/icons/wind-brass-tuner/icon-512.png`
- `public/icons/wind-brass-tuner/icon-192.png`
- `public/icons/wind-brass-tuner/apple-touch-icon.png`
- `public/icons/wind-brass-tuner/favicon-16.png`
- `public/icons/wind-brass-tuner/favicon-32.png`
- `public/wind-brass-tuner.webmanifest`

The layout metadata references:

- `/wind-brass-tuner.webmanifest`
- `/icons/wind-brass-tuner/apple-touch-icon.png`

If the iPhone home screen icon does not update, delete the old home screen shortcut and add it again from Safari.

## Deployments

Production deployment was run with:

```powershell
npx vercel --prod --yes
```

The deployment completed successfully and aliased to:

- https://www.hitori-biz.com

Primary test URL:

- https://www.hitori-biz.com/wind-brass-tuner

## Generated Documents

Created a beginner-friendly user guide and specification.

Source Markdown:

- `docs/wind-brass-tuner-user-guide-spec.md`

Generated DOCX:

- `outputs/Wind_Brass_Tuner_User_Guide_Spec.docx`
- Also copied on Windows to:
  - `C:\Users\shuma\Documents\Wind_Brass_Tuner_User_Guide_Spec.docx`

Note:

- DOCX structural check passed.
- Visual render QA could not be completed because LibreOffice rendering hit a Windows temp-folder permission error.

## Generated Presentation

Created a proposal deck for possible App Store development under Sunphonix.

PowerPoint:

- `outputs/App_Store_Wind_Brass_Tuner_Development_Proposal.pptx`
- Also copied on Windows to:
  - `C:\Users\shuma\Documents\App_Store_Wind_Brass_Tuner_Development_Proposal.pptx`

Preview assets:

- `outputs/App_Store_Wind_Brass_Tuner_Development_Proposal_preview/`
- `outputs/App_Store_Wind_Brass_Tuner_Development_Proposal_contact_sheet.png`

Deck structure:

1. App Store向け開発手順の表紙
2. 可能性と注意点
3. Sunphonix名義で必要な準備
4. Mac / iPhone / Xcodeなどの開発体制
5. Web版検証からTestFlightまでのロードマップ
6. App Store審査で見られるポイント
7. 有料化モデルの比較
8. 推奨する次アクション

## Validation Already Done

- `npx tsc --noEmit --pretty false` passed after the tuner implementation.
- Vercel Production build passed.
- `/wind-brass-tuner` appears in the build output.
- `/tuner-app` was not edited for the wind/brass tuner task.
- Smartphone browser UI was reported as good by the user.

## Known Caveats

- There are many unrelated uncommitted changes in the working tree. Do not revert them.
- PowerShell may show Japanese text as mojibake, but UTF-8 file contents are valid.
- Local render tools for DOCX/PPTX may hit Windows temp-folder permission issues.
- Vercel Preview required login due to protection, so Production URL was used for smartphone testing.

## Suggested Next Steps On Mac

1. Open the same repository on Mac.
2. Pull or copy the latest working tree changes.
3. Run:

```bash
npm install
npx tsc --noEmit --pretty false
npm run build
```

4. Start local development:

```bash
npm run dev
```

5. Check:

- http://localhost:3000/wind-brass-tuner
- http://localhost:3000/tuner-app

6. If continuing App Store planning:

- Decide whether iOS implementation should be native SwiftUI or a Capacitor/WebView approach.
- Prepare Apple Developer Program enrollment details for the publishing entity.
- Continue tester feedback collection for B-flat, E-flat, F, and Concert Pitch instruments.

