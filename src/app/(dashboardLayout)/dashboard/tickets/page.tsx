import { redirect } from "next/navigation";

export default function DashboardTicketsRedirectPage() {
  redirect("/dashboard/participations");
}
