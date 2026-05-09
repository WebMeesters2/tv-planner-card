# tv-planner-card
A Home Assistant custom Lovelace card for browsing EPG/program sources and copying selected items to calendars.

# TV Planner Card

A custom Lovelace card for Home Assistant that allows browsing TV/EPG program sources and copying selected programs into Home Assistant calendars.

The project started as a personal workflow tool for curating TV schedules from multiple EPG sources into a final “watch list” calendar, but is designed to support generic scheduling and planning workflows as well.

---

## Features

- Browse calendar events
- Browse HA-EPG program listings
- Copy selected items into Home Assistant calendars
- Group events by day
- Multi-channel EPG selection
- Manual refresh controls
- Lightweight frontend-only architecture
- No destructive "move/delete" logic

---

## Current Status

⚠️ Early alpha / proof-of-concept

This project is currently under active development and APIs/configuration may change frequently.

---

## Supported Sources

### Calendar sources

- Home Assistant calendar entities

### EPG sources

- HA-EPG entities
- Open-EPG based schedules

---

## Planned Features

- Visual card editor
- HACS support
- XMLTV support
- Additional EPG providers
- Search and filtering
- Duplicate detection
- Channel icons
- Bulk copy operations
- Drag/drop planning
- Responsive/mobile layouts

---

## Example: Calendar → Calendar

```yaml
type: custom:tv-planner-card
title: Copy TV Schedule
source_type: calendar
source_calendar: calendar.teevee_twee
target_calendar: calendar.televisie
copy_script: script.calendar_copy_event_to_another_calendar
days_to_show: 14
```

## Example: HA-EPG → Calendar
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

## Required Home Assistant Script
Example copy script
```yaml
alias: Calendar - Copy event to another calendar
mode: single

fields:
  source_type:
    name: Source type
    required: false
    selector:
      text:

  source_calendar:
    name: Source calendar
    required: false
    selector:
      text:

  source_entity:
    name: Source entity
    required: false
    selector:
      text:

  target_calendar:
    name: Target calendar
    required: true
    selector:
      text:

  summary:
    name: Summary
    required: true
    selector:
      text:

  description:
    name: Description
    required: false
    selector:
      text:

  location:
    name: Location
    required: false
    selector:
      text:

  start_date_time:
    name: Start date/time
    required: true
    selector:
      text:

  end_date_time:
    name: End date/time
    required: true
    selector:
      text:

sequence:
  - action: calendar.create_event
    target:
      entity_id: "{{ target_calendar }}"
    data:
      summary: "{{ summary }}"
      description: >-
        {{ description | default('') }}

        Copied from:
        source_type={{ source_type | default('') }}
        source_calendar={{ source_calendar | default('') }}
        source_entity={{ source_entity | default('') }}
      location: "{{ location | default('') }}"
      start_date_time: "{{ start_date_time }}"
      end_date_time: "{{ end_date_time }}"
```

---

## Installation (manual)
1. Copy `tv-planner-card.js` to `/config/www/`
2. Add as a dashboard resource:
```yaml
url: /local/tv-planner-card.js
type: module
```
3. Restart Home Assistant frontend, or hard-refresh browser.

---

## Disclaimer
This project is not affiliated with any EPG provider or broadcaster.

---

## License
MIT