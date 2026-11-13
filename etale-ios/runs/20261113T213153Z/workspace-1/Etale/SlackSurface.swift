import SwiftUI

/// Every number of the slack row -> tide detail transition, in one place.
enum SlackMotion {
    /// Critically damped: slack water does not overshoot, so neither does the surface.
    static let spring = Animation.spring(duration: 0.45, bounce: 0)
    /// Reduce Motion: no travel, no growth, the finished detail crossfades in.
    static let reduced = Animation.easeInOut(duration: 0.2)

    /// The surface fill is opaque by this much of the travel.
    static let fillEnd: CGFloat = 0.2
    /// The rest of the detail fades in and rises over the second half of the travel.
    static let contentStart: CGFloat = 0.4
    static let contentRise: CGFloat = 12

    /// Dismissal follows the finger over this fraction of the screen, then commits past a distance
    /// or a predicted distance, else springs back.
    static let dragRange: CGFloat = 0.5
    static let commitDistance: CGFloat = 120
    static let commitPredicted: CGFloat = 260
    static let edgeWidth: CGFloat = 20

    /// Corner of the surface when it is still the size of its row.
    static let rowCorner: CGFloat = 16

    /// 0 before `start`, 1 after `end`, linear between.
    static func window(_ progress: CGFloat, from start: CGFloat, to end: CGFloat = 1) -> CGFloat {
        min(1, max(0, (progress - start) / (end - start)))
    }
}

/// The two slack times share one family so the time can travel between them without changing face.
enum SlackType {
    static let rowTime = Font.system(.title3, design: .rounded, weight: .semibold)
    static let detailTime = Font.system(size: 56, weight: .semibold, design: .rounded)
}

/// Where a slack row sits on screen, in global coordinates: the surface grows out of it.
struct SlackRowGeometry: Equatable {
    var row: CGRect = .zero
    var time: CGRect = .zero
}

/// The tide detail as a surface that grows out of its slack row.
///
/// `progress` runs from 0 (the surface is the row) to 1 (the surface is the screen). The view is
/// `Animatable`, so its body is evaluated on every frame with the interpolated progress and every
/// part of the surface reads the same clock. Only clip, offset, scale and opacity change per frame:
/// nothing in the detail is laid out again while it moves.
struct SlackSurface: View, Animatable {
    var progress: CGFloat
    let day: TideDay
    let slack: Slack?
    let source: SlackRowGeometry
    @Binding var alerts: Set<String>
    let reduceMotion: Bool
    /// The progress the finger asks for while dragging.
    let onDrag: (CGFloat) -> Void
    /// Called when the finger lifts: true to close, false to settle open again.
    let onRelease: (Bool) -> Void
    let onClose: () -> Void

    var animatableData: CGFloat {
        get { progress }
        set { progress = newValue }
    }

    @Environment(\.layoutDirection) private var layoutDirection
    @AccessibilityFocusState private var headFocused: Bool
    @State private var canvas: CGRect = .zero
    @State private var slot: CGRect = .zero

    /// Travel: 1 at once under Reduce Motion, so nothing moves or grows.
    private var travel: CGFloat { reduceMotion ? 1 : progress }
    /// Crossfade: only under Reduce Motion.
    private var fade: CGFloat { reduceMotion ? progress : 1 }
    private var contentPhase: CGFloat { SlackMotion.window(travel, from: SlackMotion.contentStart) }

    var body: some View {
        ZStack {
            fill
            if let slack {
                detail(slack)
                    .transition(.identity)
                movingTime(slack)
                    .transition(.identity)
                edgeStrip
                    .transition(.identity)
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(slack == nil ? [] : .isModal)
        .accessibilityAction(.escape) { onClose() }
        .onChange(of: slack?.id) { _, id in
            headFocused = id != nil
        }
    }

    // MARK: - Layers

    /// The surface itself: a clip that grows from the row's rectangle to the screen.
    private var fill: some View {
        let local = source.row.offsetBy(dx: -canvas.minX, dy: -canvas.minY)
        let clip = local.interpolated(to: CGRect(origin: .zero, size: canvas.size), travel)
        return ZStack {
            Color(uiColor: .secondarySystemGroupedBackground)
            Color(uiColor: .systemGroupedBackground)
                .opacity(SlackMotion.window(travel, from: SlackMotion.fillEnd))
        }
        .clipShape(SurfaceClip(rect: clip, cornerRadius: SlackMotion.rowCorner * (1 - travel)))
        .opacity(SlackMotion.window(travel, from: 0, to: SlackMotion.fillEnd) * fade)
        .ignoresSafeArea()
        .onGeometryChange(for: CGRect.self) { proxy in
            proxy.frame(in: .global)
        } action: { frame in
            canvas = frame
        }
        .accessibilityHidden(true)
    }

    /// The slack time: the still point. It travels from the row to the head and never fades.
    private func movingTime(_ slack: Slack) -> some View {
        let end = slot == .zero ? source.time : slot
        let start = source.time == .zero ? end : source.time
        let position = start.origin.interpolated(to: end.origin, travel)
        let startScale = end.height > 0 ? start.height / end.height : 1
        let scale = startScale + (1 - startScale) * travel
        return ZStack(alignment: .topLeading) {
            Text(slack.time)
                .font(SlackType.detailTime)
                .monospacedDigit()
                .fixedSize()
                .scaleEffect(scale, anchor: .topLeading)
                .offset(x: position.x - canvas.minX, y: position.y - canvas.minY)
                .opacity(fade)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .ignoresSafeArea()
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }

    private func detail(_ slack: Slack) -> some View {
        VStack(spacing: 0) {
            head(slack)
            TideDetailView(day: day, slack: slack, alerts: $alerts)
                .modifier(Rise(phase: contentPhase, fade: fade))
        }
    }

    private func head(_ slack: Slack) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Capsule()
                .fill(.tertiary)
                .frame(width: 36, height: 5)
                .frame(maxWidth: .infinity)
                .padding(.top, 6)
                .modifier(Rise(phase: contentPhase, fade: fade))
                .accessibilityHidden(true)

            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Slack water")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .modifier(Rise(phase: contentPhase, fade: fade))
                    // The slot the travelling time lands in. It never moves, so it is measured once.
                    Text(slack.time)
                        .font(SlackType.detailTime)
                        .monospacedDigit()
                        .fixedSize()
                        .hidden()
                        .onGeometryChange(for: CGRect.self) { proxy in
                            proxy.frame(in: .global)
                        } action: { frame in
                            slot = frame
                        }
                    Text("\(slack.turn).")
                        .font(.body)
                        .modifier(Rise(phase: contentPhase, fade: fade))
                }
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("Slack water at \(slack.time). \(slack.turn).")
                .accessibilityAddTraits(.isHeader)
                .accessibilityFocused($headFocused)

                Spacer(minLength: 12)

                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.body.weight(.semibold))
                }
                .buttonStyle(.bordered)
                .buttonBorderShape(.circle)
                .controlSize(.large)
                .frame(minWidth: 44, minHeight: 44)
                .accessibilityLabel("Close")
                .modifier(Rise(phase: contentPhase, fade: fade))
            }
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 8)
        .contentShape(Rectangle())
        .gesture(drag { translation in translation.height } extent: { canvas.height })
    }

    /// The edge swipe the navigation stack used to give: a thin strip on the leading edge.
    private var edgeStrip: some View {
        HStack(spacing: 0) {
            Color.clear
                .frame(width: SlackMotion.edgeWidth)
                .contentShape(Rectangle())
                .gesture(drag { translation in
                    layoutDirection == .rightToLeft ? -translation.width : translation.width
                } extent: { canvas.width })
            Spacer(minLength: 0)
        }
        .ignoresSafeArea()
        .accessibilityHidden(true)
    }

    // MARK: - Dismissal

    /// A drag that maps one axis of the finger to the surface's progress. It reads in global
    /// coordinates: what it drives moves, and a local space would move with it.
    private func drag(
        _ distance: @escaping (CGSize) -> CGFloat,
        extent: @escaping () -> CGFloat
    ) -> some Gesture {
        DragGesture(minimumDistance: 8, coordinateSpace: .global)
            .onChanged { value in
                let range = max(1, extent() * SlackMotion.dragRange)
                onDrag(1 - min(1, max(0, distance(value.translation)) / range))
            }
            .onEnded { value in
                let shouldClose = distance(value.translation) > SlackMotion.commitDistance
                    || distance(value.predictedEndTranslation) > SlackMotion.commitPredicted
                onRelease(shouldClose)
            }
    }
}

/// The detail around the time: fades in and rises over the second half of the travel.
private struct Rise: ViewModifier {
    let phase: CGFloat
    let fade: CGFloat

    func body(content: Content) -> some View {
        content
            .opacity(phase * fade)
            .offset(y: (1 - phase) * SlackMotion.contentRise)
    }
}

/// A rounded rectangle at an arbitrary place inside the surface.
private struct SurfaceClip: Shape {
    let rect: CGRect
    let cornerRadius: CGFloat

    func path(in _: CGRect) -> Path {
        Path(roundedRect: rect, cornerRadius: max(0, cornerRadius), style: .continuous)
    }
}

private extension CGRect {
    func interpolated(to other: CGRect, _ t: CGFloat) -> CGRect {
        CGRect(
            x: minX + (other.minX - minX) * t,
            y: minY + (other.minY - minY) * t,
            width: width + (other.width - width) * t,
            height: height + (other.height - height) * t
        )
    }
}

private extension CGPoint {
    func interpolated(to other: CGPoint, _ t: CGFloat) -> CGPoint {
        CGPoint(x: x + (other.x - x) * t, y: y + (other.y - y) * t)
    }
}
