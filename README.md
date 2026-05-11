# tv-planner-card

A custom Lovelace card for Home Assistant that allows browsing TV/EPG program sources and copying selected programs into Home Assistant calendars.

The project started as a personal workflow tool for curating TV schedules from multiple EPG sources into a final “watch list” calendar, but is designed to support generic scheduling and planning workflows as well.

![HA-EPG source card](screenshots/epg-base.png)

> [!IMPORTANT]
> The card requires the accompanying Home Assistant script blueprint
> (or compatible custom script) to enable calendar copy functionality.

---

## Features

- Browse Home Assistant calendar events
- Browse HA-EPG/Open-EPG program listings
- Copy selected items into Home Assistant calendars
- Group events by day
- Multi-channel EPG selection
- Channel icon support
- External channel icon JSON support
- Configurable description display modes
- Manual refresh controls
- Browser Mod dashboard refresh integration
- Lightweight frontend-only architecture
- Mobile-friendly layout
- Non-destructive copy workflow
- Localization support
- Configurable time/date formatting
- Session-based copied-event tracking
- Configurable debug logging

---

## Table of Contents

- [Current Status](#current-status)
- [Installation](#installation)
  - [Installation via HACS](#installation-via-hacs)
  - [Manual installation](#installation-manual)
- [Script Blueprint Installation](#script-blueprint-installation)
- [Quick Start Examples](#quick-start-examples)
- [Configuration](#configuration)
- [Supported Sources](#supported-sources)
- [Description Modes](#description-modes)
- [Time Formatting](#time-formatting)
- [Channel Icons](#channel-icons)
- [Localization](#localization)
- [Screenshots](#screenshots)
- [Development](#development)
- [Debugging](#debugging)
- [Roadmap](#roadmap)
- [Background](#background)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Current Status

⚠️ Active development project

The card is already fully usable for daily workflows, but configuration options and APIs may still evolve between versions.

---

## Installation

### Installation via HACS

1. Open HACS.
1. Go to the three-dot menu.
1. Choose **Custom repositories**.
1. Add this repository URL:

```text
https://github.com/WebMeesters2/tv-planner-card
```

1. Select category **Dashboard**.
1. Install **TV Planner Card**.
1. Restart Home Assistant or reload frontend resources if needed.

The dashboard resource should be added as:

```text
/hacsfiles/tv-planner-card/tv-planner-card.js
```

Resource type:

```text
JavaScript module
```

---

### Installation (manual)

1. Copy `tv-planner-card.js` to:

```text
/config/www/
```

1. Add as a dashboard resource:

```yaml
url: /local/tv-planner-card.js
type: module
```

1. Restart the Home Assistant frontend, or hard-refresh the browser.

---

## Script Blueprint Installation

The recommended setup is to create the copy script from the included blueprint.

### Import blueprint

You can import the script blueprint directly into Home Assistant:

```text
https://github.com/WebMeesters2/tv-planner-card/blob/main/blueprints/script/webmeesters2/tv_planner_copy_event.yaml
```

or use this button:

[![Import Blueprint](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https://github.com/WebMeesters2/tv-planner-card/blob/main/blueprints/script/webmeesters2/tv_planner_copy_event.yaml)

---

### Manual blueprint installation

Copy the blueprint file to:

```text
/config/blueprints/script/webmeesters2/tv_planner_copy_event.yaml
```

Then reload blueprints or restart Home Assistant.

In Home Assistant:

1. Go to **Settings → Automations & scenes → Blueprints**
2. Open the **Scripts** tab
3. Select **TV Planner Card - Copy event to calendar**
4. Create a new script from the blueprint
5. Select the target calendar
6. Save the script

Use the created script entity in the card configuration:

```yaml
copy_script: script.calendar_copy_event_to_another_calendar
target_calendar: calendar.televisie
```

`target_calendar` is still used by the card for display and confirmation text.  
The actual calendar used by the script is selected when creating the script from the blueprint.

---

### Alternative: manual copy script

If you prefer not to use the blueprint, a compatible example script is available separately:

```text
examples/calendar_copy_event_script.yaml
```

---

### Runtime fields

The card passes these values to the script at runtime:

| Field | Description |
| --- | --- |
| `source_type` | Source type, such as `calendar` or `ha_epg` |
| `source_calendar` | Source calendar entity, when applicable |
| `source_entity` | Source HA-EPG entity, when applicable |
| `summary` | Event/program title |
| `description` | Event/program description |
| `location` | Event/program location or channel |
| `start_date_time` | Event start date/time |
| `end_date_time` | Event end date/time |

---

## Quick Start Examples

### Calendar → Calendar

```yaml
type: custom:tv-planner-card
title: Copy TV Schedule
source_type: calendar
source_calendar: calendar.teevee_twee
target_calendar: calendar.televisie
copy_script: script.calendar_copy_event_to_another_calendar
days_to_show: 14
```

---

### HA-EPG → Calendar

```yaml
type: custom:tv-planner-card
title: Copy EPG → Teevee Twee
source_type: ha_epg
target_calendar: calendar.teevee_twee
copy_script: script.calendar_copy_event_to_another_calendar
days_to_show: 2

sources:
  - label: NPO 1
    entity: sensor.epg_npo1

  - label: NPO 2
    entity: sensor.epg_npo2

  - label: SBS6
    entity: sensor.epg_sbs6
```

---

## Configuration

| Option | Type | Description |
| ------ | ---- | ----------- |
| `title` | `string` | Card title |
| `source_type` | `calendar` \| `ha_epg` | Source provider type |
| `source_calendar` | `string` | Calendar entity used as source |
| `source_entity` | `string` | Single HA-EPG source entity |
| `sources` | `list` | Multiple selectable HA-EPG sources |
| `target_calendar` | `string` | Target calendar entity |
| `copy_script` | `string` | Script used for copying events |
| `days_to_show` | `number` | Number of days to display |
| `channel_icons` | `object` | Inline channel icon mappings |
| `channel_icons_url` | `string` | External JSON icon database |
| `description_mode` | `hidden` \| `visible` \| `toggle-on` \| `toggle-off` | Description display mode |
| `language` | `en` \| `nl` | UI language |
| `debug` | `boolean` | Enable debug logging |
| `time_display_mode` | `compact` \| `full` | Time display mode |
| `time_locale` | `string` | Locale for date/time formatting |

---

## Supported Sources

### Calendar sources

- Home Assistant calendar entities

### EPG sources

- HA-EPG entities
- Open-EPG based schedules

---

## Description Modes

The card supports configurable description visibility.

### Always visible (default)

```yaml
description_mode: visible
```

---

### Completely hidden

```yaml
description_mode: hidden
```

---

### Expand/collapse descriptions (collapsed by default)

```yaml
description_mode: toggle-off
```

---

### Expand/collapse descriptions (expanded by default)

```yaml
description_mode: toggle-on
```

---

## Time Formatting

The card supports compact and full time display modes.

### Compact mode (default)

```yaml
time_display_mode: compact
```

Example:

```text
Mon 11-05 23:45 → 00:35
```

---

### Full mode

```yaml
time_display_mode: full
```

Example:

```text
Mon 11-05 23:45 → Tue 12-05 00:35
```

---

### Locale configuration

```yaml
time_locale: nl-NL
```

Examples:

- `nl-NL`
- `en-GB`
- `en-US`
- `de-DE`

---

## Channel Icons

The card supports multiple channel icon lookup methods:

1. Native HA-EPG `channel_icon` attributes
2. Explicit `channel_icons` configuration
3. External JSON icon databases via `channel_icons_url`

---

### Example: explicit icon configuration

```yaml
type: custom:tv-planner-card
source_type: calendar

channel_icons:
  NPO 1: https://images.open-epg.com/8617.png
  NPO1: https://images.open-epg.com/8617.png
  SBS6: https://images.open-epg.com/8664.png
```

---

### Example: external JSON icon database

```yaml
type: custom:tv-planner-card
channel_icons_url: /local/channel-icons.json
```

---

### Example JSON

```json
{
  "NPO 1": "https://images.open-epg.com/8617.png",
  "NPO1": "https://images.open-epg.com/8617.png",
  "SBS6": "https://images.open-epg.com/8664.png"
}
```

The card automatically generates and matches normalized aliases such as:

- NPO 1 ↔ NPO1
- SBS6 ↔ SBS 6
- BBC NL ↔ BBCNL

---

## Localization

The card supports UI translations.

Currently supported languages:

- `en`
- `nl`

Example:

```yaml
language: nl
```

---

## Screenshots

### HA-EPG source browser

![HA-EPG source browser](screenshots/epg-selector.png)

---

### Intermediate planning calendar

![Intermediate planning calendar](screenshots/intermediate-calendar.png)

---

### Calendar-to-calendar copy workflow

![Calendar copy workflow](screenshots/calendar-copy.png)

---

### Final viewing calendar

![Final viewing calendar](screenshots/definite-calendar.png)

---

### Mobile view

![Mobile view](screenshots/mobile-view.png)

---

## Development

Project stack:

- TypeScript
- Lit
- Vite

---

### Build

```bash
npm install
npm run build
```

The generated frontend bundle is:

```text
dist/tv-planner-card.js
```

---

### Project structure

```text
src/
  tv-planner-card.ts
  localize.ts

blueprints/
  script/
    webmeesters2/
      tv_planner_copy_event.yaml

dist/
```

---

## Debugging

Enable debug logging:

```yaml
debug: true
```

This enables additional console logging for:

- event rendering
- calendar responses
- icon resolution
- internal parsing

---

## Roadmap

Planned features and improvements:

- Visual card editor
- XMLTV support
- Additional EPG providers
- Search and filtering
- Persistent duplicate detection
- Bulk copy operations
- Drag/drop planning
- Additional responsive/mobile optimizations
- Automatic refresh intervals
- Channel color accents

---

## Background

I use Home Assistant to automatically switch TV channels based on calendar events.

In practice, I use two separate calendars:

- A staging calendar containing programs I might want to watch
- A live viewing calendar containing programs I definitely want to watch live

This card was created to simplify the process of browsing TV schedules and copying programs between those calendars.

The automatic TV switching automation itself will eventually become a separate project.

---

## Disclaimer

This project is not affiliated with any EPG provider or broadcaster.

---

## License

MIT
