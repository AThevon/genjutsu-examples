import raw from "../data/tide.json";

// Everything on the page is read from data/tide.json (NOAA CO-OPS predictions, 2 October 2026).
// Nothing here invents a figure: values are NOAA's strings, times are minutes since midnight PDT.

export type CurrentKind = "flood" | "ebb" | "slack";

export interface TidePoint {
  minute: number;
  ft: number;
}

export interface TideTurn {
  minute: number;
  time: string;
  kind: "High" | "Low";
  ft: string;
}

export interface CurrentEvent {
  minute: number;
  time: string;
  kind: CurrentKind;
  knots: string;
  speed: string;
}

export interface Stretch {
  from: CurrentEvent | null;
  to: CurrentEvent | null;
  peak: CurrentEvent;
}

const clock = (stamp: string) => stamp.slice(11, 16);
const minutes = (stamp: string) => {
  const [h, m] = clock(stamp).split(":").map(Number);
  return h * 60 + m;
};

export const date = raw.date_written;
export const stations = raw.stations;
export const datum = "MLLW";
export const zone = "PDT";

export const tideCurve: TidePoint[] = raw.tide_curve.map((p): TidePoint => ({
  minute: minutes(p.t),
  ft: Number(p.ft),
}));

export const tideTurns: TideTurn[] = raw.highs_lows.map((p): TideTurn => ({
  minute: minutes(p.t),
  time: clock(p.t),
  kind: p.type === "H" ? "High" : "Low",
  ft: p.ft,
}));

export const currentEvents: CurrentEvent[] = raw.current_slack_and_max.map((p): CurrentEvent => ({
  minute: minutes(p.t),
  time: clock(p.t),
  kind: p.type as CurrentKind,
  knots: p.velocity_knots,
  // Unsigned speed for prose: the sign only says flood or ebb, which the words already say.
  speed: p.velocity_knots.replace(/^-/, ""),
}));

export const slacks = currentEvents.filter((e) => e.kind === "slack");

// The strongest current between two consecutive slacks (or the edge of the day).
export const stretches: Stretch[] = (() => {
  const bounds = [null, ...slacks, null];
  const out: Stretch[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const from = bounds[i];
    const to = bounds[i + 1];
    const inside = currentEvents.filter(
      (e) =>
        e.kind !== "slack" &&
        (from === null || e.minute > from.minute) &&
        (to === null || e.minute < to.minute),
    );
    if (inside.length === 0) continue;
    const peak = inside.reduce((a, b) =>
      Math.abs(Number(b.knots)) > Math.abs(Number(a.knots)) ? b : a,
    );
    out.push({ from, to, peak });
  }
  return out;
})();

// Each slack paired with the tide turn at 9414290 that precedes it.
export const slackAfterTurn = slacks.flatMap((slack) => {
  const turn = [...tideTurns].reverse().find((t) => t.minute <= slack.minute);
  return turn ? [{ turn, slack, lag: slack.minute - turn.minute }] : [];
});

export const lastTurnWithoutSlack = tideTurns.filter(
  (t) => !slackAfterTurn.some((p) => p.turn === t),
);
