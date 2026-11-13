import SwiftUI

struct TodayView: View {
    private let day = TideDay.sample
    @State private var alerts: Set<String> = []
    /// Shared by each slack row and the detail it opens, so the detail zooms out of its row.
    @Namespace private var slackSurface

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
                                // The row's own card is what grows into the detail and what it
                                // shrinks back into. Timing and curve are the system's, and so is
                                // the reduced version under Reduce Motion: no fallback to a push.
                                .matchedTransitionSource(id: slack.id, in: slackSurface) { source in
                                    source
                                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                                        .clipShape(RoundedRectangle(cornerRadius: 12))
                                }
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
                // Still a navigation destination: the bar, its back button, the edge swipe and
                // the drag-down dismiss all stay, and each one shrinks the detail into its row.
                TideDetailView(day: day, slack: slack, alerts: $alerts)
                    .navigationTransition(.zoom(sourceID: slack.id, in: slackSurface))
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
