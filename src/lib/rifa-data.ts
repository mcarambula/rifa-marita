import { readFile } from "fs/promises";
import path from "path";

export type RifaJson = {
  /** @deprecated Ignorado: los reservados se deducen de las claves de `buyers`. */
  reserved?: unknown;
  buyers?: unknown;
  names?: unknown;
};

export type RifaState = {
  reserved: Set<number>;
  names: string[];
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/** Normaliza `public/rifa.json` → estado para la UI (100 nombres, índice = número). */
export function parseRifaJson(raw: string): RifaState {
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch {
    return { reserved: new Set(), names: Array.from({ length: 100 }, () => "") };
  }

  if (!isRecord(data)) {
    return { reserved: new Set(), names: Array.from({ length: 100 }, () => "") };
  }

  const names = Array.from({ length: 100 }, () => "");

  if (Array.isArray(data.names)) {
    for (let i = 0; i < 100 && i < data.names.length; i++) {
      const v = data.names[i];
      if (typeof v === "string") names[i] = v;
    }
  }

  const reserved = new Set<number>();
  if (isRecord(data.buyers)) {
    for (const [k, v] of Object.entries(data.buyers)) {
      const n = Number.parseInt(k, 10);
      if (!Number.isNaN(n) && n >= 0 && n < 100 && typeof v === "string") {
        names[n] = v;
        reserved.add(n);
      }
    }
  }

  return { reserved, names };
}

export async function loadRifaState(): Promise<RifaState> {
  const filePath = path.join(process.cwd(), "public", "rifa.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    return parseRifaJson(raw);
  } catch {
    return { reserved: new Set(), names: Array.from({ length: 100 }, () => "") };
  }
}
