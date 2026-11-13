// Every figure on the page is read from data/tide.json (NOAA CO-OPS, 2 October 2026).
// Nothing here is typed by hand except the formatting.
import raw from "../data/tide.json";

export type CurrentEvent = {
  t: string;
  minute: number;
  type: "flood" | "ebb" | "slack";
  knots: number;
  knotsText: string;
};

const toMinute = (t: string) => {
  const [h, m] = t.slice(11, 16).split(":").map(Number);
  return h * 60 + m;
};

/** "2026-10-02 05:57" -> "5:57 am" */
export const clock = (t: string) => {
  const [h, m] = t.slice(11, 16).split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { time: `${h12}:${String(m).padStart(2, "0")}`, suffix };
};
export const clockText = (t: string) => {
  const c = clock(t);
  return `${c.time} ${c.suffix}`;
};

export const DAY_MINUTES = 24 * 60;
export const dateWritten: string = raw.date_written;
export const weekday = new Date(`${raw.date}T12:00:00`).toLocaleDateString("en-US", {
  weekday: "long",
});
export const fetchedAt = new Date(`${raw.fetched_at}T12:00:00`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const stations = raw.stations;
export const datum: string = raw.datum;
export const sourceUrl: string = raw.source.match(/https?:\/\/\S+/)?.[0] ?? "";

export const current: CurrentEvent[] = raw.current_slack_and_max.map((e) => ({
  t: e.t,
  minute: toMinute(e.t),
  type: e.type as CurrentEvent["type"],
  knots: Number(e.velocity_knots),
  knotsText: e.velocity_knots.replace("-", ""),
}));

export const maxima = current.filter((e) => e.type !== "slack");
export const maxAbsKnots = Math.max(...maxima.map((e) => Math.abs(e.knots)));

/** Each slack with the max current before and after it: the window between two runs. */
export const slacks = current
  .filter((e) => e.type === "slack")
  .map((s) => {
    const before = [...maxima].reverse().find((m) => m.minute < s.minute)!;
    const after = maxima.find((m) => m.minute > s.minute)!;
    const turn = [...raw.highs_lows].reverse().find((h) => toMinute(h.t) <= s.minute)!;
    return {
      ...s,
      before,
      after,
      turn: {
        t: turn.t,
        kind: turn.type === "H" ? "High" : "Low",
        ft: turn.ft,
        minute: toMinute(turn.t),
        lag: s.minute - toMinute(turn.t),
      },
    };
  });

export type Slack = (typeof slacks)[number];

export const highsLows = raw.highs_lows.map((h) => ({
  t: h.t,
  minute: toMinute(h.t),
  kind: h.type === "H" ? "High" : "Low",
  ft: h.ft,
  feet: Number(h.ft),
}));

export const tideCurve = raw.tide_curve.map((p) => ({ minute: toMinute(p.t), feet: Number(p.ft) }));
export const tideMin = Math.min(...tideCurve.map((p) => p.feet));
export const tideMax = Math.max(...tideCurve.map((p) => p.feet));

export const lagMin = Math.min(...slacks.map((s) => s.turn.lag));
export const lagMax = Math.max(...slacks.map((s) => s.turn.lag));
