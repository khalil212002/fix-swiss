import { redirect, RedirectType } from "next/navigation";

export default function DashboardPage() {
  redirect("/dashboard/players");
}
