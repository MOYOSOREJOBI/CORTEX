/**
 * SettingsView.swift
 * Privacy controls and app preferences.
 * Manages indexing toggles, data clearing, and privacy settings.
 */

import SwiftUI

struct SettingsView: View {
    /// Whether photo indexing is enabled
    @State private var isPhotoIndexingEnabled: Bool = true

    /// Whether document (PDF) indexing is enabled
    @State private var isDocumentIndexingEnabled: Bool = true

    /// Whether notes indexing is enabled
    @State private var isNotesIndexingEnabled: Bool = true

    /// Whether biometric lock is required to access the app
    @State private var isBiometricLockEnabled: Bool = false

    /// Shows the clear data confirmation alert
    @State private var showClearConfirmation: Bool = false

    var body: some View {
        NavigationStack {
            Form {
                // Indexing settings
                Section("Indexing") {
                    Toggle("Photo Indexing", isOn: $isPhotoIndexingEnabled)
                    Toggle("Document Indexing", isOn: $isDocumentIndexingEnabled)
                    Toggle("Notes Indexing", isOn: $isNotesIndexingEnabled)
                }

                // Privacy settings
                Section("Privacy") {
                    Toggle("Biometric Lock", isOn: $isBiometricLockEnabled)

                    LabeledContent("Encryption") {
                        Text("AES-GCM (CryptoKit)")
                            .foregroundStyle(.secondary)
                    }

                    LabeledContent("Key Storage") {
                        Text("Keychain (Secure Enclave)")
                            .foregroundStyle(.secondary)
                    }

                    LabeledContent("Telemetry") {
                        Text("None")
                            .foregroundStyle(.green)
                    }
                }

                // Data management
                Section("Data") {
                    LabeledContent("Indexed Items") {
                        Text("0")
                            .foregroundStyle(.secondary)
                    }

                    LabeledContent("Database Size") {
                        Text("0 KB")
                            .foregroundStyle(.secondary)
                    }

                    Button("Clear All Data", role: .destructive) {
                        showClearConfirmation = true
                    }
                }

                // About section
                Section("About") {
                    LabeledContent("Version") {
                        Text("1.0.0")
                            .foregroundStyle(.secondary)
                    }

                    LabeledContent("Built by") {
                        Text("Moyosore Jobi")
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
            .alert("Clear All Data?", isPresented: $showClearConfirmation) {
                Button("Cancel", role: .cancel) {}
                Button("Clear", role: .destructive) {
                    // Placeholder: would call DatabaseManager.clearAll()
                }
            } message: {
                Text("This will permanently delete all indexed memories. This action cannot be undone.")
            }
        }
    }
}

#Preview {
    SettingsView()
}
