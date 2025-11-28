import { useState, useEffect, useCallback } from "react";

export type PointType = "entrada" | "pausa" | "retorno" | "saida";

export interface PointRecord {
  id: string;
  timestamp: number; // Data em milissegundos
  type: PointType;
}

const STORAGE_KEY = "kickhub-points-data";

export function usePoints() {
  const [points, setPoints] = useState<PointRecord[]>([]);

  // Carrega os dados ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPoints(JSON.parse(stored));
    }
  }, []);

  // Salva um novo ponto
  const registerPoint = useCallback((type: PointType) => {
    const newPoint: PointRecord = {
      id: crypto.randomUUID(), // Gera ID único
      timestamp: Date.now(),
      type,
    };

    setPoints((prev) => {
      const updated = [...prev, newPoint];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Retorna apenas os pontos de hoje
  const getTodayPoints = useCallback(() => {
    const today = new Date().toDateString();
    return points
      .filter((p) => new Date(p.timestamp).toDateString() === today)
      .sort((a, b) => a.timestamp - b.timestamp); // Garante ordem cronológica
  }, [points]);

  // Calcula horas trabalhadas hoje
  const calculateDailySummary = useCallback(() => {
    const todayPoints = getTodayPoints();
    let workedMs = 0;
    let breakMs = 0;
    let lastTime = 0;
    let state: "idle" | "working" | "paused" = "idle";

    todayPoints.forEach((point) => {
      if (state === "working" && (point.type === "pausa" || point.type === "saida")) {
        workedMs += point.timestamp - lastTime;
      } else if (state === "paused" && point.type === "retorno") {
        breakMs += point.timestamp - lastTime;
      }

      // Atualiza estado
      if (point.type === "entrada" || point.type === "retorno") state = "working";
      else if (point.type === "pausa") state = "paused";
      else if (point.type === "saida") state = "idle";

      lastTime = point.timestamp;
    });

    // Formata milissegundos para HHh MMm
    const formatMs = (ms: number) => {
      const totalMinutes = Math.floor(ms / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
    };

    return {
      worked: formatMs(workedMs),
      breakTime: formatMs(breakMs),
      count: todayPoints.length,
      lastType: todayPoints.length > 0 ? todayPoints[todayPoints.length - 1].type : null
    };
  }, [getTodayPoints]);

  return {
    points,
    registerPoint,
    getTodayPoints,
    calculateDailySummary,
  };
}