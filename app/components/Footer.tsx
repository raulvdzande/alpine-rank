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
            <p>The rankings skiers trust. Data-driven, made by skiers, for skiers.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link href="/matcher">AI Matcher</Link></li>
              <li><Link href="/resorts">Resort rankings</Link></li>
              <li><Link href="/snow-score">Snow certainty</Link></li>
              <li><Link href="/resorts/compare">Compare resorts</Link></li>
              <li><Link href="/">Mobile app</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>For businesses</h4>
            <ul>
              <li><Link href="/for-resorts">Ski resorts</Link></li>
              <li><Link href="/pricing">Brands</Link></li>
              <li><Link href="/">PeakFlow Awards</Link></li>
              <li><Link href="/">API</Link></li>
              <li><Link href="/">Market data</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/">Contact</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 PeakFlow. All rights reserved.</p>
          <p>🇳🇱 Made in the Netherlands</p>
        </div>
      </div>
    </footer>
  );
}
