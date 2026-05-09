"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar, MapPin, Users, Star, Clock, Share2, ArrowLeft,
  Wifi, Lock, Loader2, AlertCircle, Globe, UserPlus, CheckCircle2, MessageSquare
} from "lucide-react";
import JoinEventModal from "./JoinEventModal";
import eventService from "@/services/eventService";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";
import { participationService } from "@/services/participationService";
import InviteUserModal from "./InviteUserModal";

// ... (Interface EventDetail remains same, but ensure 'reviews' is included if API provides it)

export default function EventDetailsPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<string | null>(null);
  const [participationId, setParticipationId] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    try {
      const [eventRes, userRes] = await Promise.all([
        eventService.client.getById(slug),
        authService.client.getMe().catch(() => null)
      ]);

      if (eventRes.success && eventRes.data) {
        setEvent(eventRes.data);
      }

      const currentUser = userRes?.data?.user || userRes?.data;
      if (currentUser && !currentUser.error) {
        setIsLoggedIn(true);
        // Check participation status
        if (eventRes.success && eventRes.data) {
          const partRes = await participationService.getMyParticipations({ eventId: eventRes.data.id });
          if (partRes.success && Array.isArray(partRes.data.data)) {
            const myPart = partRes.data.data.find((p: any) => p.eventId === eventRes.data.id);
            if (myPart) {
              setParticipationStatus(myPart.status);
              setParticipationId(myPart.id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || "Planora Event",
          text: event?.shortDescription || "Check out this event!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
          <p className="text-slate-500 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) return <NotFoundState />;

  const coverImage = event.images?.[0]?.url || "/placeholder-event.svg";
  const isFree = event.registrationFee === 0;
  const spotsLeft = event.maxParticipants ? Math.max(event.maxParticipants - event._count.participations, 0) : null;

  return (
    <div className="min-h-screen bg-[#FDFCFE] pt-24 pb-20"> {/* pt-24 fixes the navbar overlap */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => router.back()} className="group flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors">
            <div className="p-2 rounded-full group-hover:bg-purple-50">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium text-sm">Back to Discovery</span>
          </button>

          <div className="flex gap-3">
            {isLoggedIn && (
              <button onClick={() => setShowInviteModal(true)} className="hidden sm:flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700 hover:bg-purple-100 transition-all border border-purple-100">
                <UserPlus className="h-4 w-4" /> Invite Friends
              </button>
            )}
            <button onClick={handleShare} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
              <Share2 className="h-4 w-4" /> {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* LEFT COLUMN - CONTENT */}
          <div className="lg:col-span-8 space-y-8">

            {/* Main Header Card */}
            <div className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="relative h-64 md:h-[450px] w-full">
                <Image src={coverImage} alt={event.title} fill className="object-cover" priority />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/90 backdrop-blur px-4 py-1.5 text-xs font-bold text-purple-700 shadow-sm uppercase tracking-wider">
                    {event.category.name}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.isOnline && <Badge icon={<Wifi className="h-3 w-3" />} text="Online Event" color="bg-blue-50 text-blue-700 border-blue-100" />}
                  {event.type === "PRIVATE" && <Badge icon={<Lock className="h-3 w-3" />} text="Private" color="bg-slate-900 text-white" />}
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">{event.title}</h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">{event.shortDescription}</p>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <InfoItem icon={<Calendar />} title="Date" value={new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} />
                  <InfoItem icon={<Clock />} title="Time" value={event.time} />
                  <InfoItem icon={<MapPin />} title="Location" value={event.venue} />
                  <InfoItem icon={<Users />} title="Availability" value={spotsLeft !== null ? `${spotsLeft} Spots Available` : "Unlimited Capacity"} />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-3xl bg-white border border-slate-100 p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-600" />
                About This Event
              </h3>
              <div
                className="prose prose-purple max-w-none text-slate-600 leading-7"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>

            {/* Review Section (Enhanced) */}
            <div className="rounded-3xl bg-white border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Community Reviews
                </h3>
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-amber-700">{event.averageRating.toFixed(1)}</span>
                  <span className="text-amber-600 text-sm">({event.totalReviews} reviews)</span>
                </div>
              </div>

              {/* Simple Reviews List (Example) */}
              <div className="space-y-6">
                {event.reviews?.length > 0 ? (
                  event.reviews.map((rev: any) => (
                    <div key={rev.id} className="border-b border-slate-50 pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 uppercase">
                          {rev.user.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{rev.user.name}</h4>
                          <div className="flex gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm italic">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-400 text-sm italic">No reviews yet. Be the first to join and rate!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - ACTIONS */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">

              {/* Registration Card */}
              <div className="rounded-3xl bg-white border-2 border-purple-100 p-8 shadow-xl shadow-purple-500/5">
                <div className="mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry Fee</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-4xl font-black ${isFree ? "text-green-600" : "text-slate-900"}`}>
                      {isFree ? "FREE" : `৳${event.registrationFee}`}
                    </span>
                    {!isFree && <span className="text-slate-400 font-medium">/person</span>}
                  </div>
                </div>

                <div className="space-y-3">
                  {isLoggedIn ? (
                    participationStatus ? (
                      <button
                        disabled
                        className="group w-full rounded-2xl bg-slate-100 py-4 font-bold text-slate-500 transition-all cursor-not-allowed"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Already Registered
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowJoinModal(true)}
                        disabled={spotsLeft === 0}
                        className="group w-full rounded-2xl bg-purple-600 py-4 font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-purple-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isFree ? "Secure Spot Now" : "Confirm & Pay"}
                        </span>
                      </button>
                    )
                  ) : (
                    <Link
                      href="/login"
                      className="block w-full rounded-2xl bg-slate-900 py-4 text-center font-bold text-white transition-all hover:bg-slate-800"
                    >
                      Login to Participate
                    </Link>
                  )}
                  <p className="text-center text-xs text-slate-400 font-medium">
                    Secure checkout & instant confirmation
                  </p>
                </div>
              </div>

              {/* Organizer Card */}
              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Organizer</h4>
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-purple-50">
                    <Image
                      src={event.organizer.image || `https://ui-avatars.com/api/?name=${event.organizer.name}&background=6D28D9&color=fff`}
                      alt={event.organizer.name} fill className="object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{event.organizer.name}</h5>
                    <p className="text-xs text-slate-500">{event.organizer.email}</p>
                  </div>
                </div>
                <button className="w-full mt-4 rounded-xl border border-purple-100 py-2.5 text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors">
                  View Profile
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      {showJoinModal && (
        <JoinEventModal
          event={event}
          existingParticipationId={participationStatus === "PENDING" && !isFree ? (participationId || undefined) : undefined}
          onClose={() => setShowJoinModal(false)}
          onSuccess={() => { setShowJoinModal(false); fetchEvent(); }}
        />
      )}
      {showInviteModal && <InviteUserModal eventId={event.id} eventTitle={event.title} onClose={() => setShowInviteModal(false)} />}
    </div>
  );
}

// Reusable Sub-components for cleaner code
function Badge({ icon, text, color }: { icon: any, text: string, color: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${color}`}>
      {icon} {text}
    </span>
  );
}

function InfoItem({ icon, title, value }: { icon: any, title: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-purple-600">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{title}</p>
        <p className="text-sm font-semibold text-slate-700 mt-1">{value}</p>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Event Disappeared!</h2>
        <p className="mt-2 text-slate-500 font-medium">We couldn't find the event you're looking for. It might have been cancelled or moved.</p>
        <Link href="/events" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-8 py-3 font-bold text-white shadow-lg hover:bg-purple-700 transition-all">
          Browse Other Events
        </Link>
      </div>
    </div>
  );
}