import Link from "next/link";
import { notFound } from "next/navigation";

const ARTICLES: Record<string, any> = {
  "beste-skigebieden-beginners-oostenrijk": {
    title: "Best ski resorts for beginners in Austria 2026",
    date: "2026-01-15",
    readTime: "6 min",
    category: "Guides",
    content: `
      <h2>Why Austria is best for beginners</h2>
      <p>Austrian ski resorts are famous for two reasons: excellent blue-piste infrastructure and welcoming mountains. If you're just starting to ski or snowboard, these 5 resorts are perfect.</p>

      <h3>1. Saalbach-Hinterglemm — Best for all levels</h3>
      <p>200 km of pistes, 40% blue. Saalbach is one of the best "learn to ski" resorts in Europe. The base sits at 1003 m — high enough for snow reliability (score 8.2/10), low enough to keep the climate mild.</p>
      <p><strong>Why for beginners:</strong> Plenty of wide blue pistes in the lower section, perfectly lit evening pistes, and three beginner parks. €52 day pass.</p>

      <h3>2. Mayrhofen — Family-friendly</h3>
      <p>139 km of pistes, 38% blue. Mayrhofen has a strong reputation as a family resort. You'll find childcare at altitude, children's pistes and an excellent ski school.</p>
      <p><strong>Why for beginners:</strong> Beginner zones separated from experts, free lifts for children, and snow reliability of 7.8/10. €49 day pass.</p>

      <h3>3. Schladming — Hidden gem</h3>
      <p>120 km of pistes, 42% blue. Schladming is less crowded than the big names, but equally good. The 4-Berge Skischaukel system means you can ski four different mountains from one resort.</p>
      <p><strong>Why for beginners:</strong> Plenty of space on blue pistes, friendly atmosphere, snow score 7.5/10, and cheaper: €45 day pass.</p>

      <h3>4. Nassfeld — Budget + Snow</h3>
      <p>110 km of pistes, 40% blue. In Carinthia, on the Slovenian-Austrian border. Not famous, but reliable.</p>
      <p><strong>Why for beginners:</strong> Snow reliability 7.9/10 (quite high), many blue pistes, very quiet, and only €42 day pass.</p>

      <h3>Practical tips for beginners</h3>
      <ul>
        <li><strong>Book in January or March:</strong> Prefer January after New Year (quiet but snow) or March for more sunshine.</li>
        <li><strong>Ski school:</strong> All 5 resorts have top ski schools. Budget €40–€60 per half day.</li>
        <li><strong>Rental equipment:</strong> Better to rent on-site (€15–€25/day) than bring your own. Luggage on the plane is inconvenient.</li>
        <li><strong>Après-ski:</strong> Austrian après-ski can be lively. Saalbach and Mayrhofen are the liveliest; Schladming and Nassfeld are quieter.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>For beginners I would choose <strong>Saalbach or Mayrhofen</strong> — they are large enough for plenty of variety, but small enough not to feel lost. Snow reliability is good on both (8.2 and 7.8), and both have excellent ski schools.</p>
    `,
  },
  "kitzbuhel-vs-st-anton": {
    title: "Kitzbühel vs St. Anton — which resort suits you?",
    date: "2026-01-10",
    readTime: "8 min",
    category: "Comparison",
    content: `
      <h2>Two legends, very different character</h2>
      <p>Kitzbühel and St. Anton are both world-famous Austrian ski resorts. But they are polar opposites in almost everything except quality.</p>

      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <thead>
          <tr style="background: var(--snow); border-bottom: 2px solid var(--border);">
            <th style="padding: 12px; text-align: left; font-weight: 600;">Criterion</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Kitzbühel</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">St. Anton</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Total pistes</strong></td>
            <td style="padding: 12px;">168 km</td>
            <td style="padding: 12px;">305 km</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Snow score</strong></td>
            <td style="padding: 12px;">7.9/10</td>
            <td style="padding: 12px;">8.4/10</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Difficulty</strong></td>
            <td style="padding: 12px;">45% blue, 35% red, 20% black</td>
            <td style="padding: 12px;">30% blue, 40% red, 30% black</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Day pass</strong></td>
            <td style="padding: 12px;">€54</td>
            <td style="padding: 12px;">€58</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px;"><strong>Atmosphere</strong></td>
            <td style="padding: 12px;">Classic, relaxed, upscale</td>
            <td style="padding: 12px;">Wild, energetic, party</td>
          </tr>
          <tr>
            <td style="padding: 12px;"><strong>Best for</strong></td>
            <td style="padding: 12px;">Intermediate + families</td>
            <td style="padding: 12px;">Experts + après-ski lovers</td>
          </tr>
        </tbody>
      </table>

      <h3>Kitzbühel: The classic choice</h3>
      <p>Kitzbühel is the resort where the world-famous Hahnenkamm race takes place in January. The village is also a chic Alpine town with boutiques, restaurants and a more elegant crowd.</p>
      <p><strong>Suited for:</strong> Intermediate skiers who appreciate elegance, families wanting subtle après-ski, people who want to feel history (the resort has existed since 1892).</p>
      <p><strong>Not suited for:</strong> Beginners (many red pistes), wild party crowds, large group trips.</p>

      <h3>St. Anton: The wildcard</h3>
      <p>St. Anton is famous for two things: 305 km of pistes (enormous offering) and nights of après-ski. The après-ski here is legendary — clubs like The Krazy Kangaroo are still open in the morning.</p>
      <p><strong>Suited for:</strong> Experts and freeride skiers (many black pistes), young people who want to party, large friend groups.</p>
      <p><strong>Not suited for:</strong> Beginners, quiet romantic holidays, families with young children.</p>

      <h2>Which do you choose?</h2>
      <p><strong>Choose Kitzbühel if:</strong> You're intermediate, appreciate elegance, and have had enough of chaos.</p>
      <p><strong>Choose St. Anton if:</strong> You're an expert, love large piste maps, and partying is part of the holiday.</p>
    `,
  },
  "sneeuwzekerheid-alpen-welke-resorts": {
    title: "Snow certainty in the Alps — which resorts are most reliable?",
    date: "2026-01-05",
    readTime: "10 min",
    category: "Data",
    content: `
      <h2>Snow certainty: more than altitude alone</h2>
      <p>Many skiers think snow certainty = altitude. That's correct. But the full picture is more complex: altitude (50%), 10 years of historical snowfall data (30%) and latitude (20%).</p>

      <h3>The Top 10 most snow-reliable Alpine resorts</h3>
      <ol>
        <li><strong>Zermatt (Switzerland)</strong> — 9.5/10. Above 3000 m with glacier. Open year-round.</li>
        <li><strong>La Plagne (France)</strong> — 8.7/10. Highest base in Europe (1970 m), excellent historical data.</li>
        <li><strong>St. Anton (Austria)</strong> — 8.4/10. Altitude + northern climate = reliable.</li>
        <li><strong>Chamonix (France)</strong> — 8.2/10. Mont-Blanc area, 10 years of snowfall data prove it.</li>
        <li><strong>Verbier (Switzerland)</strong> — 8.1/10. 3330 m summit, high snowfall, premium location.</li>
        <li><strong>Davos-Klosters (Switzerland)</strong> — 8.0/10. Graubünden, more northerly position helps.</li>
        <li><strong>Val d'Isère (France)</strong> — 7.9/10. 1850 m base, close to Italy (extra snow sometimes).</li>
        <li><strong>Kitzbühel (Austria)</strong> — 7.9/10. Austrian altitude + climate.</li>
        <li><strong>Saas-Fee (Switzerland)</strong> — 7.8/10. 1800 m base, glacial character.</li>
        <li><strong>Levi (Finland)</strong> — 7.8/10. Low (532 m summit) but EXTREMELY northerly (67°N = long season, lots of snow).</li>
      </ol>

      <h3>Surprises in the data</h3>
      <p><strong>Levi stands out:</strong> It sits only 532 m high — but because it's so far north (Lapland) the snow season is long and reliable. From a winter perspective it's TOP.</p>
      <p><strong>Scandinavian resorts win:</strong> Trysil (Norway), Åre (Sweden), Hemsedal (Norway) all score 7.5+/10. Northern latitude = more cold = more snow.</p>
      <p><strong>France dominates large volumes:</strong> Alpe d'Huez, Les Deux Alpes, Serre Chevalier all have strong snow reliability AND many pistes.</p>

      <h2>Practical conclusion</h2>
      <p>If snow certainty is your priority, choose:</p>
      <ul>
        <li><strong>Premium:</strong> Zermatt, Verbier, Chamonix (snow guaranteed, expensive)</li>
        <li><strong>Balance:</strong> St. Anton, La Plagne, Val d'Isère (good snow + many pistes)</li>
        <li><strong>Budget:</strong> Levi, Trysil, Saalbach (good snow reliability, affordable)</li>
      </ul>
    `,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: `${article.title} — PeakFlow Blog`,
    description: `Read ${article.title} on PeakFlow Blog. Data-driven guide for skiers.`,
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
          ← Back to blog
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
              {new Date(article.date).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span style={{ fontSize: 13, color: "var(--ink3)" }}>⏱ {article.readTime} read</span>
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
          <h3 style={{ marginBottom: 12 }}>Read more guides?</h3>
          <Link href="/blog" className="btn btn-primary">
            All articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
