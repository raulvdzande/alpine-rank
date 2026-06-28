import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { countryNL, countryFlag, gradientFor, emojiFor, toFiveStars, stars } from "@/lib/display";

export const metadata = {
  title: "My Wishlist — PeakFlow",
  description: "Your saved ski resorts",
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const wishlisted = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: { resort: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="section">
      <div className="container">
        <Link href="/account" style={{ fontSize: 13, color: "var(--peak)", marginBottom: 20, display: "inline-block" }}>
          ← Back to account
        </Link>

        <span className="label">Wishlist</span>
        <h2>Saved resorts</h2>

        {wishlisted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❤</div>
            <h3 style={{ marginBottom: 10 }}>Your wishlist is empty</h3>
            <p style={{ color: "var(--ink3)", marginBottom: 24, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Add your favourite resorts to your wishlist by clicking the heart icon on a resort detail page
            </p>
            <Link href="/resorts" className="btn btn-primary btn-lg">Discover resorts →</Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: "var(--ink2)", marginBottom: 32 }}>
              You have {wishlisted.length} resort{wishlisted.length !== 1 ? "s" : ""} saved
            </p>

            <div className="resort-grid">
              {wishlisted.map(item => {
                const r = item.resort;
                return (
                  <Link
                    key={r.id}
                    href={r.slug ? `/resorts/${r.slug}` : `/resort/${r.id}`}
                    className="resort-card"
                    style={{ position: "relative" }}
                  >
                    {r.snowflakes > 0 && (
                      <div style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "white",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 700,
                        zIndex: 10,
                      }}>
                        {"❄".repeat(r.snowflakes)}
                      </div>
                    )}
                    <div className="resort-img" style={{ background: gradientFor(r.id) }}>
                      <div className="resort-snow-score">❄ {r.snowScore?.toFixed(1)}</div>
                      <div className="resort-img-emoji">{emojiFor(r.id)}</div>
                    </div>
                    <div className="resort-body">
                      <div className="resort-name">{r.name} {r.verified && <span className="badge-verified">✓</span>}</div>
                      <div className="resort-location">{countryFlag(r.Country)} {countryNL(r.Country)}</div>
                      <div className="resort-stats">
                        <div className="resort-stat"><span>{r.pisteKm}</span> km</div>
                        <div className="resort-stat"><span>{r.lifts}</span> lifts</div>
                        <div className="resort-stat"><span>€{r.dayPassPrice}</span>/day</div>
                      </div>
                      {(r.averageOverallRating ?? 0) > 0 && (
                        <div className="resort-rating">
                          <span className="stars">{stars(toFiveStars(r.averageOverallRating))}</span>
                          <span className="count">{toFiveStars(r.averageOverallRating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
