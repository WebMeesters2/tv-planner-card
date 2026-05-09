import { LitElement, html, css } from "lit";

interface TvPlannerCardConfig {
  title?: string;
  source_type?: "calendar" | "ha_epg";
  source_calendar?: string;
  source_entity?: string;
  target_calendar: string;
  copy_script: string;
  days_to_show?: number;
  sources?: TvPlannerSource[];
}

interface TvPlannerSource {
  label: string;
  entity: string;
}

interface TvPlannerEvent {
  start: string;
  end: string;
  summary?: string;
  description?: string;
  location?: string;
  channel_icon?: string;
  source?: string;
}

type HassLike = {
  states: Record<string, any>;
  callService: (...args: any[]) => Promise<any>;
};

class TvPlannerCard extends LitElement {
  private config?: TvPlannerCardConfig;
  private events: TvPlannerEvent[] = [];
  private loading = false;
  private selectedSourceEntity = "";
  private loaded = false;
  private _hass?: HassLike;
  private lastCopied = "";

  static styles = css`
    h2 {
      margin-top: 0;
    }

    button {
      cursor: pointer;
    }

    #refresh {
      margin-bottom: 12px;
    }

    .event {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      border-top: 1px solid var(--divider-color);
    }

    .event-main {
      min-width: 0;
    }

    .time,
    .description {
      color: var(--secondary-text-color);
      font-size: 0.9em;
      margin-top: 3px;
    }

    .copy {
      align-self: center;
      white-space: nowrap;
    }

    .day-separator {
      margin-top: 14px;
      padding: 6px 0;
      font-weight: 700;
      border-top: 1px solid var(--divider-color);
      color: var(--accent-color);
      font-size: 1.05em;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .success {
      color: var(--accent-color);
      font-size: 0.9em;
    }

    .source-selector {
      margin: 10px 0 14px 0;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .source-selector select {
      flex: 1;
    }
  `;

  setConfig(config: TvPlannerCardConfig) {
    this.config = config;
    this.events = [];
    this.loading = false;
    this.selectedSourceEntity =
      config.source_entity || config.sources?.[0]?.entity || "";
  }

  set hass(hass: HassLike) {
    this._hass = hass;

    if (!this.loaded) {
      this.loaded = true;
      this.loadEvents();
    }
  }

  async loadEvents() {
    this.loading = true;
    this.requestUpdate();
    const config = this.config!;

    try {
      if (config.source_type === "ha_epg") {
        this.loadHaEpgEvents();
      } else {
        await this.loadCalendarEvents();
      }
    } catch (err) {
      console.error("Calendar Copy Card: failed to load events", err);
      this.events = [];
    }

    this.loading = false;
    this.requestUpdate();
  }

  async loadCalendarEvents() {
    const start = new Date();
    const end = new Date();
    const config = this.config;
    const hass = this._hass;
    
    if (!config || !hass || !config.source_calendar) return;

    end.setDate(end.getDate() + (config.days_to_show || 14));

    const response = await hass.callService(
      "calendar",
      "get_events",
      {
        start_date_time: start.toISOString(),
        end_date_time: end.toISOString(),
      },
      {
        entity_id: config.source_calendar,
      },
      false,
      true,
    );

    console.log("Calendar Copy Card response:", response);

    const data = response?.response || response;

    if (Array.isArray(data)) {
      this.events = data;
    } else if (data?.events) {
      this.events = data.events;
    } else if (data?.[config.source_calendar]?.events) {
      this.events = data[config.source_calendar].events;
    } else {
      this.events = [];
    }
  }

  async copyEvent(event: TvPlannerEvent) {
    if (!event) {
      alert("Could not find this event.");
      return;
    }

    console.log("Calendar Copy Card selected event:", event);

    const config = this.config;

    if (!config) {
      alert("Configuration not found.");
      return;
    }
    
    const hass = this._hass;
    if (!hass) {
      alert("Home Assistant connection not found.");
      return;
    }

    const ok = confirm(
      `Copy "${event.summary}" to ${config.target_calendar}?`,
    );

    if (!ok) return;

    await hass.callService("script", config.copy_script, {
      source_type: config.source_type || "calendar",
      source_calendar: config.source_calendar || "",
      source_entity:
        this.selectedSourceEntity || config.source_entity || "",
      target_calendar: config.target_calendar,
      summary: event.summary || "",
      description: event.description || "",
      location: event.location || "",
      start_date_time: event.start,
      end_date_time: event.end,
    });

    // Old browser-refresh after each copy
    // await this.loadEvents();
    // await this._hass.callService("browser_mod", "refresh");

    this.lastCopied = event.summary || "Event";
    this.requestUpdate();
  }

  // render() {
  //   if (!this._hass || !this.config) return;

  //   this.innerHTML = `
  //     <ha-card>
  //       <div class="card-content">
  //         <h2>${this.config.title || "Copy calendar events"}</h2>

  //         <button id="refresh">Reload events</button>
  //         <button id="browser-refresh">Refresh dashboard</button>

  //         ${
  //           this.lastCopied
  //             ? `<p class="success">Copied: ${this.lastCopied}</p>`
  //             : ""
  //         }

  //         ${this.renderSourceSelector()}

  //         ${
  //           this.loading
  //             ? `<p>Loading events...</p>`
  //             : this.events.length === 0
  //               ? `<p>No events found.</p>`
  //               : Object.entries(this.groupEventsByDay())
  //                   .map(
  //                     ([day, events]) => `
  //                       <div class="day-separator">
  //                         ${this.formatDay(events[0].start)}
  //                       </div>

  //                       ${events
  //                         .map((event) => {
  //                           const index = this.events.indexOf(event);

  //                           return `
  //                             <div class="event">
  //                               <div class="event-main">
  //                                 <strong>${event.summary || "(No title)"}</strong>
  //                                 <div class="time">
  //                                   ${this.formatDate(event.start)}
  //                                   →
  //                                   ${this.formatDate(event.end)}
  //                                 </div>
  //                                 ${
  //                                   event.description
  //                                     ? `<div class="description">${event.description}</div>`
  //                                     : ""
  //                                 }
  //                               </div>
  //                               <button class="copy" data-index="${index}">
  //                                 <!-- Copy -->
  //                                 Copy
  //                                 </button>
  //                             </div>
  //                           `;
  //                         })
  //                         .join("")}
  //                     `,
  //                   )
  //                   .join("")
  //         }
  //       </div>

  //       <style>
  //         h2 {
  //           margin-top: 0;
  //         }

  //         button {
  //           cursor: pointer;
  //         }

  //         #refresh {
  //           margin-bottom: 12px;
  //         }

  //         .event {
  //           display: flex;
  //           justify-content: space-between;
  //           gap: 12px;
  //           padding: 10px 0;
  //           border-top: 1px solid var(--divider-color);
  //         }

  //         .event-main {
  //           min-width: 0;
  //         }

  //         .time,
  //         .description {
  //           color: var(--secondary-text-color);
  //           font-size: 0.9em;
  //           margin-top: 3px;
  //         }

  //         .copy {
  //           align-self: center;
  //           white-space: nowrap;
  //         }

  //         .day-separator {
  //           margin-top: 14px;
  //           padding: 6px 0;
  //           font-weight: 700;
  //           border-top: 1px solid var(--divider-color);
  //           color: var(--accent-color);
  //           font-size: 1.05em;
  //           text-transform: uppercase;
  //           letter-spacing: 0.04em;
  //         }

  //         .success {
  //           color: var(--accent-color);
  //           font-size: 0.9em;
  //         }

  //         .source-selector {
  //           margin: 10px 0 14px 0;
  //           display: flex;
  //           gap: 8px;
  //           align-items: center;
  //         }

  //         .source-selector select {
  //           flex: 1;
  //         }

  //       </style>
  //     </ha-card>
  //   `;

  //     this.addEventListener("change", (ev) => {
  //       if (ev.target.id === "source-select") {
  //         this.selectedSourceEntity = ev.target.value;
  //         this.loadEvents();
  //       }
  //     });
  //   }
  // }

  render() {
    if (!this._hass || !this.config) {
      return html``;
    }

    return html`
      <ha-card>
        <div class="card-content">
          <h2>${this.config.title || "TV Planner Card"}</h2>

          <button id="refresh" @click=${this.loadEvents}>
            Reload events
          </button>

          <button id="browser-refresh" @click=${this.refreshDashboard}>
            Refresh dashboard
          </button>

          ${this.lastCopied
            ? html`<p class="success">Copied: ${this.lastCopied}</p>`
            : html``}

          ${this.renderSourceSelector()}

          ${this.loading
            ? html`<p>Loading events...</p>`
            : this.events.length === 0
              ? html`<p>No events found.</p>`
              : this.renderEventGroups()}
        </div>
      </ha-card>
    `;
  }

  renderEventGroups() {
    return Object.entries(this.groupEventsByDay()).map(
      ([day, events]) => html`
        <div class="day-separator">
          ${events[0] ? this.formatDay(events[0].start) : ""}
        </div>

        ${events.map((event) => this.renderEvent(event))}
      `
    );
  }

  renderEvent(event: TvPlannerEvent) {
    return html`
      <div class="event">
        <div class="event-main">
          <strong>${event.summary || "(No title)"}</strong>

          <div class="time">
            ${this.formatDate(event.start)}
            →
            ${this.formatDate(event.end)}
          </div>

          ${event.description
            ? html`<div class="description">${event.description}</div>`
            : html``}
        </div>

        <button class="copy" @click=${() => this.copyEvent(event)}>
          Copy
        </button>
      </div>
    `;
  }

  refreshDashboard() {
    const hass = this._hass;
    if (!hass) {
      alert("Home Assistant connection not found.");
      return;
    }

    hass.callService("browser_mod", "refresh");
  }

  renderSourceSelector() {
    const config = this.config;

    if (!config) {
      alert("Configuration not found.");
      return;
    }

    if (!config.sources?.length) {
      return html``;
    }

    return html`
      <div class="source-selector">
        <label for="source-select">Channel</label>

        <select
          id="source-select"
          .value=${this.selectedSourceEntity}
          @change=${this.sourceChanged}
        >
          ${config.sources.map(
            (source) => html`
              <option value=${source.entity}>
                ${source.label}
              </option>
            `
          )}
        </select>
      </div>
    `;
  }

  sourceChanged(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    this.selectedSourceEntity = target.value;
    this.loadEvents();
  }

  formatDate(value: string) {
    if (!value) return "";
    return new Date(value).toLocaleString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  groupEventsByDay(): Record<string, TvPlannerEvent[]> {
    return this.events.reduce<Record<string, TvPlannerEvent[]>>((groups, event) => {
      const key = new Date(event.start).toDateString();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(event);
      return groups;
    }, {});
  }

  formatDay(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  getCardSize() {
    return 4;
  }

  loadHaEpgEvents() {
    const hass = this._hass;
    if (!hass) {
      alert("Home Assistant connection not found.");
      return;
    }

    const entity = hass.states[this.selectedSourceEntity];

    if (!entity) {
      console.error(
        "Calendar Copy Card: HA-EPG entity not found",
        this.selectedSourceEntity,
      );
      this.events = [];
      return;
    }

    const attrs = entity.attributes;
    const channelName = attrs.channel_display_name || "";
    const channelIcon = attrs.channel_icon || "";

    const today = this.epgDayToEvents(attrs.today, 0, channelName, channelIcon);
    const tomorrow = this.epgDayToEvents(
      attrs.tomorrow,
      1,
      channelName,
      channelIcon,
    );

    this.events = [...today, ...tomorrow];
  }

  epgDayToEvents(dayData: any, dayOffset: number, channelName: string, channelIcon: string) {
    if (!dayData) return [];

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + dayOffset);

    return Object.values(dayData).map((program: any) => {
      const start = this.combineDateAndTime(baseDate, program.start);
      let end = this.combineDateAndTime(baseDate, program.end);

      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }

      const title = program.sub_title
        ? `${channelName} | ${program.title} • ${program.sub_title}`
        : `${channelName} | ${program.title}`;

      return {
        start: start.toISOString(),
        end: end.toISOString(),
        summary: title,
        description: program.desc || "",
        location: channelName,
        channel_icon: channelIcon,
        source: "ha_epg",
      };
    });
  }

  combineDateAndTime(date: Date, time: string) {
    const parts = time.split(":").map(Number);

    const hours = parts[0] ?? 0;
    const minutes = parts[1] ?? 0;

    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);

    return result;
  }
}

customElements.define("tv-planner-card", TvPlannerCard);
