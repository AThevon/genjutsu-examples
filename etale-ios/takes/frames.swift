// Dumps the frames of a simulator recording as PNG files: swift frames.swift <in.mp4> <out dir> <fps> [from s] [to s]
// Stands in for ffmpeg, which this machine does not have (ImageMagick cannot decode MP4 without it). Uses
// AVAssetImageGenerator with zero tolerance, so frame k is the picture on screen at from + k / fps.
// Prints the duration, the frame size and the number of frames written.
import AVFoundation
import AppKit

let args = CommandLine.arguments
guard args.count >= 4, let fps = Double(args[3]) else {
    print("usage: swift frames.swift <in.mp4> <out dir> <fps> [from s] [to s]")
    exit(64)
}
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let out = URL(fileURLWithPath: args[2])
try FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)

let semaphore = DispatchSemaphore(value: 0)
Task {
    let duration = try await asset.load(.duration).seconds
    let from = args.count > 4 ? Double(args[4])! : 0
    let to = min(args.count > 5 ? Double(args[5])! : duration, duration)
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    var count = 0
    var size = CGSize.zero
    var t = from
    while t < to {
        let image = try await generator.image(at: CMTime(seconds: t, preferredTimescale: 600)).image
        size = CGSize(width: image.width, height: image.height)
        let rep = NSBitmapImageRep(cgImage: image)
        let data = rep.representation(using: .png, properties: [:])!
        try data.write(to: out.appendingPathComponent(String(format: "f%05d.png", count)))
        count += 1
        t = from + Double(count) / fps
    }
    print("duration \(String(format: "%.3f", duration)) s, \(Int(size.width))x\(Int(size.height)), \(count) frames at \(fps) fps from \(from) s to \(String(format: "%.3f", to)) s")
    semaphore.signal()
}
semaphore.wait()
