import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { property } from "lit/decorators.js";

interface TvPlannerCardConfig {
  title?: string;
  source_type?: "calendar" | "ha_epg";
  source_calendar?: string;
  source_entity?: string;
  target_calendar: string;
  copy_script: string;
  days_to_show?: number;
  sources?: TvPlannerSource[];
  channel_icons_url?: string;
  channel_icons?: Record<string, string>;
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
  @property({ attribute: false })
  public config?: TvPlannerCardConfig;
  private _hass?: HassLike;

  @state() private events: TvPlannerEvent[] = [];
  @state() private loading: boolean = false;
  @state() private selectedSourceEntity: string = "";
  @state() private lastCopied: string = "";
  @state() private loaded: boolean = false;
  @state() private errorMessage: string = "";

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

    .event-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .channel-icon {
      width: 28px;
      height: 28px;
      object-fit: contain;
      flex: 0 0 auto;
    }

    .error {
      color: var(--error-color);
      font-size: 0.9em;
    }
  `;

  setConfig(config: TvPlannerCardConfig) {
    this.config = config;
    this.events = [];
    this.loading = false;
    this.selectedSourceEntity =
      config.source_entity || config.sources?.[0]?.entity || "";
    this.loadExternalChannelIcons();
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
    this.errorMessage = "";

    try {
      const config = this.config;

      if (!config) {
        this.events = [];
        return;
      }

      if (config.source_type === "ha_epg") {
        this.loadHaEpgEvents();
      } else {
        await this.loadCalendarEvents();
      }
    } catch (err) {
      console.error("TV Planner Card: failed to load events", err);
      this.events = [];
      this.errorMessage =
        err instanceof Error ? err.message : "Failed to load events";
    } finally {
      this.loading = false;
    }
  }
  async loadCalendarEvents() {
    const start = new Date();
    const end = new Date();
    const config = this.config;
    const hass = this._hass;

    if (!config || !hass || !config.source_calendar) {
      this.events = [];
      return;
    }

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

    console.log("TV Planner Card calendar response:", response);

    const data = response?.response || response;

    let rawEvents: any[] = [];

    if (Array.isArray(data)) {
      rawEvents = data;
    } else if (Array.isArray(data?.events)) {
      rawEvents = data.events;
    } else if (Array.isArray(data?.[config.source_calendar]?.events)) {
      rawEvents = data[config.source_calendar].events;
    }

    this.events = rawEvents.map((event) => this.normalizeCalendarEvent(event));
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

    const ok = confirm(`Copy "${event.summary}" to ${config.target_calendar}?`);

    if (!ok) return;

    await hass.callService("script", config.copy_script, {
      source_type: config.source_type || "calendar",
      source_calendar: config.source_calendar || "",
      source_entity: this.selectedSourceEntity || config.source_entity || "",
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
  }

  render() {
    if (!this._hass || !this.config) {
      return html``;
    }

    return html`
      <ha-card>
        <div class="card-content">
          <h2>${this.config.title || "TV Planner Card"}</h2>

          <button id="refresh" @click=${() => this.loadEvents()}>
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
            : this.errorMessage
              ? html`<p class="error">Error: ${this.errorMessage}</p>`
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
      `,
    );
  }

  renderEvent(event: TvPlannerEvent) {
    const icon = this.getEventIcon(event);

    return html`
      <div class="event">
        <div class="event-main">
          <div class="event-title-row">
            ${icon
              ? html`<img class="channel-icon" src="${icon}" alt="" />`
              : html``}

            <strong>${event.summary || "(No title)"}</strong>
          </div>

          <div class="time">
            ${this.formatDate(event.start)} → ${this.formatDate(event.end)}
          </div>

          ${event.description
            ? html`<div class="description">${event.description}</div>`
            : html``}
        </div>

        <button class="copy" @click=${() => this.copyEvent(event)}>Copy</button>
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
          @change=${(ev: Event) => this.sourceChanged(ev)}
        >
          ${config.sources.map(
            (source) => html`
              <option value=${source.entity}>${source.label}</option>
            `,
          )}
        </select>
      </div>
    `;
  }

  normalizeCalendarEvent(event: any): TvPlannerEvent {
    const start =
      event.start?.dateTime || event.start?.date || event.start || "";

    const end = event.end?.dateTime || event.end?.date || event.end || "";

    return {
      start,
      end,
      summary: String(event.summary || event.title || ""),
      description: String(event.description || ""),
      location: String(event.location || ""),
      channel_icon: event.channel_icon ? String(event.channel_icon) : "",
      source: "calendar",
    };
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
    return this.events.reduce<Record<string, TvPlannerEvent[]>>(
      (groups, event) => {
        const key = new Date(event.start).toDateString();

        if (!groups[key]) {
          groups[key] = [];
        }

        groups[key].push(event);
        return groups;
      },
      {},
    );
  }

  getEventChannel(event: TvPlannerEvent): string {
    const location = String(event.location || "").trim();

    if (location) {
      return location;
    }

    const summary = String(event.summary || "");

    if (summary.includes("|")) {
      return summary.split("|")[0].trim();
    }

    return "";
  }

  getEventIcon(event: TvPlannerEvent): string {
    try {
      if (event.channel_icon) {
        return String(event.channel_icon);
      }

      const channel = this.getEventChannel(event);
      if (!channel) return "";

      const icons = this.getCombinedChannelIcons();

      for (const alias of this.getChannelAliases(channel)) {
        if (icons[alias]) {
          return icons[alias];
        }
      }

      return "";
    } catch (err) {
      console.warn("TV Planner Card: icon lookup failed", err, event);
      return "";
    }
  }

  getCombinedChannelIcons(): Record<string, string> {
    const icons: Record<string, string> = {};

    const addIcons = (source?: Record<string, unknown>) => {
      if (!source || typeof source !== "object") return;

      Object.entries(source).forEach(([name, icon]) => {
        if (!name || typeof icon !== "string") return;

        for (const alias of this.getChannelAliases(name)) {
          icons[alias] = icon;
        }
      });
    };

    addIcons(this.externalChannelIcons);
    addIcons(this.config?.channel_icons);
    addIcons(this.getChannelIconMap());

    return icons;
  }

  getChannelAliases(channel: string): string[] {
    const original = String(channel || "").trim();
    const normalized = this.normalizeChannelName(original);
    const compact = normalized.replace(/\s+/g, "");
    const spacedNumber = normalized.replace(/^([A-Z]+)([0-9]+)$/u, "$1 $2");

    return [...new Set([original, normalized, compact, spacedNumber])].filter(
      Boolean,
    );
  }

  normalizeChannelName(channel: string): string {
    return String(channel || "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }
  @state()
  private externalChannelIcons: Record<string, string> = {};

  async loadExternalChannelIcons() {
    const url = this.config?.channel_icons_url;
    if (!url) {
      this.externalChannelIcons = {};
      return;
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} while loading ${url}`);
      }

      const icons = await response.json();

      if (!icons || typeof icons !== "object" || Array.isArray(icons)) {
        throw new Error("Channel icons JSON is not an object");
      }

      const expanded: Record<string, string> = {};

      Object.entries(icons).forEach(([name, icon]) => {
        if (typeof icon !== "string") return;

        for (const alias of this.getChannelAliases(name)) {
          expanded[alias] = icon;
        }
      });

      this.externalChannelIcons = expanded;
    } catch (err) {
      console.error("TV Planner Card: failed to load channel icons", err);
      this.externalChannelIcons = {};
    }
  }

  getChannelIconMap(): Record<string, string> {
    const hass = this._hass;
    const sources = this.config?.sources || [];

    if (!hass) return {};

    return sources.reduce<Record<string, string>>((icons, source) => {
      const entity = hass.states[source.entity];
      if (!entity) return icons;

      const channelName =
        entity.attributes.channel_display_name || source.label;
      const channelIcon = entity.attributes.channel_icon;

      if (channelIcon) {
        icons[channelName] = channelIcon;
        icons[source.label] = channelIcon;
      }

      return icons;
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

  epgDayToEvents(
    dayData: any,
    dayOffset: number,
    channelName: string,
    channelIcon: string,
  ) {
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
