import Link from "next/link";
import { notFound } from "next/navigation";

const ARTICLES: Record<string, any> = {
  "beste-skigebieden-beginners-oostenrijk": {
    title: "Beste skigebieden voor beginners in Oostenrijk 2026",
    date: "2026-01-15",
    readTime: "6 min",
    category: "Guides",
    content: `
      <h2>Waarom Oostenrijk het beste is voor beginners</h2>
      <p>Oostenrijkse skigebieden zijn beroemd om twee redenen: uitstekende blauw-piste infrastrukture en gastvrije bergen. Als je net begint met skiën of snowboarden, zijn deze 5 resorts perfect.</p>

      <h3>1. Saalbach-Hinterglemm — Beste voor alle niveaus</h3>
      <p>200 km pistes, waarvan 40% blauw. Saalbach is een van de beste "learn to ski" resorts in Europa. De basis ligt op 1003 m — hoog genoeg voor sneeuwzekerheid (score 8.2/10), laag genoeg dat het klimaat mild blijft.</p>
      <p><strong>Waarom voor beginners:</strong> Veel brede blauwe pistes in het lagere gedeelte, perfect verlichte avondpistes, en drie beginner-parken. €52 dagkaart.</p>

      <h3>2. Mayrhofen — Familie-vriendelijk</h3>
      <p>139 km pistes, 38% blauw. Mayrhofen heeft een sterke reputatie als familie-resort. Je vindt er kinderopvang op hoogte, kinderpistes en een uitstekende skischool.</p>
      <p><strong>Waarom voor beginners:</strong> Beginner-zones gescheiden van experts, gratis liften voor kinderen, en een sneeuwzekerheid van 7.8/10. €49 dagkaart.</p>

      <h3>3. Schladming — Geheim Tip</h3>
      <p>120 km pistes, 42% blauw. Schladming is minder druk dan de grote namen, maar net zo goed. Het 4-Berge Skischaukel-systeem betekent dat je vier verschillende bergen van één resort kunt skiën.</p>
      <p><strong>Waarom voor beginners:</strong> Veel ruimte op blauwe pistes, vriendelijke atmosfeer, sneeuwscore 7.5/10, en goedkoper: €45 dagkaart.</p>

      <h3>4. Nassfeld — Budget + Sneeuw</h3>
      <p>110 km pistes, 40% blauw. In Karinthië, op de Sloveens-Oostenrijkse grens. Niet beroemd, maar betrouwbaar.</p>
      <p><strong>Waarom voor beginners:</strong> Sneeuwzekerheid 7.9/10 (behoorlijk hoog), veel blauwe pistes, heel rustig, en slechts €42 dagkaart.</p>

      <h3>Praktische tips voor beginners</h3>
      <ul>
        <li><strong>Boek in januari of maart:</strong> Voorkeur voor januari na nieuwjaar (rustig maar sneeuw) of maart voor meer zon.</li>
        <li><strong>Skischool:</strong> Alle 5 resorts hebben topskischolen. Budget €40–€60 per halve dag.</li>
        <li><strong>Huurequipment:</strong> Beter ter plaatse huren (€15–€25/dag) dan meenemen. Het spullen in het vliegtuig is onhandig.</li>
        <li><strong>Apres-ski:</strong> Oostenrijkse apres-ski kan wild zijn. Saalbach en Mayrhofen zijn het liveliest; Schladming en Nassfeld zijn rustiger.</li>
      </ul>

      <h2>Conclusie</h2>
      <p>Voor beginners zou ik <strong>Saalbach of Mayrhofen</strong> kiezen — het zijn grote genoeg resorts voor veel variatie, maar klein genoeg om je niet verloren te voelen. Sneeuwzekerheid is op beide goed (8.2 en 7.8), en beide hebben uitstekende skischolen.</p>
    `,
  },
  "kitzbuhel-vs-st-anton": {
    title: "Kitzbühel vs St. Anton — welk resort past bij jou?",
    date: "2026-01-10",
    readTime: "8 min",
    category: "Comparison",
    content: `
      <h2>Twee legenden, heel ander karakter</h2>
      <p>Kitzbühel en St. Anton zijn beide wereldberoemd Oostenrijkse skigebieden. Maar ze zijn voorbijlopers van elkaar in bijna alles behalve kwaliteit.</p>

      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <thead>
          <tr style="background: var(--snow); border-bottom: 2px solid var(--border);">
            <th style="padding: 12px; text-align: left; font-weight: 600;">Criterium</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Kitzbühel</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">St. Anton</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Totaal pistes</strong></td>
            <td style="padding: 12px;">168 km</td>
            <td style="padding: 12px;">305 km</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Sneeuwscore</strong></td>
            <td style="padding: 12px;">7.9/10</td>
            <td style="padding: 12px;">8.4/10</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Moeilijkheid</strong></td>
            <td style="padding: 12px;">45% blauw, 35% rood, 20% zwart</td>
            <td style="padding: 12px;">30% blauw, 40% rood, 30% zwart</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Dagkaart</strong></td>
            <td style="padding: 12px;">€54</td>
            <td style="padding: 12px;">€58</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Atmosfeer</strong></td>
            <td style="padding: 12px;">Klassiek, rustig, elitair</td>
            <td style="padding: 12px;">Wild, energiek, feest</td>
          </tr>
          <tr>
            <td style="padding: 12px;"><strong>Beste voor</strong></td>
            <td style="padding: 12px;">Gevorderde + families</td>
            <td style="padding: 12px;">Experts + après-skiërs</td>
          </tr>
        </tbody>
      </table>

      <h3>Kitzbühel: De klassieke keuze</h3>
      <p>Kitzbühel is het resort waar je wereldberoemde Hahnenkamm-racedag in januari plaatsvindt. Het dorp is ook een chic alpenstad met boutiques, restaurants en een meer elegant publiek.</p>
      <p><strong>Geschikt voor:</strong> Gevorderde skiërs die elegantie waarderen, families die subtiele apres-ski willen, mensen die geschiedenis willen voelen (het resort bestaat sinds 1892).</p>
      <p><strong>Niet geschikt voor:</strong> Beginners (veel rode pistes), wild feest-publiek, grote groepsreizen.</p>

      <h3>St. Anton: De wildcard</h3>
      <p>St. Anton is beroemd voor twee dingen: 305 km pistes (enorm aanbod) en nachtenlang après-ski. De apres-ski hier is legendarisch — clubs als The Krazy Kangaroo zijn 's ochtends nog open.</p>
      <p><strong>Geschikt voor:</strong> Experts en freeride-skiers (veel zwarte pistes), jongeren die willen feesten, grote vriendschapsgroepen.</p>
      <p><strong>Niet geschikt voor:</strong> Beginners, stille romantische vakanties, gezinnen met kleine kinderen.</p>

      <h2>Welke kies je?</h2>
      <p><strong>Kies Kitzbühel als:</strong> Je intermediate bent, elegantie waardeert, en genoeg hebt van chaos.</p>
      <p><strong>Kies St. Anton als:</strong> Je expert bent, houdt van grote pistekaarten, en feesten is deel van de vakantie.</p>
    `,
  },
  "sneeuwzekerheid-alpen-welke-resorts": {
    title: "Sneeuwzekerheid in de Alpen — welke resorts zijn het meest betrouwbaar?",
    date: "2026-01-05",
    readTime: "10 min",
    category: "Data",
    content: `
      <h2>Sneeuwzekerheid: meer dan hoogte alleen</h2>
      <p>Veel skiërs denken dat sneeuwzekerheid = hoogte. Dat klopt. Maar het volledige plaatje is ingewikkelder: hoogte (50%), 10 jaar historische sneeuwdata (30%) en breedtegraad (20%).</p>

      <h3>De Top 10 meest sneeuwzekere Alpenresorts</h3>
      <ol>
        <li><strong>Zermatt (Zwitserland)</strong> — 9.5/10. Boven 3000 m met gletsjer. Ganzenjaar open.</li>
        <li><strong>La Plagne (Frankrijk)</strong> — 8.7/10. Hoogste basis van Europa (1970 m), uitstekende historische data.</li>
        <li><strong>St. Anton (Oostenrijk)</strong> — 8.4/10. Hoogte + noordelijk klimaat = betrouwbaar.</li>
        <li><strong>Chamonix (Frankrijk)</strong> — 8.2/10. Mont-Blanc gebied, 10 jaar sneeuwdata bewijzen het.</li>
        <li><strong>Verbier (Zwitserland)</strong> — 8.1/10. 3330 m top, veel sneeuwval, premium ligging.</li>
        <li><strong>Davos-Klosters (Zwitserland)</strong> — 8.0/10. Graubünden, noordelijker positie helpt.</li>
        <li><strong>Val d'Isère (Frankrijk)</strong> — 7.9/10. 1850 m basis, dicht bij Italië (extra sneeuw soms).</li>
        <li><strong>Kitzbühel (Oostenrijk)</strong> — 7.9/10. Oostenrijkse hoogte + klimaat.</li>
        <li><strong>Saas-Fee (Zwitserland)</strong> — 7.8/10. 1800 m basis, glaciaal karakter.</li>
        <li><strong>Levi (Finland)</strong> — 7.8/10. Laag (532 m top) maar EXTREEM noordelijk (67°N = langzaam seizoen, veel sneeuw).</li>
      </ol>

      <h3>Verrassingen in de data</h3>
      <p><strong>Levi slaat uit:</strong> Het ligt slechts 532 m hoog — maar omdat het zo noordelijk ligt (Lapland) is het sneeuwseizoen lang en betrouwbaar. Vanuit Winterse oogpunt is het TOP.</p>
      <p><strong>Scandinavische resorts winnen:</strong> Trysil (Noorwegen), Åre (Zweden), Hemsedal (Noorwegen) scoren allemaal 7.5+/10. Noordelijke breedtegraad = meer kou = meer sneeuw.</p>
      <p><strong>Frankrijk domineert grote aantallen:</strong> Alpe d'Huez, Les Deux Alpes, Serre Chevalier hebben alle sterke sneeuwzekerheid EN veel pistes.</p>

      <h2>Praktische conclusie</h2>
      <p>Als sneeuwzekerheid je prioriteit is, kies je:</p>
      <ul>
        <li><strong>Premium:</strong> Zermatt, Verbier, Chamonix (sneeuw gegarandeerd, duur)</li>
        <li><strong>Balans:</strong> St. Anton, La Plagne, Val d'Isère (goed sneeuw + veel pistes)</li>
        <li><strong>Budget:</strong> Levi, Trysil, Saalbach (goede sneeuwzekerheid, betaalbaar)</li>
      </ul>
    `,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) {
    return { title: "Artikel niet gevonden" };
  }

  return {
    title: `${article.title} — PeakFlow Blog`,
    description: `Lees ${article.title} op PeakFlow Blog. Data-gedreven gids voor skiërs.`,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) {
    notFound();
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 700 }}>
        <Link href="/blog" style={{ fontSize: 13, color: "var(--peak)", marginBottom: 20, display: "inline-block" }}>
          ← Terug naar blog
        </Link>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--peak)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {article.category}
            </span>
            <span style={{ fontSize: 13, color: "var(--ink3)" }}>
              {new Date(article.date).toLocaleDateString("nl-NL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span style={{ fontSize: 13, color: "var(--ink3)" }}>⏱ {article.readTime} leestijd</span>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: "var(--ink)" }}>
            {article.title}
          </h1>
        </div>

        <div
          style={{
            fontSize: 16,
            color: "var(--ink2)",
            lineHeight: 1.8,
            maxWidth: "100%",
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div
          style={{
            marginTop: 60,
            paddingTop: 40,
            borderTop: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Meer gidsen lezen?</h3>
          <Link href="/blog" className="btn btn-primary">
            Alle artikelen →
          </Link>
        </div>
      </div>
    </section>
  );
}
