import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  searchParams?: Promise<{ error?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : undefined;
  const error = typeof params?.error === "string" ? params.error : "";

  async function registerUser(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      redirect(`/register?error=${encodeURIComponent("Alle velden zijn verplicht")}`);
    }
    if (password.length < 6) {
      redirect(`/register?error=${encodeURIComponent("Wachtwoord moet minstens 6 tekens zijn")}`);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      redirect(`/register?error=${encodeURIComponent("E-mailadres is al geregistreerd")}`);
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.create({ data: { name, email, password: hashedPassword } });

    redirect("/login");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="nav-logo-icon">⛰</div>
          <span className="nav-logo-text">PeakFlow</span>
        </div>
        <h1 className="auth-title">Gratis starten</h1>
        <p className="auth-sub">Maak een gratis account en vind dit seizoen jouw perfecte resort.</p>

        {error && <p className="auth-error">{error}</p>}

        <form action={registerUser}>
          <div className="auth-field">
            <label htmlFor="name">Naam</label>
            <input id="name" name="name" type="text" required autoComplete="name" placeholder="Jouw naam" />
          </div>
          <div className="auth-field">
            <label htmlFor="email">E-mailadres</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="jij@voorbeeld.nl" />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Wachtwoord</label>
            <input id="password" name="password" type="password" required autoComplete="new-password" placeholder="Minstens 6 tekens" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Account aanmaken →</button>
        </form>

        <p className="auth-foot">Al een account? <Link href="/login">Inloggen →</Link></p>
      </div>
    </div>
  );
}
