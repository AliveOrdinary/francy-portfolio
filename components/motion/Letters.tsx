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
            // Same scattered order on server and client: no hydration mismatch
            style={{ '--d': `${(delay + (((i * 37 + 11) % 17) / 17) * 0.8).toFixed(3)}s` } as React.CSSProperties}
          >
            {ch}
          </span>
        )
      )}
      </span>
    </span>
  );
}
