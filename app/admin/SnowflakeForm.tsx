"use client";

import { useState, useTransition } from "react";
import { setSnowflakes } from "./actions";

interface Props {
  resortId: string;
  resortName: string;
  currentSnowflakes: number;
  currentNote: string | null;
  currentReport: string | null;
  worldCounts: { sf1: number; sf2: number; sf3: number; total: number };
}

const RUBRIC = {
  1: {
    title: "❄ Één Snowflake",
    subtitle: "Een uitzonderlijk resort dat opvalt in zijn categorie.",
    sections: [
      {
        label: "Piste & sneeuw (op de berg)",
        items: [
          "Pisteverzorging: Worden pistes dagelijks geprepareerd? Geen kale plekken of randen?",
          "Sneeuwdekking: Is de laag overal dik genoeg voor veilig skiën (min. 40 cm)?",
          "Sneeuwkwaliteit: Consistent, niet ijs-achtig, aangenaam te skiën?",
          "Markering: Alle pistes duidelijk gemarkeerd, ook in slechte zicht?",
        ],
      },
      {
        label: "Liften (ter plaatse getest)",
        items: [
          "Wachttijden: Acceptabel (<20 min) ook tijdens drukke periodes?",
          "Liftstaat: Gondels/stoeltjes schoon, onderhouden en functioneel?",
          "Flow: Beweging door het skigebied soepel, zonder overbodige omwegen?",
        ],
      },
      {
        label: "Gastronomie op de berg",
        items: [
          "Kwaliteit: Minstens één berghut/restaurant dat de verwachtingen overtreft?",
          "Bediening: Personeel attent en vriendelijk?",
        ],
      },
      {
        label: "Sfeer & beleving",
        items: [
          "Authenticiteit: Eigen, herkenbare sfeer — niet generiek/standaard?",
          "Veiligheid: Bergpersoneel patrouillet regelmatig? EHBO aanwezig en zichtbaar?",
          "Après-ski: Is er een goede après-ski mogelijkheid met sfeer?",
        ],
      },
    ],
  },
  2: {
    title: "❄❄ Twee Snowflakes",
    subtitle: "De reis speciaal naar dit resort waard. Elk aspect uitstekend.",
    sections: [
      {
        label: "Piste & sneeuw (op de berg) — bovenop ❄ vereisten",
        items: [
          "Dagelijkse verzorging: Pistes elke nacht opnieuw geprepareerd, ook bij weinig sneeuw?",
          "Off-piste kwaliteit: Aantrekkelijk en toegankelijk terrein buiten de piste?",
          "Sneeuwzekerheid: Kanonnen aanwezig en effectief ingezet bij tekort?",
          "Terreinvariatie: Divers aanbod (groen/blauw/rood/zwart) elk uitstekend onderhouden?",
        ],
      },
      {
        label: "Liften (ter plaatse getest) — bovenop ❄ vereisten",
        items: [
          "Minimale wacht: Op drukke dagen max 10 minuten bij de hoofdliften?",
          "Moderniteit: Liften nieuw/recent en comfortabel (cabineverwarming, windschermen)?",
          "Verbinding: Intern goed verbonden — geen taxi/bus nodig om van piste naar piste?",
        ],
      },
      {
        label: "Gastronomie op de berg — bovenop ❄ vereisten",
        items: [
          "Meerdere kwaliteitsrestaurants: Minimaal 2-3 met onderscheidende keuken?",
          "Uitzicht & inrichting: Minstens één met spectaculair uitzicht én bijzondere inrichting?",
          "Prijsniveau: Kwaliteit de prijs waard — gasten bereid terug te keren puur voor het eten?",
        ],
      },
      {
        label: "Sfeer & beleving — bovenop ❄ vereisten",
        items: [
          "Uniek kenmerk: Iets wat dit resort uniek maakt — nergens anders bestaat?",
          "Dorpsbeleving: Dorpscentrum 's avonds levendig en de moeite waard om door te lopen?",
          "Après-ski: Levendig, authentiek eigen karakter — niet generiek?",
          "Gastvrijheid: Onthouden medewerkers namen? Gast proactief geholpen?",
        ],
      },
    ],
  },
  3: {
    title: "❄❄❄ Drie Snowflakes",
    subtitle: "Een unieke, onvergelijkbare skiervaring. Een reis op zichzelf waard.",
    sections: [
      {
        label: "Piste & sneeuw (op de berg) — bovenop ❄❄ vereisten",
        items: [
          "Makeloos: Pistes elke ochtend alsof er vers is gevallen — ook zonder sneeuw?",
          "Extreme off-piste: Freeride van wereldniveau, gidsen beschikbaar, veilig en spectaculair?",
          "Seizoenzekerheid: Consistent uitzonderlijke omstandigheden het merendeel van het seizoen?",
          "Exclusief terrein: Pistes of ervaringen die nergens anders ter wereld bestaan?",
        ],
      },
      {
        label: "Liften (ter plaatse getest) — bovenop ❄❄ vereisten",
        items: [
          "Vrijwel geen wacht: Zelfs op piekdagen <5 min bij alle hoofdliften?",
          "Wereldklasse technologie: Behoort tot de meest moderne ter wereld (heated seats, wifi)?",
          "Perfecte coverage: Geen enkel deel lastig bereikbaar of slecht verbonden?",
        ],
      },
      {
        label: "Gastronomie op de berg — bovenop ❄❄ vereisten",
        items: [
          "Restaurantniveau: Minstens één restaurant dat concurreert met sterrenzaken qua keuken, wijnkaart en service?",
          "Totaalervaring eten: Lunchen op de berg is zelf een reden om naar dit resort te gaan?",
          "Consistentie: Elke bergeetgelegenheid heeft kwaliteit — geen enkele teleurstelling?",
        ],
      },
      {
        label: "Sfeer & beleving — bovenop ❄❄ vereisten",
        items: [
          "Mythische status: Dit resort heeft een aura — voelt bijzonder vanaf het moment van aankomst?",
          "Onvergelijkbare ervaring: Iets op dit resort dat je nergens anders ter wereld kunt vinden?",
          "Personalisatie: Gasten behandeld als individuen — niet als nummers?",
          "Après-ski van wereldniveau: Behoort tot de beste die je ooit hebt meegemaakt?",
          "Totaalconcept: Van aankomst tot vertrek elk aspect doordacht en uitzonderlijk?",
        ],
      },
    ],
  },
};

export default function SnowflakeForm({ resortId, resortName, currentSnowflakes, currentNote, currentReport, worldCounts }: Props) {
  const [selected, setSelected] = useState<number>(currentSnowflakes);
  const [note, setNote] = useState(currentNote ?? "");
  const [report, setReport] = useState(currentReport ?? "");
  const [confirmName, setConfirmName] = useState("");
  const [confirmCheck1, setConfirmCheck1] = useState(false);
  const [confirmCheck2, setConfirmCheck2] = useState(false);
  const [openRubric, setOpenRubric] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, startSave] = useTransition();

  const isLowering = selected < currentSnowflakes;
  const isThree = selected === 3;
  const noteLen = note.trim().length;
  const reportLen = report.trim().length;

  const canSave =
    (selected === 0 || (noteLen >= 40 && reportLen >= 300)) &&
    (!isLowering || confirmName.trim().length >= 2) &&
    (!isThree || (confirmCheck1 && confirmCheck2 && confirmName.trim().length >= 2));

  function handleSave() {
    setError("");
    startSave(async () => {
      try {
        await setSnowflakes(resortId, selected, note, report);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Er ging iets mis");
      }
    });
  }

  const tileStyle = (n: number): React.CSSProperties => {
    const isSelected = selected === n;
    const isDisabled = (n === 2 && currentSnowflakes < 1) || (n === 3 && currentSnowflakes < 2);
    return {
      flex: 1,
      minWidth: 80,
      padding: "16px 12px",
      borderRadius: 10,
      border: isSelected ? "2px solid #f59e0b" : "2px solid #334155",
      background: isSelected ? "rgba(245,158,11,.15)" : "#1e293b",
      color: isDisabled ? "#475569" : isSelected ? "#fbbf24" : "#94a3b8",
      cursor: isDisabled ? "not-allowed" : "pointer",
      textAlign: "center",
      fontSize: 13,
      fontWeight: isSelected ? 700 : 400,
      opacity: isDisabled ? 0.5 : 1,
      transition: "all .15s",
      animation: n === 3 && !isDisabled ? "sf-pulse 2.5s ease-in-out infinite" : undefined,
    };
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>PeakFlow Snowflakes toewijzen</h2>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Ken Snowflakes toe op basis van jouw fysieke bezoek aan {resortName}. De inspectierubriek hieronder helpt je bepalen welk niveau van toepassing is.
        </p>
      </div>

      {/* Worldwide distribution */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
          Mondiale Snowflake distributie ({worldCounts.total} resorts)
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "❄", count: worldCounts.sf1, color: "#94a3b8" },
            { label: "❄❄", count: worldCounts.sf2, color: "#f59e0b" },
            { label: "❄❄❄", count: worldCounts.sf3, color: "#fbbf24" },
          ].map(x => (
            <div key={x.label} style={{ fontSize: 13, color: x.color }}>
              <span style={{ fontWeight: 700 }}>{x.label}</span>
              <span style={{ color: "#64748b", marginLeft: 6 }}>{x.count} resorts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspectie-rubriek accordeon */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>Inspectiecriteria (ter plaatse te beoordelen)</div>
        {([1, 2, 3] as const).map(n => (
          <div key={n} style={{ marginBottom: 6, border: "1px solid #334155", borderRadius: 8, overflow: "hidden" }}>
            <button
              onClick={() => setOpenRubric(openRubric === n ? null : n)}
              style={{ width: "100%", textAlign: "left", background: "#1e293b", border: "none", color: "#94a3b8", padding: "12px 16px", fontSize: 13, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span style={{ fontWeight: 600 }}>{RUBRIC[n].title}</span>
              <span style={{ color: "#475569" }}>{openRubric === n ? "▲" : "▼"}</span>
            </button>
            {openRubric === n && (
              <div style={{ padding: "12px 16px 16px", background: "#0f172a" }}>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontStyle: "italic" }}>{RUBRIC[n].subtitle}</p>
                {RUBRIC[n].sections.map(section => (
                  <div key={section.label} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>{section.label}</div>
                    {section.items.map((item, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "3px 0 3px 12px", borderLeft: "2px solid #334155", marginBottom: 4 }}>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tier-selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>Toe te kennen niveau</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { n: 0, label: "Geen", sub: "Geen Snowflake" },
            { n: 1, label: "❄", sub: "Één Snowflake" },
            { n: 2, label: "❄❄", sub: "Twee Snowflakes" },
            { n: 3, label: "❄❄❄", sub: "Drie Snowflakes" },
          ].map(({ n, label, sub }) => {
            const isDisabled = (n === 2 && currentSnowflakes < 1) || (n === 3 && currentSnowflakes < 2);
            const tooltip = n === 2 && currentSnowflakes < 1 ? "Vereist: resort heeft al ❄ nodig" :
                           n === 3 && currentSnowflakes < 2 ? "Vereist: resort heeft al ❄❄ nodig" : undefined;
            return (
              <button
                key={n}
                disabled={isDisabled}
                onClick={() => !isDisabled && setSelected(n)}
                title={tooltip}
                style={tileStyle(n)}
              >
                <div style={{ fontSize: n === 0 ? 20 : 22, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11 }}>{sub}</div>
                {n > 0 && currentSnowflakes < n && (
                  <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>
                    {n === 2 ? "Vereist ❄ eerst" : "Vereist ❄❄ eerst"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text fields — only if selected > 0 */}
      {selected > 0 && (
        <div style={{ marginBottom: 20 }}>
          {/* Citation */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
              Publieke citation <span style={{ color: "#64748b", fontWeight: 400 }}>(zichtbaar in banner op resort-pagina)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={150}
              placeholder="Één krachtige zin die de essentie van de inspectie samenvat..."
              style={{ width: "100%", background: "#1e293b", border: `1px solid ${noteLen < 40 && noteLen > 0 ? "#ef4444" : "#334155"}`, borderRadius: 8, color: "white", padding: "10px 14px", fontSize: 13 }}
            />
            <div style={{ fontSize: 11, color: noteLen < 40 ? "#f87171" : "#64748b", marginTop: 4, textAlign: "right" }}>
              {noteLen} / 40 minimaal (max 150)
            </div>
          </div>

          {/* Volledig rapport */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
              Volledig inspectierapport <span style={{ color: "#64748b", fontWeight: 400 }}>(zichtbaar voor resort en alle bezoekers)</span>
            </label>
            <textarea
              value={report}
              onChange={e => setReport(e.target.value)}
              placeholder="Schrijf een uitgebreid rapport van je bezoek. Beschrijf wat je hebt ervaren per categorie: piste & sneeuw, liften, gastronomie, sfeer. Geef aan wat uitstekend was, wat het resort onderscheidde, en waarom je dit niveau toekent (of nog niet). Dit rapport is volledig zichtbaar voor het resort en alle bezoekers."
              rows={10}
              style={{ width: "100%", background: "#1e293b", border: `1px solid ${reportLen < 300 && reportLen > 0 ? "#ef4444" : "#334155"}`, borderRadius: 8, color: "white", padding: "12px 14px", fontSize: 13, resize: "vertical", minHeight: 220 }}
            />
            <div style={{ fontSize: 11, color: reportLen < 300 ? "#f87171" : "#64748b", marginTop: 4, textAlign: "right" }}>
              {reportLen} / 300 minimaal vereist
            </div>
          </div>
        </div>
      )}

      {/* Verlaging bevestiging */}
      {isLowering && (
        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f87171", marginBottom: 10 }}>
            ⚠ Je verlaagt dit resort van {currentSnowflakes} naar {selected} Snowflake(s). Typ de naam van het resort ter bevestiging:
          </div>
          <input
            type="text"
            value={confirmName}
            onChange={e => setConfirmName(e.target.value)}
            placeholder={resortName}
            style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(239,68,68,.4)", borderRadius: 8, color: "white", padding: "8px 12px", fontSize: 13 }}
          />
        </div>
      )}

      {/* 3-Snowflake extra bevestiging */}
      {isThree && !isLowering && (
        <div style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24", marginBottom: 12 }}>
            ❄❄❄ Drie Snowflakes is de hoogste onderscheiding. Bevestig je oordeel:
          </div>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
            <input type="checkbox" checked={confirmCheck1} onChange={e => setConfirmCheck1(e.target.checked)} style={{ marginTop: 2 }} />
            Ik bevestig dat dit resort in alle categorieën uitstekend scoort en nul zwakke punten heeft
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
            <input type="checkbox" checked={confirmCheck2} onChange={e => setConfirmCheck2(e.target.checked)} style={{ marginTop: 2 }} />
            Ik bevestig dat dit resort een onvergelijkbare ervaring biedt die nergens anders ter wereld bestaat
          </label>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Typ de naam van het resort ter bevestiging:</div>
          <input
            type="text"
            value={confirmName}
            onChange={e => setConfirmName(e.target.value)}
            placeholder={resortName}
            style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(245,158,11,.3)", borderRadius: 8, color: "white", padding: "8px 12px", fontSize: 13 }}
          />
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, color: "#f87171", fontSize: 13 }}>
          ✗ {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        style={{
          width: "100%",
          padding: "12px 20px",
          borderRadius: 10,
          border: "none",
          background: canSave ? "linear-gradient(135deg,#d97706,#f59e0b)" : "#334155",
          color: canSave ? "white" : "#64748b",
          fontSize: 14,
          fontWeight: 700,
          cursor: canSave ? "pointer" : "not-allowed",
          opacity: saving ? 0.7 : 1,
          letterSpacing: "0.3px",
        }}
      >
        {saving ? "⏳ Opslaan..." : selected === 0 ? "Snowflakes verwijderen" : `❄${"❄".repeat(selected - 1)} ${selected} Snowflake${selected > 1 ? "s" : ""} toekennen`}
      </button>

      {currentSnowflakes > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#64748b", textAlign: "center" }}>
          Huidige status: {currentSnowflakes} Snowflake{currentSnowflakes > 1 ? "s" : ""} · Toegekend op {new Date().toLocaleDateString("nl-NL")}
        </div>
      )}
    </div>
  );
}
