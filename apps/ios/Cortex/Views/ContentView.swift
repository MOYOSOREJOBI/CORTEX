/**
 * ContentView.swift
 * Root view with tab-based navigation.
 * Provides access to Search, Memories, and Settings tabs.
 */

import SwiftUI

struct ContentView: View {
    /// Currently selected tab
    @State private var selectedTab: Tab = .search

    /// Available tabs in the app
    enum Tab: String, CaseIterable {
        case search = "Search"
        case memories = "Memories"
        case settings = "Settings"

        /// SF Symbol icon name for each tab
        var iconName: String {
            switch self {
            case .search: return "magnifyingglass"
            case .memories: return "brain"
            case .settings: return "gear"
            }
        }
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            // Search tab — hybrid semantic + keyword search
            SearchView()
                .tabItem {
                    Label(Tab.search.rawValue, systemImage: Tab.search.iconName)
                }
                .tag(Tab.search)

            // Memories tab — placeholder for indexed items list
            NavigationStack {
                List {
                    Text("No memories indexed yet.")
                        .foregroundStyle(.secondary)
                }
                .navigationTitle("Memories")
            }
            .tabItem {
                Label(Tab.memories.rawValue, systemImage: Tab.memories.iconName)
            }
            .tag(Tab.memories)

            // Settings tab — privacy controls and preferences
            SettingsView()
                .tabItem {
                    Label(Tab.settings.rawValue, systemImage: Tab.settings.iconName)
                }
                .tag(Tab.settings)
        }
    }
}

#Preview {
    ContentView()
}
