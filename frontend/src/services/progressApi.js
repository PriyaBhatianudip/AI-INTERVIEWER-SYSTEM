import { api } from "./api";

/* ================= PROGRESS APIs ================= */
/* Aligned with Spring ProgressController */

export const fetchProgressSummary = (userId) =>
  api.get("/progress/summary", {
    params: { userId },
  });

export const fetchProgressTimeline = (userId) =>
  api.get("/progress/timeline", {
    params: { userId },
  });
