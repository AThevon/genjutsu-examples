// Every figure on the page is read from data/tide.json, as NOAA returned it.
import tide from "../data/tide.json";

export type CurrentKind = "slack" | "flood" | "ebb";

export type CurrentEvent = {
  time: string; // "05:57", PDT (lst_ldt)
  kind: CurrentKind;
  knots: string; // unsigned, as NOAA wrote it
};

export const day = {
  iso: tide.date,
  written: tide.date_written,
  weekday: new Date(`${tide.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" }),
  short: new Date(`${tide.date}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }),
};

// The exact NOAA requests the numbers came from, and the day they were fetched.
export const sources = {
  current: tide.source_urls.current_slack_max_english,
  tide: tide.source_urls.tide_6min_english,
  fetched: tide.fetched_at,
};

export const currentStation = tide.stations.current;
export const tideStation = tide.stations.tide;

// "05:57" -> 357, minutes since midnight, for placing points on the chart.
export const minutesOf = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const currentEvents: (CurrentEvent & { signedKnots: number })[] =
  tide.current_slack_and_max.map((e) => ({
    time: e.t.slice(11),
    kind: e.type as CurrentKind,
    knots: e.velocity_knots.replace(/^-/, ""),
    signedKnots: Number(e.velocity_knots),
  }));

const firstSlackIndex = currentEvents.findIndex((e) => e.kind === "slack");

export const firstSlack = currentEvents[firstSlackIndex];

// The strongest current before the first slack, if NOAA predicted one that day.
export const beforeFirstSlack = currentEvents[firstSlackIndex - 1];

// The events that follow the first slack, in order: the current between slacks.
export const afterFirstSlack = currentEvents.slice(firstSlackIndex + 1);

export const slacks = currentEvents.filter((e) => e.kind === "slack");

export type TideTurn = { time: string; kind: "high" | "low"; ft: string };

export const highsLows: TideTurn[] = tide.highs_lows.map((e) => ({
  time: e.t.slice(11),
  kind: e.type === "H" ? "high" : "low",
  ft: e.ft,
}));

// 6-minute tide heights at 9414290, in feet above MLLW.
export const tideCurve = tide.tide_curve.map((p) => ({
  minutes: minutesOf(p.t.slice(11)),
  ft: Number(p.ft),
}));

// For each slack, the high or low at 9414290 that came before it, and the gap in minutes.
export const slackAfterTurn = slacks.map((s) => {
  const turn = [...highsLows].reverse().find((h) => minutesOf(h.time) <= minutesOf(s.time));
  return { slack: s, turn, gap: turn ? minutesOf(s.time) - minutesOf(turn.time) : undefined };
});
