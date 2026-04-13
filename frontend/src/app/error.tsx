"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '40px', background: 'white', color: 'red', zIndex: 99999, position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}>
      <h2>Client-Side Crash Detected!</h2>
      <p>Error Message: {error.message}</p>
      <pre style={{ color: 'black', background: '#ccc', padding: '20px' }}>{error.stack}</pre>
    </div>
  );
}
