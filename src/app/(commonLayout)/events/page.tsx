import EventsPage from "@/components/module/events/EventPage";
import { Suspense } from "react";

export const metadata = {
  title: "Events | Planora",
  description: "Browse and discover amazing events near you",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <EventsPage />
    </Suspense>
  );
}