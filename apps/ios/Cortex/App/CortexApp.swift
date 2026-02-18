/**
 * CortexApp.swift
 * Main entry point for the CORTEX iOS application.
 * Configures the app lifecycle and root view hierarchy.
 *
 * Target: iOS 17+
 * Architecture: SwiftUI + Swift Actors for concurrency safety
 */

import SwiftUI

@main
struct CortexApp: App {
    /// Database manager shared across the app via environment
    @State private var databaseManager = DatabaseManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(databaseManager)
        }
    }
}
