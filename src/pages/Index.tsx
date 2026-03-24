import { useState } from "react";

const FUNCTIONS = [
  {
    label: "200ms",
    url: "https://functions.poehali.dev/339be580-835f-4028-ab8b-1abcb5bb0816",
  },
  {
    label: "30s",
    url: "https://functions.poehali.dev/01f12b8e-7bbd-49bd-bd44-a5aae2b6890a",
  },
  {
    label: "50s",
    url: "https://functions.poehali.dev/44de859c-502d-4e18-a2dc-4e6427a44937",
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