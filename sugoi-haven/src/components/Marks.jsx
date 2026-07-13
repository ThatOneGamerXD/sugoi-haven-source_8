/**
 * Original decorative motifs (blueprint §1) — inspired by, never copied from,
 * the artists' visual language. Brush-style accents reserved for small marks.
 */

export function SealMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="33" height="33" rx="4"
        fill="var(--color-ume)" stroke="var(--color-ume-deep)" strokeWidth="1.5" />
      <text x="18" y="25.5" textAnchor="middle" fontSize="19"
        fontFamily="var(--font-display)" fill="var(--color-washi)">波</text>
    </svg>
  );
}

/** Original wave-crest line art — echoes the Great Wave's claw shapes without reproducing them. */
export function WaveCrest({ className = '', stroke = 'currentColor' }) {
  return (
    <svg viewBox="0 0 900 160" className={className} preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 130 C 90 122, 130 70, 210 78 C 178 48, 140 56, 122 38 C 170 24, 224 44, 252 86 C 300 34, 396 26, 452 66 C 436 46, 418 42, 406 30 C 448 24, 486 46, 506 84 C 560 40, 660 36, 716 74 L 900 130" />
        <path d="M60 142 C 200 128, 420 128, 560 138 C 700 148, 820 140, 900 144" strokeWidth="2" opacity="0.55" />
        <path d="M226 84 c 10 -4 18 -12 20 -22 M470 82 c 8 -4 14 -10 16 -18 M690 78 c 9 -4 15 -10 18 -18" strokeWidth="2" opacity="0.7" />
      </g>
    </svg>
  );
}

/** Mount Fuji silhouette for the hero's lower band — classic profile:
 *  long concave flanks, gently notched summit, jagged snowcap fingers. */
export function FujiSilhouette({ className = '' }) {
  return (
    <svg viewBox="0 0 900 200" className={className} preserveAspectRatio="none" aria-hidden="true">
      {/* body: sweeping concave slopes to a slightly irregular summit */}
      <path
        d="M96 200 C 246 193, 336 128, 404 58 L 419 47 C 431 52, 443 54, 452 52 C 461 54, 471 51, 479 47 L 493 56 C 558 124, 656 192, 804 200 Z"
        fill="var(--color-aizuri-deep)" opacity="0.13" />
      {/* snowcap: uneven fingers reaching down the flanks */}
      <path
        d="M404 58 L 419 47 C 431 52, 443 54, 452 52 C 461 54, 471 51, 479 47 L 493 56
           L 487 76 L 476 62 L 468 88 L 457 66 L 448 94 L 438 68 L 429 84 L 419 63 L 411 72 Z"
        fill="var(--color-washi)" opacity="0.55" />
      {/* faint streaks down the flanks, echoing carved ridge lines */}
      <g stroke="var(--color-aizuri-deep)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.07">
        <path d="M400 96 C 386 122, 370 148, 348 172" />
        <path d="M508 100 C 524 128, 544 154, 570 176" />
        <path d="M452 108 C 452 134, 454 160, 458 184" />
      </g>
    </svg>
  );
}

/** Small brush-style section divider (decorative marks only, per brand rules). */
export function WaveDivider({ className = 'text-aizuri' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-current opacity-30" />
      <svg viewBox="0 0 60 20" className="h-4 w-12">
        <path d="M2 14 C 12 12, 14 4, 24 6 C 20 2, 16 3, 14 1 C 22 0, 30 4, 32 10 C 40 3, 52 4, 58 12"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="h-px w-16 bg-current opacity-30" />
    </div>
  );
}
