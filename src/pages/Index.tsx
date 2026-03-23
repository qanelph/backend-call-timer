import { useState } from "react";

const FUNCTIONS = [
  {
    label: "200ms",
    url: "https://functions.poehali.dev/339be580-835f-4028-ab8b-1abcb5bb0816",
  },
  {
    label: "3s",
    url: "https://functions.poehali.dev/dad5f853-5074-4fd0-90ff-3d938ec53dfe",
  },
  {
    label: "10s",
    url: "https://functions.poehali.dev/527f7987-2f8a-4b83-a219-8cfa5239bad1",
  },
];

type Status = "idle" | "loading" | "done" | "error";

interface BtnState {
  status: Status;
  elapsed: number | null;
}

const Index = () => {
  const [states, setStates] = useState<BtnState[]>(
    FUNCTIONS.map(() => ({ status: "idle", elapsed: null }))
  );

  const call = async (index: number) => {
    setStates((prev) =>
      prev.map((s, i) => (i === index ? { status: "loading", elapsed: null } : s))
    );

    const start = performance.now();
    try {
      await fetch(FUNCTIONS[index].url);
      const elapsed = Math.round(performance.now() - start);
      setStates((prev) =>
        prev.map((s, i) => (i === index ? { status: "done", elapsed } : s))
      );
      fetch("https://functions.poehali.dev/3a005c8b-bee3-4bce-9c86-270a57fc37c1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ button_label: FUNCTIONS[index].label, elapsed_ms: elapsed }),
      });
    } catch {
      const elapsed = Math.round(performance.now() - start);
      setStates((prev) =>
        prev.map((s, i) => (i === index ? { status: "error", elapsed } : s))
      );
      fetch("https://functions.poehali.dev/3a005c8b-bee3-4bce-9c86-270a57fc37c1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ button_label: FUNCTIONS[index].label, elapsed_ms: elapsed }),
      });
    }
  };

  return (
    <div className="bench-root">
      <header className="bench-header">
        <span className="bench-title">БЕНЧМАРК</span>
        <span className="bench-sub">тест задержки</span>
      </header>

      <main className="bench-main">
        {FUNCTIONS.map((fn, i) => {
          const s = states[i];
          return (
            <div key={fn.label} className="bench-row">
              <button
                className={`bench-btn bench-btn--${s.status}`}
                onClick={() => call(i)}
                disabled={s.status === "loading"}
              >
                <span className="bench-btn-label">{fn.label}</span>
                <span className="bench-btn-status">
                  {s.status === "idle" && "—"}
                  {s.status === "loading" && <span className="bench-spinner" />}
                  {s.status === "done" && `${s.elapsed}ms`}
                  {s.status === "error" && "ERR"}
                </span>
              </button>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Index;