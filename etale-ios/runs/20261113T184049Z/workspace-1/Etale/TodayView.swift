import SwiftUI
import UIKit

struct TodayView: View {
    private let day = TideDay.sample
    @State private var alerts: Set<String> = []

    /// The slack whose surface is open (or still collapsing back into its row).
    @State private var selected: Slack?
    /// Where that row was when it was tapped.
    @State private var origin = RowFrames()
    /// Drives the one spring: false on the row, true full screen.
    @State private var isExpanded = false
    /// The header drag that collapses the surface.
    @State private var drag: CGFloat = 0
    @State private var rowFrames = RowFrameStore()

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @AccessibilityFocusState private var focusedRow: String?

    private var nextSlack: Slack? {
        day.slacks.first { $0.minutes > Clock.minutes(Clock.now) }
    }

    var body: some View {
        ZStack {
            NavigationStack {
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        if let nextSlack {
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
                            .padding(.horizontal, 16)
                            .padding(.vertical, 14)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color(uiColor: .secondarySystemGroupedBackground), in: .rect(cornerRadius: SurfaceMotion.cardRadius, style: .continuous))
                            .accessibilityElement(children: .combine)
                        }

                        SectionTitle("Slack water today")
                        VStack(spacing: 8) {
                            ForEach(day.slacks) { slack in
                                SlackRow(
                                    slack: slack,
                                    hasAlert: alerts.contains(slack.id),
                                    isOpen: selected?.id == slack.id,
                                    frames: rowFrames
                                ) {
                                    open(slack)
                                }
                                .accessibilityFocused($focusedRow, equals: slack.id)
                            }
                        }

                        SectionTitle("Tide")
                        VStack(spacing: 0) {
                            ForEach(day.highsLows) { tide in
                                LabeledContent {
                                    Text("\(Double(tide.m).map { Clock.decimal($0) } ?? tide.m) m")
                                        .monospacedDigit()
                                } label: {
                                    Text("\(Clock.time(tide.t))  \(tide.isHigh ? "High water" : "Low water")")
                                        .monospacedDigit()
                                }
                                .padding(.horizontal, 16)
                                .padding(.vertical, 11)
                                if tide.id != day.highsLows.last?.id {
                                    Divider().padding(.leading, 16)
                                }
                            }
                        }
                        .background(Color(uiColor: .secondarySystemGroupedBackground), in: .rect(cornerRadius: SurfaceMotion.cardRadius, style: .continuous))

                        Text("NOAA predictions for \(day.dateWritten). Currents off Alcatraz Island (SFB1204), tide at San Francisco (9414290). The water in the cove itself is not measured.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                            .padding(.horizontal, 4)
                            .padding(.top, 14)
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
                }
                .background(Color(uiColor: .systemGroupedBackground))
                .navigationTitle("Aquatic Park")
            }
            .allowsHitTesting(selected == nil)
            .accessibilityHidden(selected != nil)

            if let selected {
                TideDetailView(
                    day: day,
                    slack: selected,
                    origin: origin,
                    isExpanded: isExpanded,
                    drag: $drag,
                    alerts: $alerts,
                    onAppear: expand,
                    onClose: close
                )
                .transition(reduceMotion ? .opacity : .identity)
                .zIndex(1)
            }
        }
    }

    /// Mounts the surface exactly on its row; `expand` then grows it from the surface's onAppear.
    private func open(_ slack: Slack) {
        guard selected == nil else { return }
        origin = rowFrames.frames[slack.id] ?? RowFrames()
        drag = 0
        if reduceMotion {
            withAnimation(SurfaceMotion.reduced) {
                selected = slack
                isExpanded = true
            }
        } else {
            isExpanded = false
            selected = slack
        }
    }

    private func expand() {
        guard !isExpanded else { return }
        withAnimation(SurfaceMotion.spring) {
            isExpanded = true
        }
    }

    /// Collapses the surface back into its row, then hands the row back.
    private func close() {
        guard let slack = selected else { return }
        if reduceMotion {
            withAnimation(SurfaceMotion.reduced) {
                selected = nil
            } completion: {
                isExpanded = false
                drag = 0
                focusedRow = slack.id
            }
            return
        }
        guard isExpanded else { return }
        withAnimation(SurfaceMotion.spring, completionCriteria: .removed) {
            isExpanded = false
            drag = 0
        } completion: {
            // A row opened again before the spring settled keeps its surface.
            guard !isExpanded else { return }
            selected = nil
            focusedRow = slack.id
        }
    }
}

private struct SectionTitle: View {
    let title: String

    init(_ title: String) {
        self.title = title
    }

    var body: some View {
        Text(title)
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(.secondary)
            .padding(.horizontal, 4)
            .padding(.top, 22)
            .padding(.bottom, 8)
            .accessibilityAddTraits(.isHeader)
    }
}

/// One slack as its own card: the surface that grows into the tide detail.
struct SlackRow: View {
    let slack: Slack
    let hasAlert: Bool
    /// Its surface is open above it: the row steps aside so the two are never seen together.
    let isOpen: Bool
    let frames: RowFrameStore
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(alignment: .firstTextBaseline, spacing: 12) {
                Text(slack.time)
                    .font(.system(.title3, design: .rounded, weight: .semibold))
                    .monospacedDigit()
                    .reportsWindowFrame { frame in frames.update(slack.id) { $0.time = frame } }
                VStack(alignment: .leading, spacing: 2) {
                    Text(slack.turn)
                        .reportsWindowFrame { frame in frames.update(slack.id) { $0.turn = frame } }
                    if let nextPeak = slack.nextPeak {
                        Text(nextPeak)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .reportsWindowFrame { frame in frames.update(slack.id) { $0.peak = frame } }
                    }
                }
                Spacer(minLength: 0)
                Image(systemName: "bell.fill")
                    .foregroundStyle(.tint)
                    .opacity(hasAlert ? 1 : 0)
                    .accessibilityHidden(true)
                    .reportsWindowFrame { frame in frames.update(slack.id) { $0.bell = frame } }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(.rect(cornerRadius: SurfaceMotion.cardRadius, style: .continuous))
        }
        .buttonStyle(SlackCardButtonStyle())
        .reportsWindowFrame { frame in frames.update(slack.id) { $0.card = frame } }
        .opacity(isOpen ? 0 : 1)
        .accessibilityValue(hasAlert ? "Alert set" : "")
        .accessibilityHint("Opens the tide detail")
    }
}

/// The row's card, with the system's pressed fill while a finger is on it.
private struct SlackCardButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background {
                RoundedRectangle(cornerRadius: SurfaceMotion.cardRadius, style: .continuous)
                    .fill(Color(uiColor: .secondarySystemGroupedBackground))
                    .overlay {
                        RoundedRectangle(cornerRadius: SurfaceMotion.cardRadius, style: .continuous)
                            .fill(Color(uiColor: .systemFill))
                            .opacity(configuration.isPressed ? 1 : 0)
                    }
            }
    }
}

#Preview {
    TodayView()
}
