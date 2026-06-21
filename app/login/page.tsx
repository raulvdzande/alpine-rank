import { prisma } from "@/lib/prisma";
import { comparePassword, signJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  searchParams?: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : undefined;
  const error = typeof params?.error === "string" ? params.error : "";

  async function loginUser(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      redirect(`/login?error=${encodeURIComponent("Alle velden zijn verplicht")}`);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      redirect(`/login?error=${encodeURIComponent("Ongeldig e-mailadres of wachtwoord")}`);
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      redirect(`/login?error=${encodeURIComponent("Ongeldig e-mailadres of wachtwoord")}`);
    }

    const token = await signJwt({ id: user.id, email: user.email, name: user.name, role: user.role });

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    if (user.role === "ADMIN") redirect("/admin");
    redirect("/");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="nav-logo-icon">⛰</div>
          <span className="nav-logo-text">PeakFlow</span>
        </div>
        <h1 className="auth-title">Welkom terug</h1>
        <p className="auth-sub">Log in om resorts te vergelijken en je wishlist te beheren.</p>

        {error && <p className="auth-error">{error}</p>}

        <form action={loginUser}>
          <div className="auth-field">
            <label htmlFor="email">E-mailadres</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="jij@voorbeeld.nl" />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Wachtwoord</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Inloggen →</button>
        </form>

        <p className="auth-foot">Nog geen account? <Link href="/register">Gratis starten →</Link></p>
      </div>
    </div>
  );
}
