"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  Share2,
  ArrowLeft,
  Wifi,
  Lock,
  Loader2,
  AlertCircle,
  Globe,
} from "lucide-react";
import JoinEventModal from "./JoinEventModal";
import eventService from "@/services/eventService";
import { userService } from "@/services/userService";

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  date: string;
  time: string;
  venue: string;
  isOnline: boolean;
  type: "PUBLIC" | "PRIVATE";
  registrationFee: number;
  maxParticipants?: number;
  status: string;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  images: { id: string; url: string }[];
  category: { name: string; icon?: string };
  organizer: { id: string; name: string; image?: string; email: string };
  _count: { participations: number };
}

export default function EventDetailsPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await eventService.client.getById(slug);
      const payload = response.data?.data ?? response.data;
      setEvent(payload ?? null);
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const checkAuth = useCallback(async () => {
    try {
      const response = await userService.getMyProfile();
      setIsLoggedIn(Boolean(response?.data?.id));
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchEvent();
    checkAuth();
  }, [fetchEvent, checkAuth]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
        <div className="rounded-2xl border border-purple-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-400" />
          <h2 className="text-xl font-bold text-slate-800">Event not found</h2>
          <p className="mt-2 text-sm text-slate-500">This event may be removed or the URL is invalid.</p>
          <Link
            href="/events"
            className="mt-5 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const coverImage = event.images?.[0]?.url || "/placeholder-event.svg";
  const isFree = event.registrationFee === 0;
  const spotsLeft =
    event.maxParticipants && event.maxParticipants > 0
      ? Math.max(event.maxParticipants - event._count.participations, 0)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/70 via-white to-purple-50/60 pb-14">
      <div className="sticky top-0 z-20 border-b border-purple-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-50"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Share"}
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="relative h-72 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm md:h-[420px]">
            <Image src={coverImage} alt={event.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {event.category.icon} {event.category.name}
            </div>
          </div>

          <article className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="mb-3 flex flex-wrap gap-2">
              {event.isOnline && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  <Wifi className="h-3 w-3" /> Online
                </span>
              )}
              {event.type === "PRIVATE" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-white">
                  <Lock className="h-3 w-3" /> Private
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{event.title}</h1>
            {event.shortDescription && <p className="mt-2 text-slate-600">{event.shortDescription}</p>}

            <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                {new Date(event.date).toLocaleDateString("en-BD", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                {event.time}
              </div>
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                <span className="line-clamp-1">{event.venue}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                {event._count.participations} joined
                {spotsLeft !== null && (
                  <span className={spotsLeft <= 5 ? "font-semibold text-red-500" : "text-slate-400"}>
                    ({spotsLeft === 0 ? "Full" : `${spotsLeft} spots left`})
                  </span>
                )}
              </div>
              {event.isOnline && (
                <div className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Online event
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-purple-100 pt-5">
              <h2 className="mb-2 text-lg font-bold text-slate-900">About this event</h2>
              <div
                className="prose prose-sm max-w-none whitespace-pre-line text-slate-700"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          </article>
        </section>

        <aside className="space-y-4">
          <div className="sticky top-20 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Registration Fee</p>
            <p className={isFree ? "mt-1 text-3xl font-extrabold text-green-600" : "mt-1 text-3xl font-extrabold text-purple-700"}>
              {isFree ? "Free" : `৳${event.registrationFee}`}
            </p>

            {event.totalReviews > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-sm text-amber-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {event.averageRating.toFixed(1)} ({event.totalReviews} reviews)
              </div>
            )}

            <div className="mt-5">
              {isLoggedIn ? (
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 py-3 font-bold text-white shadow-purple-200 transition hover:opacity-95"
                >
                  {isFree ? "Join Event" : "Join & Pay"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block w-full rounded-xl bg-purple-600 py-3 text-center font-bold text-white hover:bg-purple-700"
                >
                  Login to Join
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>

      {showJoinModal && (
        <JoinEventModal
          event={event}
          onClose={() => setShowJoinModal(false)}
          onSuccess={() => {
            setShowJoinModal(false);
            fetchEvent();
          }}
        />
      )}
    </div>
  );
}
