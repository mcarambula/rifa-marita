"use client";

import { useEffect, useState, type CSSProperties } from "react";

function rifaNumberStyle(isReserved: boolean): CSSProperties {
  return isReserved
    ? {
        backgroundColor: "var(--c-mendung)",
        color: "#fff",
        boxShadow: "0 4px 12px -4px rgba(200, 95, 30, 0.4)",
        border: "1px solid var(--c-mendung-deep)",
      }
    : {
        backgroundColor: "var(--c-mendung-parah-light)",
        color: "var(--c-kadestin)",
        border: "1px solid var(--c-kadestin-muted)",
      };
}

function rifaListRowChrome(isReserved: boolean): CSSProperties {
  return isReserved
    ? {
        borderColor: "var(--c-mendung-deep)",
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        boxShadow:
          "0 4px 16px -10px rgba(30, 47, 61, 0.12), 0 0 0 1px rgba(200, 95, 30, 0.12)",
      }
    : {
        borderColor: "var(--c-kadestin-muted)",
        backgroundColor: "var(--c-mendung-parah-light)",
        boxShadow: "0 4px 16px -10px rgba(30, 47, 61, 0.12)",
      };
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function getAprilFiveDeadline(): Date {
  const now = new Date();
  const y = now.getFullYear();
  const end = new Date(y, 3, 5, 23, 59, 59, 999);
  if (now > end) {
    return new Date(y + 1, 3, 5, 23, 59, 59, 999);
  }
  return end;
}

function formatRemaining(ms: number) {
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true as const };
  }
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    done: false as const,
  };
}

const PALETTE_STRIP_COLORS = [
  "var(--c-kadestin)",
  "var(--c-maroona)",
  "var(--c-mendung)",
  "var(--c-mendung-parah)",
  "var(--c-old-leaf)",
] as const;

function PaletteStrip({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-1.5 max-w-xs overflow-hidden rounded-full ${className ?? ""}`}
      aria-hidden
    >
      {PALETTE_STRIP_COLORS.map((c, i) => (
        <span
          key={i}
          className="min-w-0 flex-1"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mx-auto flex w-full max-w-48 items-center gap-3 py-1"
      aria-hidden
    >
      <span className="h-px flex-1 bg-(--c-mendung-parah)" />
      <span
        className="inline-block h-1.5 w-1.5 rotate-45 rounded-sm"
        style={{ backgroundColor: "var(--c-maroona)" }}
      />
      <span className="h-px flex-1 bg-(--c-mendung-parah)" />
    </div>
  );
}

type Props = {
  reservedList: number[];
  names: string[];
};

type GridFilter = "all" | "available" | "reserved";

export default function RifaClient({ reservedList, names }: Props) {
  const reserved = new Set(reservedList);
  const [now, setNow] = useState<number | null>(null);
  const [gridFilter, setGridFilter] = useState<GridFilter>("all");

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const deadline = getAprilFiveDeadline();
  const remaining =
    now === null ? null : formatRemaining(deadline.getTime() - now);

  const gridIndices = Array.from({ length: 100 }, (_, i) => i).filter((i) => {
    if (gridFilter === "all") return true;
    const isReserved = reserved.has(i);
    return gridFilter === "reserved" ? isReserved : !isReserved;
  });

  function toggleGridFilter(next: Exclude<GridFilter, "all">) {
    setGridFilter((f) => (f === next ? "all" : next));
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="mb-12 text-center sm:mb-14">
          <span
            className="mb-4 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm"
            style={{
              borderColor: "rgba(58, 141, 146, 0.35)",
              backgroundColor: "rgba(255,255,255,0.75)",
              color: "var(--c-kadestin)",
            }}
          >
            Rifa solidaria JESSE & JOY
          </span>
          <h1 className="font-display mt-2 text-[2.35rem] font-semibold leading-tight tracking-tight text-(--c-old-leaf) sm:text-5xl sm:leading-tight">
            Tia Marita
          </h1>
          <Divider />
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-(--c-old-leaf-muted)">
            Gracias por sumarte. Cada número es un abrazo de apoyo.
          </p>
        </header>

        <section
          className="relative mb-12 overflow-hidden rounded-3xl border border-white/90 p-1 shadow-[0_20px_50px_-18px_rgba(30,47,61,0.18)] backdrop-blur-md sm:p-1.5 max-w-lg mx-auto"
          style={{
            backgroundColor: "rgba(255,255,255,0.72)",
            boxShadow:
              "0 20px 50px -18px rgba(30,47,61,0.18), inset 0 0 0 1px rgba(255,255,255,0.85)",
          }}
        >
          <div
            className="rounded-[1.35rem] px-5 py-7 sm:px-8 sm:py-8"
            style={{ backgroundColor: "var(--c-mendung-parah-light)" }}
          >
            <div className="mb-6 flex flex-col items-center gap-1 text-center">
              <h2 className="font-display text-xl font-semibold text-(--c-old-leaf) sm:text-2xl">
                Cuenta regresiva
              </h2>
              <p className="text-md text-(--c-old-leaf-muted)">
                Sorteo el{" "}
                <span
                  className="font-medium"
                  style={{ color: "var(--c-kadestin)" }}
                  suppressHydrationWarning
                >
                  {deadline.toLocaleDateString("es", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  .
                </span>
                <br />
                <span>
                  2 boletos para el concierto de Jesse & Joy - 11 de Abril.{" "}
                </span>
                <br />
                <span>Teatro Anayansi.</span>
              </p>
            </div>

            {remaining === null ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {["Días", "Horas", "Minutos", "Segundos"].map((label) => (
                  <div
                    key={label}
                    className="group relative overflow-hidden border px-2 py-4 text-center shadow-[0_4px_20px_-8px_rgba(30,47,61,0.12)] sm:px-3 sm:py-5"
                    style={{
                      borderColor: "rgba(58, 141, 146, 0.4)",
                      backgroundColor: "rgba(255,255,255,0.88)",
                    }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-1.5 opacity-100"
                      style={{ backgroundColor: "var(--c-kadestin)" }}
                    />
                    <div
                      className="font-mono text-2xl font-bold tabular-nums tracking-tight sm:text-[1.75rem]"
                      style={{ color: "var(--c-old-leaf)" }}
                    >
                      —
                    </div>
                    <div
                      className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: "var(--c-kadestin)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            ) : remaining.done ? (
              <p
                className="text-center font-display text-2xl font-semibold sm:text-3xl"
                style={{ color: "var(--c-mendung-deep)" }}
              >
                ¡Llegó el día del sorteo!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  { label: "Días", value: remaining.days },
                  { label: "Horas", value: remaining.hours },
                  { label: "Minutos", value: remaining.minutes },
                  { label: "Segundos", value: remaining.seconds },
                ].map((u) => (
                  <div
                    key={u.label}
                    className="group relative overflow-hidden border px-2 py-4 text-center shadow-[0_4px_20px_-8px_rgba(30,47,61,0.12)] sm:px-3 sm:py-5"
                    style={{
                      borderColor: "rgba(58, 141, 146, 0.4)",
                      backgroundColor: "rgba(255,255,255,0.88)",
                    }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-1.5  opacity-100"
                      style={{ backgroundColor: "var(--c-kadestin)" }}
                    />
                    <div
                      className="font-mono text-2xl font-bold tabular-nums tracking-tight sm:text-[1.75rem]"
                      style={{ color: "var(--c-old-leaf)" }}
                    >
                      {u.value}
                    </div>
                    <div
                      className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: "var(--c-kadestin)" }}
                    >
                      {u.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mb-6 text-center">
          <h2 className="font-display text-lg font-semibold text-(--c-old-leaf) sm:text-xl">
            Números
          </h2>
        </section>

        <section
          aria-label={
            gridFilter === "all"
              ? "Números del 00 al 99"
              : gridFilter === "available"
                ? "Números disponibles"
                : "Números reservados"
          }
          className="mx-auto mb-14 rounded-3xl border p-4 shadow-[0_16px_40px_-22px_rgba(30,47,61,0.2)] backdrop-blur-sm sm:max-w-lg sm:p-5"
          style={{
            borderColor: "rgba(58, 141, 146, 0.25)",
            backgroundColor: "rgba(255,255,255,0.55)",
          }}
        >
          <div
            className="mb-4 flex flex-wrap items-center justify-center gap-3 text-lg sm:text-sm"
            role="group"
            aria-label="Filtrar por estado"
          >
            <button
              type="button"
              aria-pressed={gridFilter === "available"}
              onClick={() => toggleGridFilter("available")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 shadow-sm transition-[box-shadow,transform] outline-none hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-(--c-kadestin) focus-visible:ring-offset-2 active:scale-[0.98]"
              style={{
                backgroundColor:
                  gridFilter === "available"
                    ? "var(--c-mendung-parah-light)"
                    : "rgba(255,255,255,0.8)",
                color: "var(--c-old-leaf-muted)",
                boxShadow:
                  gridFilter === "available"
                    ? "0 0 0 2px var(--c-kadestin-muted)"
                    : undefined,
              }}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-md"
                style={{
                  backgroundColor: "var(--c-mendung-parah-light)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                  border: "1px solid var(--c-kadestin-muted)",
                }}
              />
              Disponible
            </button>
            <button
              type="button"
              aria-pressed={gridFilter === "reserved"}
              onClick={() => toggleGridFilter("reserved")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 shadow-sm transition-[box-shadow,transform] outline-none hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-(--c-mendung) focus-visible:ring-offset-2 active:scale-[0.98]"
              style={{
                backgroundColor:
                  gridFilter === "reserved"
                    ? "rgba(233, 114, 46, 0.12)"
                    : "rgba(255,255,255,0.8)",
                color: "var(--c-old-leaf-muted)",
                boxShadow:
                  gridFilter === "reserved"
                    ? "0 0 0 2px var(--c-mendung-deep)"
                    : undefined,
              }}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-md shadow-sm"
                style={{
                  backgroundColor: "var(--c-mendung)",
                }}
              />
              Reservado
            </button>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-10 gap-1.5 sm:gap-2">
            {gridIndices.map((i) => {
              const isReserved = reserved.has(i);
              return (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-md text-[0.65rem] font-mono font-bold tabular-nums transition-transform duration-300 sm:text-sm"
                  style={rifaNumberStyle(isReserved)}
                  aria-label={`Número ${pad2(i)}${isReserved ? ", reservado" : ", disponible"}`}
                >
                  {pad2(i)}
                </div>
              );
            })}
          </div>
        </section>

        <section
          className="relative overflow-hidden rounded-3xl border border-white/90 p-1 shadow-[0_20px_50px_-20px_rgba(30,47,61,0.15)] backdrop-blur-md sm:p-1.5"
          style={{ backgroundColor: "rgba(255,255,255,0.65)" }}
        >
          <div
            className="rounded-[1.35rem] px-5 py-7 sm:px-8 sm:py-8"
            style={{ backgroundColor: "var(--c-mendung-parah-faint)" }}
          >
            <ul className="grid grid-cols-1 gap-2.5 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-2.5">
              {names.map((name, i) => {
                const isReserved = reserved.has(i);
                return (
                  <li
                    key={i}
                    className="flex min-w-0 items-baseline gap-3 rounded-2xl border px-3.5 py-3 transition-shadow duration-300"
                    style={rifaListRowChrome(isReserved)}
                  >
                    <span
                      className="flex h-8 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-lg font-bold tabular-nums shadow-sm"
                      style={rifaNumberStyle(isReserved)}
                    >
                      {pad2(i)}
                    </span>
                    <span
                      className={`min-w-0 flex-1 text-md leading-snug ${name.trim() ? "font-bold text-(--c-old-leaf)" : "italic text-(--c-old-leaf-muted)/70"}`}
                    >
                      {name.trim() || "Sin asignar"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <footer className="mt-14 text-center">
          <Divider />
          <p className="mt-4 text-lg text-(--c-old-leaf-muted)">
            Gracias por el apoyo.
          </p>
        </footer>
      </div>
    </div>
  );
}
