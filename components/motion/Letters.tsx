/**
 * Splits a headline into letters that flicker in, in a scattered order,
 * when the page loads. With `once`, it only plays on the first page view of
 * a visit (used for the name on the homepage). Pure CSS (see `.letters` in globals.css), so it
 * works in server components. Screen readers get the plain text.
 */
export default function Letters({ text, delay = 0, once = false }: { text: string; delay?: number; once?: boolean }) {
  const chars = Array.from(text);
  return (
    <span className={once ? 'letters once' : 'letters'}>
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
            // client so there is no hydration mismatch. Whole headline done
            // in about one second.
            style={{ '--d': `${(delay + 0.1 + (((i + 1) * 0.618034) % 1) * 0.55).toFixed(3)}s` } as React.CSSProperties}
          >
            {ch}
          </span>
        )
      )}
      </span>
    </span>
  );
}
