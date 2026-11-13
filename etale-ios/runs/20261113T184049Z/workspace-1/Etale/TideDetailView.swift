import SwiftUI
import UIKit

/// The tide detail of one slack, drawn as the row's own card grown to the full screen.
/// It is an overlay above the Today list, not a navigation destination: the row's surface,
/// its time, its turn and its next current stay the same objects from the list to the detail.
struct TideDetailView: View {
    let day: TideDay
    let slack: Slack
    /// The tapped row's frames in window coordinates. Empty frames mean "no row": the
    /// surface then shows full screen, with nothing to travel from (as in the preview below).
    var origin = RowFrames()
    /// false: the surface sits exactly on its row. true: full screen.
    var isExpanded = true
    @Binding var drag: CGFloat
    @Binding var alerts: Set<String>
    var onAppear: () -> Void = {}
    var onClose: () -> Void = {}

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @AccessibilityFocusState private var headerFocused: Bool
    /// The row's time is title3; the hero is 56 pt. Scaling from one to the other keeps the glyphs continuous.
    @ScaledMetric(relativeTo: .title3) private var rowTimeSize: CGFloat = 20

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

    /// 0 on the row, 1 full screen. Under Reduce Motion the surface never travels: it cross-fades.
    private var progress: CGFloat { reduceMotion || isExpanded ? 1 : 0 }
    private var contentShown: Bool { reduceMotion || isExpanded }

    var body: some View {
        GeometryReader { proxy in
            let window = proxy.frame(in: .global)
            let dragFraction = min(drag / SurfaceMotion.dragScaleDistance, 1)
            let roundness = min(drag / SurfaceMotion.dragCommit, 1)

            VStack(alignment: .leading, spacing: 0) {
                header
                details
            }
            .frame(width: proxy.size.width, height: proxy.size.height, alignment: .top)
            .overlay(alignment: .topLeading) { rowBell(in: window) }
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .clipShape(
                RevealShape(
                    from: origin.card.offsetBy(dx: -window.minX, dy: -window.minY),
                    insets: proxy.safeAreaInsets,
                    progress: progress,
                    collapsedRadius: SurfaceMotion.cardRadius,
                    expandedRadius: SurfaceMotion.cardRadius * roundness
                )
            )
            .scaleEffect(1 - (1 - SurfaceMotion.dragMinScale) * dragFraction)
            .offset(y: drag)
        }
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(.isModal)
        .accessibilityAction(.escape) { onClose() }
        .onAppear {
            onAppear()
            headerFocused = true
        }
    }

    /// The row's three lines, grown. The drag-to-collapse handle.
    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.body.weight(.semibold))
                        .foregroundStyle(.secondary)
                        .frame(width: 44, height: 44)
                        .background(Color(uiColor: .tertiarySystemFill), in: .circle)
                }
                .buttonStyle(.plain)
                .keyboardShortcut(.cancelAction)
                .accessibilityLabel("Close")
                .surfaceContent(shown: contentShown, reduceMotion: reduceMotion)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Slack water")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .surfaceContent(shown: contentShown, reduceMotion: reduceMotion)
                Text(slack.time)
                    .font(.system(size: SurfaceMotion.heroTimeSize, weight: .semibold, design: .rounded))
                    .monospacedDigit()
                    .travels(from: origin.time, progress: progress, startScale: rowTimeSize / SurfaceMotion.heroTimeSize)
            }
            .accessibilityElement(children: .combine)
            .accessibilityFocused($headerFocused)

            Text(slack.turn)
                .travels(from: origin.turn, progress: progress)
            if let nextPeak = slack.nextPeak {
                Text(nextPeak)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .travels(from: origin.peak, progress: progress)
            }
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .contentShape(.rect)
        .gesture(collapseDrag)
    }

    /// What the row did not show. Fades in after the surface, leaves before it.
    private var details: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                Divider()

                Text("Tide height, metres above MLLW")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .padding(.top, 16)
                TideCurve(points: day.curve, markerMinutes: slack.minutes)
                    .frame(height: 180)
                    .padding(.vertical, 8)
                    .accessibilityLabel("Tide curve for \(day.dateWritten), slack water marked at \(slack.time)")

                Divider()

                if let afterTide = slack.afterTide {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Slack comes")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                        Text(afterTide)
                    }
                    .accessibilityElement(children: .combine)
                    .padding(.vertical, 16)
                    Divider()
                }

                Toggle("Alert me 15 minutes before", isOn: hasAlert)
                    .padding(.vertical, 12)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 24)
        }
        .scrollBounceBehavior(.basedOnSize)
        .surfaceContent(shown: contentShown, reduceMotion: reduceMotion)
    }

    /// The row's bell, left where it was on the row: it fades as the detail's toggle arrives.
    @ViewBuilder
    private func rowBell(in window: CGRect) -> some View {
        if !origin.bell.isNull {
            Image(systemName: "bell.fill")
                .foregroundStyle(.tint)
                .position(x: origin.bell.midX - window.minX, y: origin.bell.midY - window.minY)
                .opacity(alerts.contains(slack.id) ? 1 : 0)
                .surfaceContent(shown: !contentShown, reduceMotion: reduceMotion)
                .accessibilityHidden(true)
                .allowsHitTesting(false)
        }
    }

    private var collapseDrag: some Gesture {
        DragGesture(minimumDistance: 10)
            .onChanged { value in
                guard isExpanded else { return }
                drag = max(0, value.translation.height)
            }
            .onEnded { value in
                guard isExpanded else { return }
                if value.translation.height > SurfaceMotion.dragCommit
                    || value.predictedEndTranslation.height > SurfaceMotion.dragPredicted {
                    onClose()
                } else {
                    withAnimation(reduceMotion ? SurfaceMotion.reduced : SurfaceMotion.spring) {
                        drag = 0
                    }
                }
            }
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
    TideDetailView(day: .sample, slack: TideDay.sample.slacks[1], drag: .constant(0), alerts: .constant([]))
}
