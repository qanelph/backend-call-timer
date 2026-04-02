import { useState } from "react";

const COOKIE_TEST_URL = "https://functions.poehali.dev/6fcd0154-0a9a-49d6-adf2-341d13aa54ac";

interface CookieResult {
  cookies: Record<string, string>;
  raw: string;
  total: number;
}

type Status = "idle" | "loading" | "done" | "error";

const CookieTest = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<CookieResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const test = async () => {
    setStatus("loading");
    setResult(null);
    setError(null);

    try {
      const res = await fetch(COOKIE_TEST_URL, {
        method: "GET",
      });
      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  };

  const browserCookies = document.cookie;

  return (
    <div className="bench-root">
      <header className="bench-header">
        <span className="bench-title">COOKIE TEST</span>
        <span className="bench-sub">тест передачи кук</span>
      </header>

      <main className="bench-main" style={{ gap: "1.5rem" }}>
        <div style={{ background: "#111", borderRadius: 8, padding: "1rem", fontSize: 13 }}>
          <div style={{ color: "#888", marginBottom: 6 }}>Куки браузера (document.cookie):</div>
          <div style={{ color: "#eee", wordBreak: "break-all", fontFamily: "monospace" }}>
            {browserCookies || <span style={{ color: "#555" }}>пусто</span>}
          </div>
        </div>

        <button
          className={`bench-btn bench-btn--${status}`}
          onClick={test}
          disabled={status === "loading"}
          style={{ maxWidth: 260 }}
        >
          <span className="bench-btn-label">Отправить куки на бэкенд</span>
          <span className="bench-btn-status">
            {status === "idle" && "—"}
            {status === "loading" && <span className="bench-spinner" />}
            {status === "done" && `${result?.total ?? 0} шт`}
            {status === "error" && "ERR"}
          </span>
        </button>

        {status === "done" && result && (
          <div style={{ background: "#111", borderRadius: 8, padding: "1rem", fontSize: 13 }}>
            <div style={{ color: "#888", marginBottom: 6 }}>
              Ответ бэкенда — получено кук: <strong style={{ color: "#fff" }}>{result.total}</strong>
            </div>
            <div style={{ color: "#888", marginBottom: 4 }}>raw:</div>
            <div style={{ color: "#eee", fontFamily: "monospace", wordBreak: "break-all", marginBottom: 12 }}>
              {result.raw || <span style={{ color: "#555" }}>пусто</span>}
            </div>
            <div style={{ color: "#888", marginBottom: 4 }}>parsed:</div>
            {Object.keys(result.cookies).length === 0 ? (
              <div style={{ color: "#555", fontFamily: "monospace" }}>нет кук</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ color: "#888", textAlign: "left", paddingRight: 16, paddingBottom: 4 }}>ключ</th>
                    <th style={{ color: "#888", textAlign: "left", paddingBottom: 4 }}>значение</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.cookies).map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ color: "#7dd3fc", fontFamily: "monospace", paddingRight: 16, paddingBottom: 2 }}>{k}</td>
                      <td style={{ color: "#eee", fontFamily: "monospace", wordBreak: "break-all", paddingBottom: 2 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {status === "error" && (
          <div style={{ background: "#1a0000", borderRadius: 8, padding: "1rem", fontSize: 13, color: "#f87171" }}>
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default CookieTest;