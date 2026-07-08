# Wind and Brass Tuner Instrument Test Plan

Last updated: 2026-07-08

## Purpose

Use this checklist to verify the iOS app on a real iPhone with actual wind and brass instruments before TestFlight and App Store submission.

## Test Environment

- App: Wind and Brass Tuner iOS prototype
- Device:
- iOS version:
- App commit:
- Test date:
- Tester:
- Room condition:
- A4 reference:
  - [ ] 440 Hz
  - [ ] 441 Hz
  - [ ] 442 Hz
  - [ ] 443 Hz
  - [ ] 444 Hz

## Core Transposition Checks

| Instrument Mode | Written Target | Expected Concert Pitch | Result | Notes |
| --- | --- | --- | --- | --- |
| Concert Pitch | A4 | A4 | [ ] Pass / [ ] Fail | |
| B-flat Instrument | C5 | B-flat4 | [ ] Pass / [ ] Fail | |
| E-flat Instrument | C5 | E-flat4 | [ ] Pass / [ ] Fail | |
| F Instrument | C5 | F4 | [ ] Pass / [ ] Fail | |

## Instrument Field Checks

| Instrument | Player | App Mode | Written Note | Expected Concert Pitch | Stable Tone Appears | Hz/cents Easy To Read | Pass/Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Flute | | Concert Pitch | A4 | A4 | [ ] Yes / [ ] No | [ ] Yes / [ ] No | [ ] Pass / [ ] Fail | |
| Oboe | | Concert Pitch | A4 | A4 | [ ] Yes / [ ] No | [ ] Yes / [ ] No | [ ] Pass / [ ] Fail | |
| Trumpet | | B-flat Instrument | C5 | B-flat4 | [ ] Yes / [ ] No | [ ] Yes / [ ] No | [ ] Pass / [ ] Fail | |
| Clarinet | | B-flat Instrument | C5 | B-flat4 | [ ] Yes / [ ] No | [ ] Yes / [ ] No | [ ] Pass / [ ] Fail | |
| Alto saxophone | | E-flat Instrument | C5 | E-flat4 | [ ] Yes / [ ] No | [ ] Yes / [ ] No | [ ] Pass / [ ] Fail | |
| Tenor saxophone | | B-flat Instrument | C5 | B-flat4 | [ ] Yes / [ ] No | [ ] Yes / [ ] No | [ ] Pass / [ ] Fail | |
| Horn | | F Instrument | C5 | F4 | [ ] Yes / [ ] No | [ ] Yes / [ ] No | [ ] Pass / [ ] Fail | |
| Trombone | | Concert Pitch | B-flat4 | B-flat4 | [ ] Yes / [ ] No | [ ] Yes / [ ] No | [ ] Pass / [ ] Fail | |

## Usability Questions

- Did microphone permission appear at the right time?
- Did the Start and Stop button behavior feel clear?
- Did the app keep running after Start?
- Was `Listening...` understandable before a pitch was detected?
- Was `Stable tone` helpful?
- Were the cents meter ticks easy to read?
- Was the sharp/flat guidance understandable?
- Was the target note selector understandable for the tester's instrument?
- Did the A4 reference setting match the tester's normal tuning context?

## Acceptance Criteria For TestFlight

- No crash when tapping Start or Stop repeatedly.
- Microphone permission flow is understandable.
- Detected Hz and cents respond to a steady tone.
- The expected concert pitch is correct for Concert, B-flat, E-flat, and F modes.
- Stable tone appears only when the tone is reasonably steady.
- The cents meter remains readable on the target iPhone screen.
- At least one real player confirms each transposition mode before external TestFlight.

## Issues To Record

| Date | Device | Instrument | Problem | Severity | Follow-up |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
