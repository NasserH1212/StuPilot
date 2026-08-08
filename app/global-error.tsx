"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly retry: () => void;
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    // A provider-neutral observability adapter will replace this boundary hook later.
    void error;
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>تعذر عرض التطبيق / Application unavailable</title>
        <style>{`
          body { margin: 0; color: #172033; background: #f7f8fc; font-family: system-ui, sans-serif; }
          main { max-width: 42rem; margin-inline: auto; padding: 3rem 1rem; }
          section { padding: 2rem; border: 1px solid #b7c2d4; border-radius: 1rem; background: #fff; }
          button { min-height: 44px; padding: .75rem 1.5rem; border: 0; border-radius: .875rem; color: #fff; background: #174ea6; font: inherit; font-weight: 700; }
          :focus-visible { outline: .2rem solid #b54708; outline-offset: .2rem; }
        `}</style>
      </head>
      <body>
        <main>
          <section aria-labelledby="global-error-heading">
            <h1 id="global-error-heading">
              تعذر عرض التطبيق / Application unavailable
            </h1>
            <p>يمكن المحاولة مرة أخرى بأمان. / It is safe to try again.</p>
            <button type="button" onClick={retry}>
              إعادة المحاولة / Retry
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
