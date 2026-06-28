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
      redirect(`/register?error=${encodeURIComponent("All fields are required")}`);
    }
    if (password.length < 6) {
      redirect(`/register?error=${encodeURIComponent("Password must be at least 6 characters")}`);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      redirect(`/register?error=${encodeURIComponent("Email address is already registered")}`);
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.create({ data: { name, email, password: hashedPassword } });

    redirect("/login");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo-icon.svg" alt="PeakFlow" style={{ width: 40, height: 40, marginBottom: 8 }} />
          <span className="nav-logo-text">PeakFlow</span>
        </div>
        <h1 className="auth-title">Get started for free</h1>
        <p className="auth-sub">Create a free account and find your perfect resort this season.</p>

        {error && <p className="auth-error">{error}</p>}

        <form action={registerUser}>
          <div className="auth-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name" />
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="new-password" placeholder="At least 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Create account →</button>
        </form>

        <p className="auth-foot">Already have an account? <Link href="/login">Log in →</Link></p>
      </div>
    </div>
  );
}
