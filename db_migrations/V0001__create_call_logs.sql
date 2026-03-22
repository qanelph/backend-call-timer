CREATE TABLE t_p81895163_backend_call_timer.call_logs (
    id SERIAL PRIMARY KEY,
    button_label VARCHAR(20) NOT NULL,
    elapsed_ms INTEGER NOT NULL,
    called_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);