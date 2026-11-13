import XCTest

/// Drives the installed Étale app (com.example.etale) while `xcrun simctl io recordVideo` films the simulator.
/// One test per take. Each prints "DRIVER <label> <seconds since launch>" so the clip can be cut on the taps.
final class EtaleDriver: XCTestCase {
    private var app: XCUIApplication!
    private var start = Date()

    override func setUp() {
        continueAfterFailure = false
        app = XCUIApplication(bundleIdentifier: "com.example.etale")
        app.launch()
        start = Date()
        XCTAssertTrue(app.staticTexts["Slack water today"].waitForExistence(timeout: 20))
    }

    private func mark(_ label: String) {
        print("DRIVER \(label) \(String(format: "%.3f", Date().timeIntervalSince(start)))")
    }

    private func hold(_ seconds: TimeInterval) {
        Thread.sleep(forTimeInterval: seconds)
    }

    /// The row of the day list that holds the slack at `time` ("10:31"): the first button whose label
    /// contains that time (the row, in the starting app and in the run's), else the text itself.
    private func row(_ time: String) -> XCUIElement {
        let predicate = NSPredicate(format: "label CONTAINS %@", time)
        let button = app.buttons.containing(predicate).firstMatch
        if button.exists { return button }
        let labelled = app.buttons.matching(predicate).firstMatch
        if labelled.exists { return labelled }
        return app.staticTexts.matching(predicate).element(boundBy: 1)
    }

    /// Open the 10:31 slack, hold, go back, hold, open the 16:17 slack, hold, go back.
    func testOpenAndClose() {
        hold(1.2)
        mark("tap-open-1031")
        row("10:31").tap()
        hold(2.4)
        mark("tap-back")
        back()
        hold(2.0)
        mark("tap-open-1617")
        row("16:17").tap()
        hold(2.4)
        mark("tap-back-2")
        back()
        hold(1.6)
        mark("end")
    }

    /// Open the 10:31 slack, switch its alert on, go back: the bell shows on the row.
    func testAlert() {
        hold(1.0)
        mark("tap-open-1031")
        row("10:31").tap()
        hold(2.0)
        mark("tap-alert")
        app.switches.firstMatch.tap()
        hold(1.2)
        mark("tap-back")
        back()
        hold(2.0)
        mark("end")
    }

    /// Open the 10:31 slack, then drag its header down by 300 pt over one second and let go.
    func testDragClose() {
        hold(1.0)
        mark("tap-open-1031")
        row("10:31").tap()
        hold(2.0)
        mark("drag-start")
        let from = app.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.2))
        let to = from.withOffset(CGVector(dx: 0, dy: 300))
        from.press(forDuration: 0.1, thenDragTo: to, withVelocity: 300, thenHoldForDuration: 0.3)
        mark("drag-end")
        hold(2.0)
        mark("end")
    }

    /// Open the 10:31 slack and stay there (for a still of the detail).
    func testOpenOnly() {
        hold(1.0)
        mark("tap-open-1031")
        row("10:31").tap()
        hold(6.0)
        mark("end")
    }

    /// Leave the detail by whatever the screen offers: the navigation bar's back button, else a button
    /// named Close, Done or Back, else the first button on screen.
    private func back() {
        let bar = app.navigationBars.buttons.firstMatch
        if bar.exists && bar.isHittable { bar.tap(); return }
        for name in ["Close", "Done", "Back"] {
            let button = app.buttons[name].firstMatch
            if button.exists && button.isHittable { button.tap(); return }
        }
        XCTFail("no way back found: \(app.debugDescription)")
    }
}
