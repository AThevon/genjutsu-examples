import SwiftUI

struct TodayView: View {
    private let day = TideDay.sample
    @State private var alerts: Set<String> = []

    /// The slack on the surface. It stays set until the surface has shrunk back into its row.
    @State private var shown: Slack?
    @State private var isOpen = false
    /// 0: the surface is its row. 1: the surface is the screen.
    @State private var progress: CGFloat = 0
    /// Where the surface grows from, captured when a row opens.
    @State private var source = SlackRowGeometry()
    /// Row frames, written on every scroll frame. A plain reference, so writing them redraws nothing.
    @State private var frames = RowFrames()
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var nextSlack: Slack? {
        day.slacks.first { $0.minutes > Clock.minutes(Clock.now) }
    }

    var body: some View {
        ZStack {
            NavigationStack {
                list
                    .navigationTitle("Aquatic Park")
            }
            .accessibilityHidden(isOpen)

            // Always in the hierarchy, so `progress` animates from where it is instead of
            // arriving already at 1 with a freshly inserted view.
            SlackSurface(
                progress: progress,
                day: day,
                slack: shown,
                source: source,
                alerts: $alerts,
                reduceMotion: reduceMotion,
                onDrag: follow,
                onRelease: release,
                onClose: close
            )
            .allowsHitTesting(isOpen)
            .accessibilityHidden(!isOpen)
        }
    }

    private var list: some View {
        List {
            if let nextSlack {
                Section {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Next slack water")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        Text(nextSlack.time)
                            .font(SlackType.detailTime)
                            .monospacedDigit()
                        Text("in \(Clock.duration(nextSlack.minutes - Clock.minutes(Clock.now))). \(nextSlack.turn).")
                            .font(.body)
                    }
                    .padding(.vertical, 8)
                }
            }

            Section("Slack water today") {
                ForEach(day.slacks) { slack in
                    Button {
                        open(slack)
                    } label: {
                        SlackRow(
                            slack: slack,
                            hasAlert: alerts.contains(slack.id),
                            // Under Reduce Motion nothing travels, so the row keeps its time.
                            timeHidden: shown?.id == slack.id && !reduceMotion,
                            onTimeFrame: { frames.rows[slack.id, default: SlackRowGeometry()].time = $0 }
                        )
                    }
                    .listRowInsets(EdgeInsets())
                    .onGeometryChange(for: CGRect.self) { proxy in
                        proxy.frame(in: .global)
                    } action: { frame in
                        frames.rows[slack.id, default: SlackRowGeometry()].row = frame
                    }
                    .accessibilityHint("Opens the tide detail")
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
    }

    // MARK: - The surface

    private var animation: Animation {
        reduceMotion ? SlackMotion.reduced : SlackMotion.spring
    }

    private func open(_ slack: Slack) {
        source = frames.rows[slack.id] ?? SlackRowGeometry()
        shown = slack
        isOpen = true
        withAnimation(animation) { progress = 1 }
    }

    private func close() {
        guard isOpen else { return }
        isOpen = false
        withAnimation(animation, completionCriteria: .removed) {
            progress = 0
        } completion: {
            // A row tapped while this one was closing has taken the surface over.
            if !isOpen { shown = nil }
        }
    }

    /// The finger drives the surface directly: no animation while it is down.
    private func follow(_ value: CGFloat) {
        guard isOpen else { return }
        var transaction = Transaction()
        transaction.disablesAnimations = true
        withTransaction(transaction) { progress = value }
    }

    private func release(_ shouldClose: Bool) {
        guard isOpen else { return }
        if shouldClose {
            close()
        } else {
            withAnimation(animation) { progress = 1 }
        }
    }
}

/// Not observable on purpose: the frames are read when a row opens, never drawn from.
private final class RowFrames {
    var rows: [String: SlackRowGeometry] = [:]
}

struct SlackRow: View {
    let slack: Slack
    let hasAlert: Bool
    /// The time is hidden while the surface carries it.
    var timeHidden = false
    var onTimeFrame: (CGRect) -> Void = { _ in }

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 12) {
            Text(slack.time)
                .font(SlackType.rowTime)
                .monospacedDigit()
                .fixedSize()
                .onGeometryChange(for: CGRect.self) { proxy in
                    proxy.frame(in: .global)
                } action: { frame in
                    onTimeFrame(frame)
                }
                .opacity(timeHidden ? 0 : 1)
                // The hand-over to the surface is a swap, never a fade.
                .animation(nil, value: timeHidden)
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
        .foregroundStyle(.primary)
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .contentShape(Rectangle())
    }
}

#Preview {
    TodayView()
}
