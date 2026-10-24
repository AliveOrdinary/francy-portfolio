/**
 * Splits a headline into letters that fade in one by one, in a scattered
 * order, when the page loads. Pure CSS (see `.letters` in globals.css), so it
 * works in server components. Screen readers get the plain text.
 */
export default function Letters({ text, delay = 0 }: { text: string; delay?: number }) {
  const chars = Array.from(text);
  return (
    <span className="letters">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
      {chars.map((ch, i) =>
        ch === ' ' ? (
          ' '
        ) : (
          <span
            key={i}
            className="ch"
            // Scattered order (golden-ratio spacing), the same on server and
            // client so there is no hydration mismatch
            style={{ '--d': `${(delay + 0.25 + (((i + 1) * 0.618034) % 1) * 1.4).toFixed(3)}s` } as React.CSSProperties}
          >
            {ch}
          </span>
        )
      )}
      </span>
    </span>
  );
}
