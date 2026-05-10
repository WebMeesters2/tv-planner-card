export type TranslationKey =
  | "title_default"
  | "reload_events"
  | "loading_events"
  | "refresh_dashboard"
  | "no_events_found"
  | "copy"
  | "copied"
  | "channel"
  | "unknown_event"
  | "show_description"
  | "hide_description"
  | "error"
  | "confirm_copy"
  | "ha_connection_not_found"
  | "config_not_found";

const translations = {
  en: {
    title_default: "TV Planner Card",
    reload_events: "Reload events",
    loading_events: "Loading events...",
    refresh_dashboard: "Refresh dashboard",
    no_events_found: "No events found.",
    copy: "Copy",
    copied: "Copied",
    channel: "Channel",
    unknown_event: "Unknown Event",
    show_description: "Show description",
    hide_description: "Hide description",
    error: "Error",
    confirm_copy: 'Copy "{summary}" to {target_calendar}?',
    ha_connection_not_found: "Home Assistant connection not found.",
    config_not_found: "Configuration not found.",
  },
  nl: {
    title_default: "TV Planner Card",
    reload_events: "Gebeurtenissen herladen",
    loading_events: "Gebeurtenissen laden...",
    refresh_dashboard: "Dashboard verversen",
    no_events_found: "Geen gebeurtenissen gevonden.",
    copy: "Kopiëren",
    copied: "Gekopieerd",
    channel: "Kanaal",
    unknown_event: "Onbekend programma",
    show_description: "Beschrijving tonen",
    hide_description: "Beschrijving verbergen",
    error: "Fout",
    confirm_copy: '"{summary}" kopiëren naar {target_calendar}?',
    ha_connection_not_found: "Home Assistant-verbinding niet gevonden.",
    config_not_found: "Configuratie niet gevonden.",
  },
} as const;

export type Language = keyof typeof translations;

export function localize(
  language: string | undefined,
  key: TranslationKey,
  replacements: Record<string, string> = {},
): string {
  const selectedLanguage: Language =
    language && language in translations ? (language as Language) : "en";

  let text: string = translations[selectedLanguage][key] || translations.en[key];

  Object.entries(replacements).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, value);
  });

  return text;
}