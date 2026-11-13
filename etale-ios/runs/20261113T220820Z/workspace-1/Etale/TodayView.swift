import SwiftUI

struct TodayView: View {
    private let day = TideDay.sample
    @State private var alerts: Set<String> = []
    /// Ties each slack row to the detail it zooms into, keyed by `slack.id`.
    @Namespace private var slackZoom

    private var nextSlack: Slack? {
        day.slacks.first { $0.minutes > Clock.minutes(Clock.now) }
    }

    var body: some View {
        NavigationStack {
            List {
                if let nextSlack {
                    Section {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Next slack water")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                            Text(nextSlack.time)
                                .font(.system(size: 56, weight: .semibold, design: .rounded))
                                .monospacedDigit()
                            Text("in \(Clock.duration(nextSlack.minutes - Clock.minutes(Clock.now))). \(nextSlack.turn).")
                                .font(.body)
                        }
                        .padding(.vertical, 8)
                    }
                }

                Section("Slack water today") {
                    ForEach(day.slacks) { slack in
                        NavigationLink(value: slack) {
                            SlackRow(slack: slack, hasAlert: alerts.contains(slack.id))
                                .matchedTransitionSource(id: slack.id, in: slackZoom)
                        }
                    }
                }

                Section("Tide") {
                    ForEach(day.highsLows) { tide in
                        LabeledContent {
                            Text("\(Double(tide.m).map { Clock.decimal($0) } ?? tide.m) m")
                                .monospacedDigit()
                        } label: {
                            Text("\(Clock.time(tide.t))  \(tide.isHigh ? "High water" : "Low water")")
                                .monospacedDigit()
                        }
                    }
                }

                Section {
                    Text("NOAA predictions for \(day.dateWritten). Currents off Alcatraz Island (SFB1204), tide at San Francisco (9414290). The water in the cove itself is not measured.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Aquatic Park")
            .navigationDestination(for: Slack.self) { slack in
                // The row grows into its detail and shrinks back into it: one surface, still a
                // navigation destination, so the bar, the back button and the swipe back stay.
                // The system owns the zoom's curve and duration.
                TideDetailView(day: day, slack: slack, alerts: $alerts)
                    .navigationTransition(.zoom(sourceID: slack.id, in: slackZoom))
            }
        }
    }
}

struct SlackRow: View {
    let slack: Slack
    let hasAlert: Bool

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 12) {
            Text(slack.time)
                .font(.title3.weight(.semibold))
                .monospacedDigit()
            VStack(alignment: .leading, spacing: 2) {
                Text(slack.turn)
                if let nextPeak = slack.nextPeak {
                    Text(nextPeak)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }
            Spacer()
            if hasAlert {
                Image(systemName: "bell.fill")
                    .foregroundStyle(.tint)
                    .accessibilityLabel("Alert set")
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    TodayView()
}
