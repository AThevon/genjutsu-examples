import SwiftUI

struct TideDetailView: View {
    let day: TideDay
    let slack: Slack
    @Binding var alerts: Set<String>

    private var hasAlert: Binding<Bool> {
        Binding(
            get: { alerts.contains(slack.id) },
            set: { isOn in
                if isOn {
                    alerts.insert(slack.id)
                } else {
                    alerts.remove(slack.id)
                }
            }
        )
    }

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Slack water")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    Text(slack.time)
                        .font(.system(size: 56, weight: .semibold, design: .rounded))
                        .monospacedDigit()
                    Text("\(slack.turn).")
                        .font(.body)
                }
                .padding(.vertical, 8)
            }

            Section("Tide height, metres above MLLW") {
                TideCurve(points: day.curve, markerMinutes: slack.minutes)
                    .frame(height: 180)
                    .padding(.vertical, 8)
                    .accessibilityLabel("Tide curve for \(day.dateWritten), slack water marked at \(slack.time)")
            }

            Section {
                if let afterTide = slack.afterTide {
                    LabeledContent("Slack comes", value: afterTide)
                }
                if let nextPeak = slack.nextPeak {
                    LabeledContent("Current", value: nextPeak)
                }
            }

            Section {
                Toggle("Alert me 15 minutes before", isOn: hasAlert)
            }
        }
        .navigationTitle("Slack \(slack.time)")
        .navigationBarTitleDisplayMode(.inline)
    }
}

/// The day's tide as a line, with a vertical rule and a dot where the slack falls.
struct TideCurve: View {
    let points: [(minutes: Int, metres: Double)]
    let markerMinutes: Int

    var body: some View {
        GeometryReader { proxy in
            let size = proxy.size
            let low = points.map(\.metres).min() ?? 0
            let high = points.map(\.metres).max() ?? 1
            let x: (Int) -> CGFloat = { minutes in
                size.width * CGFloat(minutes) / 1440
            }
            let y: (Double) -> CGFloat = { metres in
                size.height * (1 - CGFloat((metres - low) / (high - low)))
            }

            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: x(markerMinutes), y: 0))
                    path.addLine(to: CGPoint(x: x(markerMinutes), y: size.height))
                }
                .stroke(.secondary, style: StrokeStyle(lineWidth: 1, dash: [3, 3]))

                Path { path in
                    for (index, point) in points.enumerated() {
                        let position = CGPoint(x: x(point.minutes), y: y(point.metres))
                        if index == 0 {
                            path.move(to: position)
                        } else {
                            path.addLine(to: position)
                        }
                    }
                }
                .stroke(.tint, style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))

                if let nearest = points.min(by: { abs($0.minutes - markerMinutes) < abs($1.minutes - markerMinutes) }) {
                    Circle()
                        .fill(.tint)
                        .frame(width: 10, height: 10)
                        .position(x: x(markerMinutes), y: y(nearest.metres))
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        TideDetailView(day: .sample, slack: TideDay.sample.slacks[1], alerts: .constant([]))
    }
}
