//#region src/tv-planner-card.ts
var e = class extends HTMLElement {
	setConfig(e) {
		this.config = e, this.events = [], this.loading = !1, this.selectedSourceEntity = e.source_entity || e.sources?.[0]?.entity || "";
	}
	set hass(e) {
		this._hass = e, this.loaded || (this.loaded = !0, this.loadEvents());
	}
	async loadEvents() {
		this.loading = !0, this.render();
		try {
			this.config.source_type === "ha_epg" ? this.loadHaEpgEvents() : await this.loadCalendarEvents();
		} catch (e) {
			console.error("Calendar Copy Card: failed to load events", e), this.events = [];
		}
		this.loading = !1, this.render();
	}
	async loadCalendarEvents() {
		let e = /* @__PURE__ */ new Date(), t = /* @__PURE__ */ new Date();
		t.setDate(t.getDate() + (this.config.days_to_show || 14));
		let n = await this._hass.callService("calendar", "get_events", {
			start_date_time: e.toISOString(),
			end_date_time: t.toISOString()
		}, { entity_id: this.config.source_calendar }, !1, !0);
		console.log("Calendar Copy Card response:", n);
		let r = n?.response || n;
		Array.isArray(r) ? this.events = r : r?.events ? this.events = r.events : r?.[this.config.source_calendar]?.events ? this.events = r[this.config.source_calendar].events : this.events = [];
	}
	async copyEvent(e) {
		if (!e) {
			alert("Could not find this event.");
			return;
		}
		console.log("Calendar Copy Card selected event:", e), confirm(`Copy "${e.summary}" to ${this.config.target_calendar}?`) && (await this._hass.callService("script", this.config.copy_script, {
			source_type: this.config.source_type || "calendar",
			source_calendar: this.config.source_calendar || "",
			source_entity: this.selectedSourceEntity || this.config.source_entity || "",
			target_calendar: this.config.target_calendar,
			summary: e.summary || "",
			description: e.description || "",
			location: e.location || "",
			start_date_time: e.start,
			end_date_time: e.end
		}), this.lastCopied = e.summary || "Event", this.render());
	}
	render() {
		!this._hass || !this.config || (this.innerHTML = `
      <ha-card>
        <div class="card-content">
          <h2>${this.config.title || "Copy calendar events"}</h2>

          <button id="refresh">Reload events</button>
          <button id="browser-refresh">Refresh dashboard</button>

          ${this.lastCopied ? `<p class="success">Copied: ${this.lastCopied}</p>` : ""}
            
          ${this.renderSourceSelector()}

          ${this.loading ? "<p>Loading events...</p>" : this.events.length === 0 ? "<p>No events found.</p>" : Object.entries(this.groupEventsByDay()).map(([e, t]) => `
                        <div class="day-separator">
                          ${this.formatDay(t[0].start)}
                        </div>

                        ${t.map((e) => {
			let t = this.events.indexOf(e);
			return `
                              <div class="event">
                                <div class="event-main">
                                  <strong>${e.summary || "(No title)"}</strong>
                                  <div class="time">
                                    ${this.formatDate(e.start)}
                                    →
                                    ${this.formatDate(e.end)}
                                  </div>
                                  ${e.description ? `<div class="description">${e.description}</div>` : ""}
                                </div>
                                <button class="copy" data-index="${t}">
                                  <!-- Copy -->
                                  Copy
                                  </button>
                              </div>
                            `;
		}).join("")}
                      `).join("")}
        </div>

        <style>
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

        </style>
      </ha-card>
    `, this.listenersAttached || (this.listenersAttached = !0, this.addEventListener("click", (e) => {
			let t = e.target.closest("button");
			if (t) {
				if (t.id === "refresh") {
					this.loadEvents();
					return;
				}
				if (t.id === "browser-refresh") {
					this._hass.callService("browser_mod", "refresh");
					return;
				}
				if (t.classList.contains("copy")) {
					let e = Number(t.dataset.index), n = this.events[e];
					this.copyEvent(n);
				}
			}
		}), this.addEventListener("change", (e) => {
			e.target.id === "source-select" && (this.selectedSourceEntity = e.target.value, this.loadEvents());
		})));
	}
	renderSourceSelector() {
		return this.config.sources?.length ? `
      <div class="source-selector">
        <label for="source-select">Channel</label>
        <select id="source-select">
          ${this.config.sources.map((e) => `
                <option
                  value="${e.entity}"
                  ${e.entity === this.selectedSourceEntity ? "selected" : ""}
                >
                  ${e.label}
                </option>
              `).join("")}
        </select>
      </div>
    ` : "";
	}
	formatDate(e) {
		return e ? new Date(e).toLocaleString(void 0, {
			weekday: "short",
			day: "2-digit",
			month: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		}) : "";
	}
	groupEventsByDay() {
		return this.events.reduce((e, t) => {
			let n = new Date(t.start).toDateString();
			return e[n] || (e[n] = []), e[n].push(t), e;
		}, {});
	}
	formatDay(e) {
		return new Date(e).toLocaleDateString(void 0, {
			weekday: "long",
			day: "numeric",
			month: "long"
		});
	}
	getCardSize() {
		return 4;
	}
	loadHaEpgEvents() {
		let e = this._hass.states[this.selectedSourceEntity];
		if (!e) {
			console.error("Calendar Copy Card: HA-EPG entity not found", this.selectedSourceEntity), this.events = [];
			return;
		}
		let t = e.attributes, n = t.channel_display_name || "", r = t.channel_icon || "", i = this.epgDayToEvents(t.today, 0, n, r), a = this.epgDayToEvents(t.tomorrow, 1, n, r);
		this.events = [...i, ...a];
	}
	epgDayToEvents(e, t, n, r) {
		if (!e) return [];
		let i = /* @__PURE__ */ new Date();
		return i.setDate(i.getDate() + t), Object.values(e).map((e) => {
			let t = this.combineDateAndTime(i, e.start), a = this.combineDateAndTime(i, e.end);
			a <= t && a.setDate(a.getDate() + 1);
			let o = e.sub_title ? `${n} | ${e.title} • ${e.sub_title}` : `${n} | ${e.title}`;
			return {
				start: t.toISOString(),
				end: a.toISOString(),
				summary: o,
				description: e.desc || "",
				location: n,
				channel_icon: r,
				source: "ha_epg"
			};
		});
	}
	combineDateAndTime(e, t) {
		let [n, r] = t.split(":").map(Number), i = new Date(e);
		return i.setHours(n, r, 0, 0), i;
	}
};
customElements.define("tv-planner-card", e);
//#endregion
