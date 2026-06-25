import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NavShell from "./NavShell";

async function logoutAction() {
  "use server";
  (await cookies()).delete("session");
  redirect("/");
}

export default async function Nav() {
  const user = await getCurrentUser();

  return (
    <NavShell
      user={user ? { name: user.name, role: user.role } : null}
      logoutAction={logoutAction}
    />
  );
}
