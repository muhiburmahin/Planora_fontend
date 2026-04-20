import EventModule from "@/components/module/event/event";
import { Footer } from "@/components/layout";

export default function EventsPage() {
    return (
        <main className="min-h-screen">
            <EventModule />
            <Footer />
        </main>
    );
}