# QA Checklist

Manual test steps for every feature.

## Dashboard

- [ ] Open the app. The dashboard loads at the root route.
- [ ] The subtitle reads: Your intelligent on device memory, here's today's overview.
- [ ] Three stat cards display: Memories Indexed, Search Queries, Privacy Score.
- [ ] Stat cards show real counts from IndexedDB.
- [ ] Recent Activity section shows last actions.
- [ ] Quick Actions buttons navigate to the correct tabs.
- [ ] Stat cards have 3D tilt effect on hover.
- [ ] Profile section shows Moyosore Jobi, Software Engineer.
- [ ] Profile avatar uses the local image (not Unsplash).
- [ ] No face icon appears above the profile name.

## Navigation

- [ ] Click each sidebar item. The correct tab loads.
- [ ] Active sidebar item shows a blue indicator.
- [ ] Tab switching is instant with no layout jump.
- [ ] Refresh the page. The same tab stays active via URL hash.
- [ ] Use Ctrl+1 through Ctrl+7. Each shortcut opens the correct tab.
- [ ] Press Tab to focus sidebar items. Press Enter to activate.
- [ ] Press Arrow Down and Arrow Up to move between sidebar items.

## Search

- [ ] Click Search. The search page loads.
- [ ] Type a query. Results appear as you type (debounced).
- [ ] Results show highlighted keyword hits.
- [ ] Click a result. The Why matched panel expands.
- [ ] Why matched shows keyword hits, semantic score, recency boost, tag boost.
- [ ] Click Copy Body. Text copies to clipboard.
- [ ] Use the tag filter. Results narrow to matching tags.
- [ ] Search with no memories returns an empty state message.

## Memories

- [ ] Click Memories. The list loads.
- [ ] Click Add. The add form appears.
- [ ] Submit with empty title. Validation error shows.
- [ ] Submit with empty body. Validation error shows.
- [ ] Fill title, body, tags. Click Add Memory. Memory appears in list.
- [ ] Click the pen icon on a memory. Edit form loads with current data.
- [ ] Change text. Wait 1 second. Autosave activates.
- [ ] Click Save Changes. Returns to list with updated memory.
- [ ] Click the trash icon. Memory deletes. Undo toast appears.
- [ ] Click Undo within 5 seconds. Memory restores.
- [ ] Click the bulk actions icon. Checkboxes appear.
- [ ] Select multiple memories. Click Delete. Confirmation dialog shows.
- [ ] Select memories. Enter tags. Click Tag. Tags apply.
- [ ] Click Import. Select a .txt file. Memory imports.
- [ ] Use the tag filter. List filters by tag.
- [ ] Empty state shows when no memories exist.

## Processing

- [ ] Click Processing. The page loads.
- [ ] Click Start Indexing. Progress bar appears.
- [ ] Progress shows documents processed, total, estimated time.
- [ ] Click Pause. Status changes to paused. Progress bar turns yellow.
- [ ] Click Resume. Indexing continues.
- [ ] Click Cancel. Indexing stops. Status shows cancelled.
- [ ] Click Rebuild Index. Indexing starts fresh.
- [ ] Logs show events with timestamps.
- [ ] Past runs list shows completed runs.
- [ ] Cancel leaves the index in a consistent state.

## Privacy

- [ ] Click Privacy. The page loads.
- [ ] Toggle Reduce Motion. Effect applies instantly.
- [ ] Toggle No Remote Assets. Setting saves.
- [ ] Toggle Local Analytics. Setting saves.
- [ ] The "No telemetry" message displays.

## Export and Import

- [ ] In Privacy, scroll to Export Vault.
- [ ] Enter a passphrase. Click Export. JSON file downloads.
- [ ] Open the file. It contains encrypted ciphertext, salt, iv.
- [ ] Scroll to Import Vault. Enter the same passphrase.
- [ ] Choose the exported file. Memories restore.
- [ ] Try importing with the wrong passphrase. Error toast shows.
- [ ] Try importing an invalid file. Error toast shows.

## App Lock

- [ ] In Privacy, scroll to App Lock.
- [ ] Enter a passphrase. Click Enable Lock. Success toast shows.
- [ ] Refresh the page. Lock screen appears.
- [ ] Enter wrong passphrase. Error message shows.
- [ ] Enter correct passphrase. App unlocks.
- [ ] In Privacy, click Disable App Lock. Lock removes.

## Wipe

- [ ] In Privacy, scroll to Wipe All Data.
- [ ] Type something other than WIPE. Button stays disabled.
- [ ] Type WIPE. Click Wipe. All data clears.
- [ ] Memories list is empty. Stats reset.

## Analytics

- [ ] Click Analytics. Metrics display.
- [ ] Search p50 and p95 show values after searches.
- [ ] Memory count shows current count.
- [ ] Top tags show tag frequency.
- [ ] Recent queries show search history.
- [ ] Click CSV. File downloads.
- [ ] Click JSON. File downloads.
- [ ] Disable Local Analytics in Privacy. Analytics tab shows disabled message.

## About

- [ ] Click About. Page loads.
- [ ] What Cortex Does section explains the app.
- [ ] Full Tutorial covers all features.
- [ ] Tutorial uses short sentences and active voice.
- [ ] Keyboard shortcuts section lists all shortcuts.
- [ ] Troubleshooting section lists common issues.

## Error Handling

- [ ] Error boundary catches crashes and shows friendly screen.
- [ ] Reset App button reloads the page.
- [ ] Export Diagnostics button downloads a JSON file.
- [ ] Toast notifications appear for success, error, and info events.
- [ ] Undo toast works for delete operations.

## Accessibility

- [ ] Focus rings are visible on all interactive elements.
- [ ] ARIA labels are present on icons and buttons.
- [ ] Sidebar items have aria-current on active item.
- [ ] Screen reader can navigate the sidebar.
- [ ] Reduced motion preference is respected.

## Console

- [ ] Open browser console. No errors on load.
- [ ] Navigate all tabs. No errors in console.
- [ ] Add, edit, delete memories. No errors in console.
- [ ] Export and import. No errors in console.
