import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <img src="/logo-icon.svg" alt="PeakFlow" style={{ width: 32, height: 32 }} />
              <span style={{ fontSize: 17, fontWeight: 700 }}>PeakFlow</span>
            </div>
            <p>De rankings die skiërs vertrouwen. Data-gedreven, door skiërs gemaakt, voor skiërs.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link href="/matcher">AI Matcher</Link></li>
              <li><Link href="/resorts">Resort rankings</Link></li>
              <li><Link href="/resorts">Sneeuwzekerheid</Link></li>
              <li><Link href="/resorts">Vergelijker</Link></li>
              <li><Link href="/">Mobile app</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Voor bedrijven</h4>
            <ul>
              <li><Link href="/dashboard">Skigebieden</Link></li>
              <li><Link href="/pricing">Merkfabrikanten</Link></li>
              <li><Link href="/">PeakFlow Awards</Link></li>
              <li><Link href="/">API</Link></li>
              <li><Link href="/">Marktdata</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Bedrijf</h4>
            <ul>
              <li><Link href="/">Over ons</Link></li>
              <li><Link href="/">Blog</Link></li>
              <li><Link href="/">Contact</Link></li>
              <li><Link href="/">Privacy</Link></li>
              <li><Link href="/">Voorwaarden</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 PeakFlow. Alle rechten voorbehouden.</p>
          <p>🇳🇱 Gemaakt in Nederland</p>
        </div>
      </div>
    </footer>
  );
}
