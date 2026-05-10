import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { localize } from "./localize.js";
import type { TranslationKey } from "./localize.js";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type SourceType = "calendar" | "ha_epg";
type EventSource = "calendar" | "ha_epg";

interface TvPlannerCardConfig {
  title?: string;
  source_type?: SourceType;
  source_calendar?: string;
  source_entity?: string;
  target_calendar: string;
  copy_script: string;
  days_to_show?: number;
  sources?: TvPlannerSource[];
  channel_icons_url?: string;
  channel_icons?: Record<string, string>;
  refresh_after_copy?: boolean;
  browser_refresh_after_copy?: boolean;
  show_description?: boolean;
  description_mode?: "hidden" | "visible" | "toggle-on" | "toggle-off";
  language?: "en" | "nl";
  debug?: boolean;
}

interface TvPlannerSource {
  label: string;
  entity: string;
}

interface TvPlannerEvent {
  start: string;
  end: string;
  summary: string;
  description: string;
  location: string;
  channel_icon: string;
  source: EventSource;
}

interface HassEntity {
  state?: string;
  attributes: Record<string, unknown>;
}

type HassLike = {
  states: Record<string, HassEntity | undefined>;
  callService: (...args: unknown[]) => Promise<unknown>;
};

interface CalendarEventLike {
  start?: CalendarDateLike | string;
  end?: CalendarDateLike | string;
  summary?: unknown;
  title?: unknown;
  description?: unknown;
  location?: unknown;
  channel_icon?: unknown;
}

interface CalendarDateLike {
  date?: unknown;
  dateTime?: unknown;
}

interface HaEpgProgramLike {
  title?: unknown;
  desc?: unknown;
  sub_title?: unknown;
  start?: unknown;
  end?: unknown;
}

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

class TvPlannerCard extends LitElement {
  @property({ attribute: false })

  public config?: TvPlannerCardConfig;
  private _hass?: HassLike;
  private dashboardRefreshTimeout?: number | undefined;

  @state() private events: TvPlannerEvent[] = [];
  @state() private loading = false;
  @state() private selectedSourceEntity = "";
  @state() private lastCopied = "";
  @state() private loaded = false;
  @state() private errorMessage = "";
  @state() private externalChannelIcons: Record<string, string> = {};
  @state() private expandedEvents: Record<string, boolean> = {};

  /* ------------------------------------------------------------------------ */
  /* Styles                                                                   */
  /* ------------------------------------------------------------------------ */

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

    button[disabled] {
      opacity: 0.6;
      cursor: wait;
    }

    .success,
    .error {
      font-size: 0.9em;
    }

    .success {
      color: var(--accent-color);
    }

    .error {
      color: var(--error-color);
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

    .event-main {
      min-width: 0;
      flex: 1 1 auto;
    }

    .event-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .event-title {
      overflow-wrap: anywhere;
    }

    .channel-icon {
      width: 28px;
      height: 28px;
      object-fit: contain;
      flex: 0 0 auto;
    }

    .description-toggle {
      margin-top: 4px;
      cursor: pointer;
      color: var(--accent-color);
      font-size: 0.9em;
      user-select: none;
    }
  `;

  /* ------------------------------------------------------------------------ */
  /* Home Assistant / card lifecycle                                          */
  /* ------------------------------------------------------------------------ */

  setConfig(config: TvPlannerCardConfig) {
    this.config = config;
    this.events = [];
    this.loading = false;
    this.errorMessage = "";
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

  getCardSize() {
    return 4;
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  render() {
    if (!this._hass || !this.config) {
      return html``;
    }

    return html`
      <ha-card>
        <div class="card-content">
          <h2>${this.config.title || this.t("title_default")}</h2>

          <button
            id="refresh"
            ?disabled=${this.loading}
            @click=${() => this.loadEvents()}
          >
            ${this.loading ? this.t("loading_events") : this.t("reload_events")}
          </button>

          <button id="browser-refresh" @click=${() => this.refreshDashboard()}>
            ${this.t("refresh_dashboard")}
          </button>

          ${this.lastCopied
            ? html`<p class="success">${this.t("copied")}: ${this.lastCopied}</p>`
            : html``}
          ${this.renderSourceSelector()} ${this.renderBody()}
        </div>
      </ha-card>
    `;
  }

  private renderBody() {
    if (this.loading) {
      return html`<p>${this.t("loading_events")}</p>`;
    }

    if (this.errorMessage) {
      return html`<p class="error">${this.t("error")}: ${this.errorMessage}</p>`;
    }

    if (this.events.length === 0) {
      return html`<p>${this.t("no_events_found")}</p>`;
    }

    return this.renderEventGroups();
  }

  private renderSourceSelector() {
    const sources = this.config?.sources;

    if (!sources?.length) {
      return html``;
    }

    return html`
      <div class="source-selector">
        <label for="source-select">${this.t("channel")}</label>

        <select
          id="source-select"
          .value=${this.selectedSourceEntity}
          @change=${(ev: Event) => this.sourceChanged(ev)}
        >
          ${sources.map(
            (source) => html`
              <option value=${source.entity}>${source.label}</option>
            `,
          )}
        </select>
      </div>
    `;
  }

  private renderEventGroups() {
    return Object.values(this.groupEventsByDay()).map(
      (events) => html`
        <div class="day-separator">
          ${events[0] ? this.formatDay(events[0].start) : ""}
        </div>

        ${events.map((event) => this.renderEvent(event))}
      `,
    );
  }

  private renderEvent(event: TvPlannerEvent) {
    const icon = this.getEventIcon(event);
    // DEBUG code to log event data for troubleshooting
    // REMOVE LATER!
    this.debugLog("render event:", event);
    return html`
      <div class="event">
        <div class="event-main">
          <div class="event-title-row">
            ${icon
              ? html`<img class="channel-icon" src=${icon} alt="" />`
              : html``}

            <strong class="event-title"
              >${event.summary || this.t("unknown_event")}</strong
            >
          </div>

          <div class="time">
            ${this.formatDate(event.start)} → ${this.formatDate(event.end)}
          </div>

          ${this.renderDescription(event)}
        </div>

        <button class="copy" @click=${() => this.copyEvent(event)}>${this.t("copy")}:</button>
      </div>
    `;
  }

  private renderDescription(event: TvPlannerEvent) {
    const mode = this.config?.description_mode || "visible";

    if (!event.description || mode === "hidden") {
      return html``;
    }

    if (mode === "visible") {
      return html`<div class="description">${event.description}</div>`;
    }

    const key = this.getEventKey(event);
    const defaultExpanded = mode === "toggle-on";
    const expanded = this.expandedEvents[key] ?? defaultExpanded;

    return html`
      <div
        class="description-toggle"
        @click=${() => this.toggleEventDescription(event)}
      >
        ${expanded ? this.t("hide_description") : this.t("show_description")}
      </div>

      ${expanded
        ? html`<div class="description">${event.description}</div>`
        : html``}
    `;
  }

  /* ------------------------------------------------------------------------ */
  /* User actions                                                             */
  /* ------------------------------------------------------------------------ */

  private sourceChanged(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    this.selectedSourceEntity = target.value;
    this.loadEvents();
  }

  private refreshDashboard() {
    const hass = this._hass;

    if (!hass) {
      alert(this.t("ha_connection_not_found"));
      return;
    }

    if (this.dashboardRefreshTimeout) {
      window.clearTimeout(this.dashboardRefreshTimeout);
    }

    this.dashboardRefreshTimeout = window.setTimeout(() => {
      hass.callService("browser_mod", "refresh");
      this.dashboardRefreshTimeout = undefined;
    }, 300);
  }

  private async copyEvent(event: TvPlannerEvent) {
    const config = this.config;
    const hass = this._hass;

    if (!config) {
      alert(this.t("config_not_found"));
      return;
    }

    if (!hass) {
      alert(this.t("ha_connection_not_found"));
      return;
    }

    const ok = confirm(this.t("confirm_copy", { event: event.summary, calendar: config.target_calendar }));
    if (!ok) return;

    await hass.callService("script", config.copy_script, {
      source_type: config.source_type || "calendar",
      source_calendar: config.source_calendar || "",
      source_entity: this.selectedSourceEntity || config.source_entity || "",
      target_calendar: config.target_calendar,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start_date_time: event.start,
      end_date_time: event.end,
    });

    this.lastCopied = event.summary || "Event";

    if (config.refresh_after_copy) {
      await this.loadEvents();
    }

    if (config.browser_refresh_after_copy) {
      await hass.callService("browser_mod", "refresh");
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Event loading                                                            */
  /* ------------------------------------------------------------------------ */

  private async loadEvents() {
    if (this.loading) {
      return;
    }

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

  private async loadCalendarEvents() {
    const config = this.config;
    const hass = this._hass;

    if (!config || !hass || !config.source_calendar) {
      this.events = [];
      return;
    }

    const start = new Date();
    const end = new Date();
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

    this.debugLog("calendar response:", response);

    const rawEvents = this.extractCalendarEvents(
      response,
      config.source_calendar,
    );
    this.events = rawEvents.map((event) => this.normalizeCalendarEvent(event));
  }

  private loadHaEpgEvents() {
    const hass = this._hass;

    if (!hass) {
      alert("Home Assistant connection not found.");
      return;
    }

    const entity = hass.states[this.selectedSourceEntity];

    if (!entity) {
      console.error(
        "TV Planner Card: HA-EPG entity not found",
        this.selectedSourceEntity,
      );
      this.events = [];
      return;
    }

    const attrs = entity.attributes;
    const channelName = this.asString(attrs.channel_display_name);
    const channelIcon = this.asString(attrs.channel_icon);

    const today = this.epgDayToEvents(attrs.today, 0, channelName, channelIcon);
    const tomorrow = this.epgDayToEvents(
      attrs.tomorrow,
      1,
      channelName,
      channelIcon,
    );

    this.events = [...today, ...tomorrow];
  }

  /* ------------------------------------------------------------------------ */
  /* Calendar parsing                                                         */
  /* ------------------------------------------------------------------------ */

  private extractCalendarEvents(
    response: unknown,
    sourceCalendar: string,
  ): CalendarEventLike[] {
    const data = this.getResponsePayload(response);

    if (Array.isArray(data)) {
      return data as CalendarEventLike[];
    }

    if (!this.isRecord(data)) {
      return [];
    }

    if (Array.isArray(data.events)) {
      return data.events as CalendarEventLike[];
    }

    const calendarData = data[sourceCalendar];

    if (this.isRecord(calendarData) && Array.isArray(calendarData.events)) {
      return calendarData.events as CalendarEventLike[];
    }

    return [];
  }

  private normalizeCalendarEvent(event: CalendarEventLike): TvPlannerEvent {
    return {
      start: this.extractCalendarDate(event.start),
      end: this.extractCalendarDate(event.end),
      summary: this.asString(event.summary || event.title),
      description: this.asString(event.description),
      location: this.asString(event.location),
      channel_icon: this.asString(event.channel_icon),
      source: "calendar",
    };
  }

  private extractCalendarDate(value: CalendarDateLike | string | undefined) {
    if (typeof value === "string") {
      return value;
    }

    if (this.isRecord(value)) {
      return this.asString(value.dateTime || value.date);
    }

    return "";
  }

  /* ------------------------------------------------------------------------ */
  /* HA-EPG parsing                                                           */
  /* ------------------------------------------------------------------------ */

  private epgDayToEvents(
    dayData: unknown,
    dayOffset: number,
    channelName: string,
    channelIcon: string,
  ): TvPlannerEvent[] {
    if (!this.isRecord(dayData)) {
      return [];
    }

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + dayOffset);

    return Object.values(dayData)
      .filter((program): program is HaEpgProgramLike => this.isRecord(program))
      .map((program) =>
        this.epgProgramToEvent(program, baseDate, channelName, channelIcon),
      );
  }

  private epgProgramToEvent(
    program: HaEpgProgramLike,
    baseDate: Date,
    channelName: string,
    channelIcon: string,
  ): TvPlannerEvent {
    const start = this.combineDateAndTime(
      baseDate,
      this.asString(program.start),
    );
    const end = this.getProgramEndDate(
      baseDate,
      start,
      this.asString(program.end),
    );

    const title = this.asString(program.title);
    const subTitle = this.asString(program.sub_title);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
      summary: subTitle
        ? `${channelName} | ${title} • ${subTitle}`
        : `${channelName} | ${title}`,
      description: this.asString(program.desc),
      location: channelName,
      channel_icon: channelIcon,
      source: "ha_epg",
    };
  }

  private getProgramEndDate(baseDate: Date, start: Date, endTime: string) {
    const end = this.combineDateAndTime(baseDate, endTime);

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    return end;
  }

  /* ------------------------------------------------------------------------ */
  /* Channel icons                                                            */
  /* ------------------------------------------------------------------------ */

  private async loadExternalChannelIcons() {
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

      if (!this.isRecord(icons)) {
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

  private getEventIcon(event: TvPlannerEvent): string {
    try {
      if (event.channel_icon) {
        return event.channel_icon;
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

  private getEventChannel(event: TvPlannerEvent): string {
    if (event.location) {
      return event.location.trim();
    }

    if (event.summary.includes("|")) {
      return event.summary?.split("|")[0]?.trim() ?? this.t("unknown_event");
    }

    return "";
  }

  private getCombinedChannelIcons(): Record<string, string> {
    const icons: Record<string, string> = {};

    this.addChannelIcons(icons, this.externalChannelIcons);
    this.addChannelIcons(icons, this.config?.channel_icons);
    this.addChannelIcons(icons, this.getChannelIconMap());

    return icons;
  }

  private getChannelIconMap(): Record<string, string> {
    const hass = this._hass;
    const sources = this.config?.sources || [];
    const icons: Record<string, string> = {};

    if (!hass) {
      return icons;
    }

    for (const source of sources) {
      const entity = hass.states[source.entity];
      if (!entity) continue;

      const channelName =
        this.asString(entity.attributes.channel_display_name) || source.label;
      const channelIcon = this.asString(entity.attributes.channel_icon);

      if (channelIcon) {
        icons[channelName] = channelIcon;
        icons[source.label] = channelIcon;
      }
    }

    return icons;
  }

  private addChannelIcons(
    target: Record<string, string>,
    source?: Record<string, string>,
  ) {
    if (!source) return;

    Object.entries(source).forEach(([name, icon]) => {
      if (!icon) return;

      for (const alias of this.getChannelAliases(name)) {
        target[alias] = icon;
      }
    });
  }

  private getChannelAliases(channel: string): string[] {
    const original = channel.trim();
    const normalized = this.normalizeChannelName(original);
    const compact = normalized.replace(/\s+/g, "");
    const spacedNumber = normalized.replace(/^([A-Z]+)([0-9]+)$/u, "$1 $2");

    return [...new Set([original, normalized, compact, spacedNumber])].filter(
      Boolean,
    );
  }

  private normalizeChannelName(channel: string): string {
    return channel.replace(/\s+/g, " ").trim().toUpperCase();
  }

  /* ------------------------------------------------------------------------ */
  /* Date / grouping helpers                                                  */
  /* ------------------------------------------------------------------------ */

  private groupEventsByDay(): Record<string, TvPlannerEvent[]> {
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

  private formatDate(value: string) {
    if (!value) return "";

    return new Date(value).toLocaleString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  private formatDay(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  private combineDateAndTime(date: Date, time: string) {
    const [hours = 0, minutes = 0] = time.split(":").map(Number);

    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);

    return result;
  }

  /* ------------------------------------------------------------------------ */
  /* Generic parsing helpers                                                  */
  /* ------------------------------------------------------------------------ */

  private getEventKey(event: TvPlannerEvent): string {
    return [event.start, event.end, event.summary].join("|");
  }

  private toggleEventDescription(event: TvPlannerEvent) {
    const key = this.getEventKey(event);
    const mode = this.config?.description_mode || "visible";
    const defaultExpanded = mode === "toggle-on";

    this.expandedEvents = {
      ...this.expandedEvents,
      [key]: !(this.expandedEvents[key] ?? defaultExpanded),
    };
  }

  private getResponsePayload(response: unknown): unknown {
    if (this.isRecord(response) && "response" in response) {
      return response.response;
    }

    return response;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  private asString(value: unknown): string {
    return typeof value === "string" ? value : "";
  }

  private isDebugEnabled(): boolean {
    return this.config?.debug === true;
  }

  private debugLog(message: string, ...args: unknown[]) {
    if (!this.isDebugEnabled()) {
      return;
    }

    console.debug(`TV Planner Card: ${message}`, ...args);
  }

  /* ------------------------------------------------------------------------ */
  /* Translation helper                                                       */
  /* ------------------------------------------------------------------------ */
  private t(
    key: TranslationKey,
    replacements: Record<string, string> = {},
  ): string {
    return localize(this.config?.language, key, replacements);
  }
}

customElements.define("tv-planner-card", TvPlannerCard);
