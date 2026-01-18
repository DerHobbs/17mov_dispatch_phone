import { useEffect, useMemo, useState } from "react";
import { useNuiCallback } from "@/hooks/useNui";
import "./app.css";

type Priority = "low" | "medium" | "high";
type Dept = { id: string; label: string };

type NuiResponse = { success: boolean; message?: string; dispatchId?: number };
type ConfigResponse = { departments: Dept[]; defaultPriority: Priority };
type LangResponse = { language: string; strings?: Record<string, string> };

export default function App() {
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [department, setDepartment] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [message, setMessage] = useState<string>("");
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);

  // Splash (Anti-Zuck)
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [hasConfig, setHasConfig] = useState<boolean>(false);

  // Defaults/Fallbacks (werden durch locales/local.lua überschrieben)
  const [strings, setStrings] = useState<Record<string, string>>({
    app_title: "Dispatch",
    app_subtitle: "Sende eine Meldung an die Leitstelle",
    section_department: "Abteilung",
    section_priority: "Priorität",
    section_text: "Text",
    section_privacy: "Privatsphäre",
    placeholder_text: "Kurz beschreiben: Was ist passiert? Ort wird automatisch übermittelt.",
    hint_text:
      "Mindestlänge: 3 Zeichen. Übermittlung enthält automatisch Standort (Straßenname/Koordinaten).",
    btn_send: "Dispatch senden",
    btn_sending: "Sende…",

    checkbox_anonymous: "Anonym senden (Melder wird als „Unbekannt“ übermittelt)",

    priority_low: "Niedrig",
    priority_medium: "Mittel",
    priority_high: "Hoch",
  });

  const t = (key: string) => strings[key] ?? key;

  const priorityLabel = (p: Priority) => {
    if (p === "low") return t("priority_low");
    if (p === "medium") return t("priority_medium");
    return t("priority_high");
  };

  // WICHTIG: konfliktfrei
  const [getLang] = useNuiCallback<void, LangResponse>("Dispatch:GetLanguage");
  const [getConfig] = useNuiCallback<void, ConfigResponse>("Dispatch:GetConfig");
  const [sendDispatch] = useNuiCallback<
    { department: string; priority: string; message: string; anonymous?: boolean },
    NuiResponse
  >("Core:SendDispatch");

  const beep = (type: "tap" | "ok" | "err") => {
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as any;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();

      const now = ctx.currentTime;
      const freq = type === "tap" ? 420 : type === "ok" ? 660 : 220;

      o.type = "sine";
      o.frequency.setValueAtTime(freq, now);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (type === "tap" ? 0.07 : 0.12));

      o.connect(g);
      g.connect(ctx.destination);

      o.start(now);
      o.stop(now + (type === "tap" ? 0.08 : 0.14));
      setTimeout(() => ctx.close(), 200);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let alive = true;

    const minSplashMs = 2200;
    const startedAt = Date.now();

    const loadLang = async () => {
      try {
        const langRes = await getLang();
        if (!alive) return;
        if (langRes?.strings) setStrings((prev) => ({ ...prev, ...langRes.strings }));
      } catch {
        // ignore
      }
    };

    const loadConfig = async () => {
      try {
        const cfg = await getConfig();
        if (!alive) return;

        if (cfg?.departments?.length) {
          setDepartments(cfg.departments);
          setDepartment(cfg.departments[0].id);
          setHasConfig(true);
        }
        if (cfg?.defaultPriority) setPriority(cfg.defaultPriority);
      } catch {
        // ignore
      }
    };

    const finishSplash = () => {
      const elapsed = Date.now() - startedAt;
      const waitMore = Math.max(0, minSplashMs - elapsed);
      window.setTimeout(() => {
        if (alive) setShowSplash(false);
      }, waitMore);
    };

    const boot = async () => {
      await Promise.all([loadLang(), loadConfig()]);
      finishSplash();
    };

    boot();

    // wenn App wieder sichtbar wird -> Locale neu holen (kein Splash neu)
    const onVis = () => {
      if (document.visibilityState === "visible") loadLang();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const canSend = useMemo(
    () => message.trim().length >= 3 && !!department && !busy,
    [message, department, busy]
  );

  const onSubmit = async () => {
    if (!canSend) return;

    beep("tap");
    setBusy(true);

    try {
      const res = await sendDispatch({ department, priority, message, anonymous });

      if (!res?.success) {
        beep("err");
        return; // native Phone-Notify kommt aus client.lua
      }

      beep("ok");
      setMessage("");
      setAnonymous(false);
    } catch {
      beep("err");
    } finally {
      setBusy(false);
    }
  };

  // Splash Screen (verhindert Layout-Jump beim Öffnen)
  if (showSplash) {
    return (
      <div className="dp-root dp-splashRoot">
        <div className="dp-splashCard">
          <div className="dp-splashIconWrap" aria-hidden="true">
            <div className="dp-splashIcon">D</div>
          </div>

          <div className="dp-splashTitle">{t("app_title")}</div>
          <div className="dp-splashSub">{t("app_subtitle")}</div>

          <div className="dp-splashLoader" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="dp-splashHint">
            {t(hasConfig ? "splash_connecting" : "splash_initializing")}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="dp-root">
      <header className="dp-header">
        <div className="dp-headerText">
          <div className="dp-title">{t("app_title")}</div>
          <div className="dp-subtitle">{t("app_subtitle")}</div>
        </div>
        <div className="dp-badge">
          <span className="dp-liveDot" aria-hidden="true" />
          LIVE
        </div>
      </header>

      <main className="dp-card">
        <div className="dp-sectionTitle">{t("section_department")}</div>
        <div
          className="dp-segment"
          style={{ gridTemplateColumns: `repeat(${Math.max(departments.length, 1)}, 1fr)` }}
        >
          {departments.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`dp-segBtn ${department === d.id ? "is-active" : ""}`}
              onClick={() => setDepartment(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="dp-spacer" />

        <div className="dp-sectionTitle">{t("section_priority")}</div>
        <div className="dp-segment dp-segment--prio" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <button
            type="button"
            className={`dp-segBtn ${priority === "low" ? "is-active" : ""}`}
            onClick={() => setPriority("low")}
          >
            {priorityLabel("low")}
          </button>
          <button
            type="button"
            className={`dp-segBtn ${priority === "medium" ? "is-active" : ""}`}
            onClick={() => setPriority("medium")}
          >
            {priorityLabel("medium")}
          </button>
          <button
            type="button"
            className={`dp-segBtn ${priority === "high" ? "is-active" : ""}`}
            onClick={() => setPriority("high")}
          >
            {priorityLabel("high")}
          </button>
        </div>

        <div className="dp-spacer" />

        <div className="dp-sectionTitle">{t("section_text")}</div>
        <textarea
          className="dp-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("placeholder_text")}
          rows={6}
        />

        <div className="dp-hint">{t("hint_text")}</div>

        <div className="dp-spacer" />

        <div className="dp-sectionTitle">{t("section_privacy")}</div>
        <label className="dp-checkRow">
          <input
            className="dp-check"
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <span className="dp-checkLabel">{t("checkbox_anonymous")}</span>
        </label>
      </main>

      <footer className="dp-bottom">
        <button
          type="button"
          className={`dp-send ${canSend ? "" : "is-disabled"} ${busy ? "is-busy" : ""}`}
          disabled={!canSend}
          onClick={onSubmit}
        >
          <span className="dp-sendText">{busy ? t("btn_sending") : t("btn_send")}</span>
          <span className="dp-sendGlow" aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
}