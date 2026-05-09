
import React from "react";
import { getSingleEventAction } from "@/actions/event.actions";
import { notFound } from "next/navigation";
import { EventInviteForm } from "@/components/module/dashboard/user/event/EventInviteForm";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { eventId } = await params;
  
  try {
    const event = await getSingleEventAction(eventId);
    
    if (!event) {
      return notFound();
    }

    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-black mb-4">{event.title}</h1>
        <p className="text-slate-500 mb-8">{event.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-3xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">Event Stats</h2>
              <p>Status: {event.status}</p>
              <p>Type: {event.type}</p>
              <p>Venue: {event.venue}</p>
           </div>
        </div>
        <EventInviteForm eventId={event.id} eventTitle={event.title} />
      </div>
    );
  } catch (error) {
    console.error("Error loading event:", error);
    return notFound();
  }
}
