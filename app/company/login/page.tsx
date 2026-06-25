import { redirect } from "next/navigation";

export default function CompanyLoginPage() {
  redirect("/login?type=company");
}
