import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import EventDetailsPage from "@/components/module/events/EventDitailsPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    const event = data?.data;

    if (!event) return { title: "Event | Planora" };

    return {
      title: `${event.title} | Planora`,
      description: event.shortDescription || event.description?.slice(0, 160),
      openGraph: {
        title: event.title,
        description: event.shortDescription || "",
        images: event.images?.[0]?.url ? [event.images[0].url] : [],
      },
    };
  } catch {
    return { title: "Event | Planora" };
  }
}

export default async function Page({ params }: PageProps) {
  // ৩. এখানেও params await করে নিন
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      }
    >
      <EventDetailsPage slug={slug} />
    </Suspense>
  );
}