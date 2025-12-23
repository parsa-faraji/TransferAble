"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#dc2626' }}>
              Application Error
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
