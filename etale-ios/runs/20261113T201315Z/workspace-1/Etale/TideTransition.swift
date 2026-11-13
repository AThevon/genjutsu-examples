import SwiftUI

/// Motion for opening a slack from the Today list into its tide detail.
///
/// The row and the detail are one surface: the system zoom transition grows the detail out of the
/// row and shrinks it back on dismiss (back button, edge swipe or drag, all interactive). Its
/// duration and curve belong to the system. Étale only sets the marker that settles on the curve
/// once the detail has landed: critically damped, because at slack the water stops and nothing
/// here overshoots.
enum TideMotion {
    /// Spring of the slack marker on the tide curve. `bounce: 0` is critical damping.
    static let markerSpring = Animation.spring(duration: 0.45, bounce: 0)

    /// Time left for the zoom to land before the marker starts to settle.
    static let markerDelay: TimeInterval = 0.35

    static var markerSettle: Animation { markerSpring.delay(markerDelay) }

    /// Starting scale of the marker dot. Never 0: it grows from half its size.
    static let markerDotStartScale: CGFloat = 0.5

    /// Corners of the zoom's source, so it starts from a surface that reads as the cell.
    static let sourceCornerRadius: CGFloat = 12
}

extension View {
    /// Marks a slack row as the surface its tide detail zooms out of.
    func slackTransitionSource(id: String, in namespace: Namespace.ID) -> some View {
        matchedTransitionSource(id: id, in: namespace) { source in
            source
                .background(Color(.secondarySystemGroupedBackground))
                .clipShape(RoundedRectangle(cornerRadius: TideMotion.sourceCornerRadius))
        }
    }

    /// Opens the tide detail out of the row tagged with the same id. With Reduce Motion on, the
    /// detail keeps the system's automatic navigation transition instead of the zoom.
    func slackZoomTransition(sourceID: String, in namespace: Namespace.ID) -> some View {
        modifier(SlackZoomTransition(sourceID: sourceID, namespace: namespace))
    }
}

private struct SlackZoomTransition: ViewModifier {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    let sourceID: String
    let namespace: Namespace.ID

    func body(content: Content) -> some View {
        if reduceMotion {
            content
        } else {
            content.navigationTransition(.zoom(sourceID: sourceID, in: namespace))
        }
    }
}
