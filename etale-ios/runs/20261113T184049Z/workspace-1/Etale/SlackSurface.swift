import SwiftUI

/// The motion of a slack row opening into its tide detail, as one surface.
/// Every number here is in the validated-or-not thesis; nothing else moves.
enum SurfaceMotion {
    /// Critically damped: slack water is the current standing still, so nothing overshoots.
    static let spring = Animation.spring(duration: 0.45, bounce: 0)
    /// The detail's own content arrives once the surface has mostly grown...
    static let contentIn = Animation.easeOut(duration: 0.2).delay(0.15)
    /// ...and leaves first, while the surface starts collapsing.
    static let contentOut = Animation.easeIn(duration: 0.12)
    /// Reduce Motion: no travel, no growth, a cross-fade.
    static let reduced = Animation.easeInOut(duration: 0.2)

    static let cardRadius: CGFloat = 16
    static let heroTimeSize: CGFloat = 56

    /// Drag on the header: collapse past this translation...
    static let dragCommit: CGFloat = 120
    /// ...or when the fling is predicted to end past this one.
    static let dragPredicted: CGFloat = 240
    /// The surface shrinks to `dragMinScale` over this distance.
    static let dragScaleDistance: CGFloat = 400
    static let dragMinScale: CGFloat = 0.9
}

/// Where a slack row's pieces sit in the window, read the moment the row is tapped.
nonisolated struct RowFrames: Sendable {
    var card: CGRect = .null
    var time: CGRect = .null
    var turn: CGRect = .null
    var peak: CGRect = .null
    var bell: CGRect = .null
}

/// The rows' frames, kept up to date as the list scrolls. A plain class on purpose:
/// writing to it does not re-render the list on every scrolled frame.
final class RowFrameStore {
    var frames: [String: RowFrames] = [:]

    func update(_ id: String, _ write: (inout RowFrames) -> Void) {
        write(&frames[id, default: RowFrames()])
    }
}

extension View {
    /// Reports this view's frame in window coordinates whenever it changes.
    func reportsWindowFrame(_ action: @escaping (CGRect) -> Void) -> some View {
        onGeometryChange(for: CGRect.self) { proxy in
            proxy.frame(in: .global)
        } action: { frame in
            action(frame)
        }
    }

    /// Moves a detail line from where it sat in the row (progress 0) to its own place (progress 1).
    /// A render-only effect: the detail's layout never changes while the surface grows.
    func travels(from source: CGRect, progress: CGFloat, startScale: CGFloat = 1) -> some View {
        visualEffect { [source, progress, startScale] effect, proxy in
            let frame = proxy.frame(in: .global)
            let usable = !source.isNull && !source.isEmpty && !frame.isEmpty
            let rest = usable ? 1 - progress : 0
            let scale = usable ? startScale + (1 - startScale) * progress : 1
            return effect
                .scaleEffect(scale, anchor: .leading)
                .offset(x: (source.minX - frame.minX) * rest, y: (source.midY - frame.midY) * rest)
        }
    }
}

/// The surface's clip: the row's card at progress 0, the whole screen at 1.
/// Only the path changes per frame; nothing is laid out again.
nonisolated struct RevealShape: Shape {
    /// The row's card, in the surface's local coordinates.
    var from: CGRect
    /// The surface's safe-area insets, so progress 1 reaches the screen edges.
    var insets: EdgeInsets
    var progress: CGFloat
    var collapsedRadius: CGFloat
    var expandedRadius: CGFloat

    var animatableData: AnimatablePair<CGFloat, CGFloat> {
        get { AnimatablePair(progress, expandedRadius) }
        set {
            progress = newValue.first
            expandedRadius = newValue.second
        }
    }

    func path(in rect: CGRect) -> Path {
        let full = CGRect(
            x: rect.minX - insets.leading,
            y: rect.minY - insets.top,
            width: rect.width + insets.leading + insets.trailing,
            height: rect.height + insets.top + insets.bottom
        )
        let start = from.isNull || from.isEmpty ? full : from
        let p = progress
        let frame = CGRect(
            x: start.minX + (full.minX - start.minX) * p,
            y: start.minY + (full.minY - start.minY) * p,
            width: start.width + (full.width - start.width) * p,
            height: start.height + (full.height - start.height) * p
        )
        let radius = collapsedRadius + (expandedRadius - collapsedRadius) * p
        return Path(roundedRect: frame, cornerRadius: max(0, radius), style: .continuous)
    }
}

/// The detail's own content (everything that is not one of the row's three lines).
private struct SurfaceContentFade: ViewModifier {
    let isShown: Bool
    let reduceMotion: Bool

    func body(content: Content) -> some View {
        content
            .opacity(isShown ? 1 : 0)
            .animation(reduceMotion ? nil : (isShown ? SurfaceMotion.contentIn : SurfaceMotion.contentOut), value: isShown)
    }
}

extension View {
    func surfaceContent(shown: Bool, reduceMotion: Bool) -> some View {
        modifier(SurfaceContentFade(isShown: shown, reduceMotion: reduceMotion))
    }
}
