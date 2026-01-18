Locales = {
  de = {
    -- UI
    app_title = "Dispatch",
    app_subtitle = "Sende eine Meldung an die Leitstelle",
    section_department = "Abteilung",
    section_priority = "Priorität",
    section_text = "Text",
    section_privacy = "Privatsphäre",
    placeholder_text = "Kurz beschreiben: Was ist passiert? Ort wird automatisch übermittelt.",
    hint_text = "Mindestlänge: 3 Zeichen. Übermittlung enthält automatisch Standort (Straßenname/Koordinaten).",
    btn_send = "Dispatch senden",
    btn_sending = "Sende…",

    checkbox_anonymous = "Anonym senden (Melder wird als „Unbekannt“ übermittelt)",

    -- Server / Fehler
    err_unknown_department = "Unbekannte Abteilung.",
    err_text_too_short = "Text ist zu kurz.",
    err_failed = "Fehler beim Senden.",

    -- Phone Notifications (17mov)
    notify_sent_title = "Dispatch gesendet",
    notify_sent_message = "Abteilung: {dept}",
    notify_failed_title = "Dispatch fehlgeschlagen",
    notify_failed_message = "{reason}",

    dispatch_title = "Dispatch: {dept}",
    dispatch_field_department = "Abteilung",
    dispatch_field_priority = "Priorität",
    dispatch_field_sender = "Melder",
    dispatch_sender_unknown = "Unbekannt",

    priority_low = "Niedrig",
    priority_medium = "Mittel",
    priority_high = "Hoch",

    location_unknown = "Unbekannt",

    cooldown_active = "Bitte warten: Du kannst an {dept} erst in {mins} Minute(n) wieder senden.",

    splash_connecting = "Verbinde…",
    splash_initializing = "Initialisiere…"
  },

  en = {
    -- UI
    app_title = "Dispatch",
    app_subtitle = "Send a report to dispatch",
    section_department = "Department",
    section_priority = "Priority",
    section_text = "Text",
    section_privacy = "Privacy",
    placeholder_text = "Briefly describe what happened. Location will be sent automatically.",
    hint_text = "Minimum length: 3 characters. Transmission automatically includes location (street name/coordinates).",
    btn_send = "Send dispatch",
    btn_sending = "Sending…",

    checkbox_anonymous = "Send anonymously (sender will be transmitted as “Unknown”)",

    -- Server / Errors
    err_unknown_department = "Unknown department.",
    err_text_too_short = "Text is too short.",
    err_failed = "Failed to send.",

    -- Phone Notifications (17mov)
    notify_sent_title = "Dispatch sent",
    notify_sent_message = "Department: {dept}",
    notify_failed_title = "Dispatch failed",
    notify_failed_message = "{reason}",

    dispatch_title = "Dispatch: {dept}",
    dispatch_field_department = "Department",
    dispatch_field_priority = "Priority",
    dispatch_field_sender = "Sender",
    dispatch_sender_unknown = "Unknown",

    priority_low = "Low",
    priority_medium = "Medium",
    priority_high = "High",

    location_unknown = "Unknown",

    cooldown_active = "Please wait: You can send to {dept} again in {mins} minute(s).",

    splash_connecting = "Connecting…",
    splash_initializing = "Initializing…"
  }
}

local function safe_tostring(v)
  if v == nil then return "" end
  return tostring(v)
end

-- Replace placeholders {key}
function LocaleFormat(str, vars)
  str = safe_tostring(str)
  if type(vars) ~= "table" then return str end
  for k, v in pairs(vars) do
    str = str:gsub("{" .. k .. "}", safe_tostring(v))
  end
  return str
end

function GetLocale(lang)
  return Locales[lang] or Locales.de
end