import Foundation

/// One day of NOAA predictions for Aquatic Park, San Francisco, read from tide.json in the bundle.
/// Every value is kept as the string NOAA returned and converted where it is used.
struct TideDay: Decodable {
    struct CurvePoint: Decodable {
        let t: String
        let m: String
    }

    struct HighLow: Decodable, Identifiable {
        let t: String
        let type: String
        let m: String

        var id: String { t }
        var isHigh: Bool { type == "H" }
    }

    struct CurrentEvent: Decodable {
        let t: String
        let type: String
        let velocityKnots: String

        enum CodingKeys: String, CodingKey {
            case t, type
            case velocityKnots = "velocity_knots"
        }
    }

    let date: String
    let dateWritten: String
    let tideCurve: [CurvePoint]
    let highsLows: [HighLow]
    let currentSlackAndMax: [CurrentEvent]

    enum CodingKeys: String, CodingKey {
        case date
        case dateWritten = "date_written"
        case tideCurve = "tide_curve"
        case highsLows = "highs_lows"
        case currentSlackAndMax = "current_slack_and_max"
    }

    static let sample: TideDay = {
        guard let url = Bundle.main.url(forResource: "tide", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let day = try? JSONDecoder().decode(TideDay.self, from: data)
        else {
            fatalError("tide.json is missing from the bundle or does not decode")
        }
        return day
    }()
}

/// A slack water of the day, with the currents on each side of it and the tide it follows.
struct Slack: Identifiable, Hashable {
    let time: String
    let before: String
    let after: String
    let nextPeakKnots: Double?
    let nextPeakTime: String?
    let tideType: String?
    let tideTime: String?
    let tideMetres: Double?

    var id: String { time }

    var minutes: Int { Clock.minutes(time) }

    /// "Ebb turns to flood"
    var turn: String { "\(before.capitalized) turns to \(after)" }

    /// "then flood to 1.44 kn at 13:37"
    var nextPeak: String? {
        guard let nextPeakKnots, let nextPeakTime else { return nil }
        return "then \(after) to \(Clock.decimal(nextPeakKnots)) kn at \(nextPeakTime)"
    }

    /// "50 min after low water (09:41, 1.05 m)"
    var afterTide: String? {
        guard let tideType, let tideTime, let tideMetres else { return nil }
        let gap = minutes - Clock.minutes(tideTime)
        let name = tideType == "H" ? "high water" : "low water"
        return "\(gap) min after \(name) (\(tideTime), \(Clock.decimal(tideMetres)) m)"
    }
}

extension TideDay {
    /// The slacks of the day, in order. The current before a slack is the one that peaked last;
    /// the current after it is the other one.
    var slacks: [Slack] {
        currentSlackAndMax.enumerated().compactMap { index, event in
            guard event.type == "slack" else { return nil }
            let previous = currentSlackAndMax[..<index].last { $0.type != "slack" }
            let next = currentSlackAndMax[(index + 1)...].first { $0.type != "slack" }
            let before = previous?.type ?? (next?.type == "flood" ? "ebb" : "flood")
            let after = before == "flood" ? "ebb" : "flood"
            let time = Clock.time(event.t)
            let tide = highsLows.last { Clock.minutes(Clock.time($0.t)) <= Clock.minutes(time) }
            return Slack(
                time: time,
                before: before,
                after: after,
                nextPeakKnots: next.flatMap { Double($0.velocityKnots) }.map(abs),
                nextPeakTime: next.map { Clock.time($0.t) },
                tideType: tide?.type,
                tideTime: tide.map { Clock.time($0.t) },
                tideMetres: tide.flatMap { Double($0.m) }
            )
        }
    }

    /// The tide curve as (minutes since midnight, metres above MLLW).
    var curve: [(minutes: Int, metres: Double)] {
        tideCurve.compactMap { point in
            guard let metres = Double(point.m) else { return nil }
            return (Clock.minutes(Clock.time(point.t)), metres)
        }
    }
}

/// The data covers one day, so the app runs on a fixed clock inside it.
enum Clock {
    static let now = "09:12"

    /// "2026-10-02 10:31" -> "10:31"
    static func time(_ stamp: String) -> String {
        String(stamp.suffix(5))
    }

    /// "10:31" -> 631
    static func minutes(_ time: String) -> Int {
        let parts = time.split(separator: ":").compactMap { Int($0) }
        guard parts.count == 2 else { return 0 }
        return parts[0] * 60 + parts[1]
    }

    /// 1.049 -> "1.05", with a point whatever the device's region: the app is in English only.
    static func decimal(_ value: Double) -> String {
        String(format: "%.2f", locale: Locale(identifier: "en_US_POSIX"), value)
    }

    /// 79 -> "1 h 19 min"
    static func duration(_ minutes: Int) -> String {
        let hours = minutes / 60
        let rest = minutes % 60
        if hours == 0 { return "\(rest) min" }
        if rest == 0 { return "\(hours) h" }
        return "\(hours) h \(rest) min"
    }
}
