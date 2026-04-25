"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar, MapPin, Users, Star, Clock, Tag, Share2, Heart,
  ArrowLeft, Wifi, Lock, CheckCircle, XCircle, Loader2,
  ChevronLeft, ChevronRight, Edit2, Trash2, AlertCircle,
  Ticket, Globe, User,
} from "lucide-react";
import JoinEventModal from "./JoinEventModal";
import ReviewModal from "./ReviewModel";
// import ReviewModal from "./ReviewModal";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; image?: string };
}

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
  isPublished: boolean;
  averageRating: number;
  totalReviews: number;
  images: { id: string; url: string }[];
  category: { name: string; icon?: string; slug: string };
  organizer: { id: string; name: string; image?: string; email: string };
  reviews: Review[];
  _count: { participations: number };
}

interface UserParticipation {
  id: string;
  status: string;
  paymentStatus: string;
  ticketNumber?: string;
}

interface CurrentUser {
  id: string;
  role: string;
}

// ─── Star Display ─────────────────────────────────────────────────────────────
function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${s} ${
            star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ images, title }: { images: { id: string; url: string }[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images?.length) {
    return (
      <div className="w-full h-80 bg-gradient-primary rounded-2xl flex items-center justify-center">
        <span className="text-white/40 text-6xl">🎪</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative w-full h-80 md:h-[420px] rounded-2xl overflow-hidden group">
        <Image
          src={images[activeIdx].url}
          alt={`${title} - image ${activeIdx + 1}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {activeIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                activeIdx === i ? "border-primary-500" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EventDetailsPage({ slug }: { slug: string }) {
  const router = useRouter();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [myParticipation, setMyParticipation] = useState<UserParticipation | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);

  // Modals
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Delete review state
  const [deletingReview, setDeletingReview] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${slug}`);
      const data = await res.json();
      if (data.success) setEvent(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setCurrentUser(data.data);
    } catch {
      // not logged in
    }
  }, []);

  const fetchMyParticipation = useCallback(async (eventId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/participations/my-participations?eventId=${eventId}`);
      const data = await res.json();
      if (data.success && data.data?.data?.length > 0) {
        setMyParticipation(data.data.data[0]);
      }
    } catch {
      // not joined
    }
  }, [currentUser]);

  useEffect(() => {
    fetchEvent();
    fetchCurrentUser();
  }, [fetchEvent, fetchCurrentUser]);

  useEffect(() => {
    if (event && currentUser) {
      fetchMyParticipation(event.id);
      // Find my review
      const found = event.reviews.find((r) => {
        // We'd normally match by userId, but reviews don't expose userId here
        // This is a placeholder — adapt to your actual data shape
        return false;
      });
      setMyReview(found || null);
    }
  }, [event, currentUser, fetchMyParticipation]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete your review?")) return;
    setDeletingReview(true);
    try {
      await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      setMyReview(null);
      fetchEvent();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingReview(false);
    }
  };

  // ─── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Event Not Found</h2>
          <p className="text-gray-400 mb-4">This event may have been removed or doesn&apos;t exist.</p>
          <Link href="/events" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const isFree = event.registrationFee === 0;
  const isUpcoming = event.status === "UPCOMING";
  const isCancelled = event.status === "CANCELLED";
  const isCompleted = event.status === "COMPLETED";
  const isOrganizer = currentUser?.id === event.organizer.id;
  const isAdmin = currentUser?.role === "ADMIN";
  const isJoined = !!myParticipation;
  const canJoin = !isJoined && isUpcoming && !isCancelled && currentUser;
  const canReview = isCompleted && isJoined && currentUser;
  const spotsLeft =
    event.maxParticipants && event.maxParticipants > 0
      ? event.maxParticipants - event._count.participations
      : null;

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Back Nav */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copySuccess ? "Copied!" : "Share"}
            </button>
            {(isOrganizer || isAdmin) && (
              <Link
                href={`/dashboard/my-events/${event.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Event
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <ImageGallery images={event.images} title={event.title} />

            {/* Title & Meta */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                  {event.category.icon} {event.category.name}
                </span>
                {event.isFeatured && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">⭐ Featured</span>
                )}
                {event.isOnline && (
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Online
                  </span>
                )}
                {event.type === "PRIVATE" && (
                  <span className="px-2.5 py-1 bg-gray-800 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Private
                  </span>
                )}
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    isUpcoming
                      ? "bg-green-100 text-green-700"
                      : isCancelled
                      ? "bg-red-100 text-red-700"
                      : isCompleted
                      ? "bg-gray-100 text-gray-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                {event.title}
              </h1>

              {event.shortDescription && (
                <p className="text-gray-500 text-base mb-4">{event.shortDescription}</p>
              )}

              {/* Rating */}
              {event.totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarDisplay rating={event.averageRating} size="md" />
                  <span className="text-sm font-bold text-gray-800">{event.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({event.totalReviews} reviews)</span>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow icon={<Calendar className="w-4 h-4 text-primary-500" />}>
                  {new Date(event.date).toLocaleDateString("en-BD", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </InfoRow>
                <InfoRow icon={<Clock className="w-4 h-4 text-primary-500" />}>{event.time}</InfoRow>
                <InfoRow icon={<MapPin className="w-4 h-4 text-primary-500" />}>
                  <span className="line-clamp-1">{event.venue}</span>
                </InfoRow>
                <InfoRow icon={<Users className="w-4 h-4 text-primary-500" />}>
                  {event._count.participations} joined
                  {spotsLeft !== null && (
                    <span className={`ml-1 text-xs ${spotsLeft <= 5 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                      ({spotsLeft <= 0 ? "Full" : `${spotsLeft} spots left`})
                    </span>
                  )}
                </InfoRow>
                {event.isOnline && (
                  <InfoRow icon={<Globe className="w-4 h-4 text-blue-500" />}>Online Event</InfoRow>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">About This Event</h2>
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Reviews <span className="text-gray-400 font-normal text-sm">({event.totalReviews})</span>
                </h2>
                {canReview && !myReview && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* My Review */}
              {myReview && (
                <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">Your Review</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(myReview.id)}
                        disabled={deletingReview}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                  <StarDisplay rating={myReview.rating} />
                  <p className="text-sm text-gray-700 mt-2">{myReview.comment}</p>
                </div>
              )}

              {/* All Reviews */}
              {event.reviews.length === 0 ? (
                <div className="text-center py-10">
                  <Star className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {event.reviews.map((review) => (
                    <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name}
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600 flex-shrink-0">
                            {review.user.name[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{review.user.name}</p>
                          <StarDisplay rating={review.rating} />
                        </div>
                        <span className="ml-auto text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed pl-12">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN (Sticky Sidebar) ─────────────────── */}
          <div className="space-y-5">
            {/* Action Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-[65px]">
              {/* Price */}
              <div className="mb-5">
                <span className={`text-3xl font-extrabold ${isFree ? "text-green-600" : "text-primary-600"}`}>
                  {isFree ? "Free" : `৳${event.registrationFee}`}
                </span>
                {!isFree && <span className="text-gray-400 text-sm ml-1">/ person</span>}
              </div>

              {/* Participation Status */}
              {isJoined && myParticipation && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold text-green-700">You&apos;re Registered!</span>
                  </div>
                  {myParticipation.ticketNumber && (
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                      <Ticket className="w-3 h-3" />
                      <span className="font-mono font-bold">{myParticipation.ticketNumber}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      myParticipation.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {myParticipation.status}
                    </span>
                    {!isFree && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        myParticipation.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {myParticipation.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Cancelled Notice */}
              {isCancelled && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-600 font-medium">This event has been cancelled</span>
                </div>
              )}

              {/* Full Notice */}
              {spotsLeft !== null && spotsLeft <= 0 && !isJoined && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-sm text-orange-600 font-medium">Event is full</span>
                </div>
              )}

              {/* Join Button */}
              {!currentUser ? (
                <Link
                  href="/login"
                  className="block w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-center rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary-200"
                >
                  Login to Register
                </Link>
              ) : canJoin && (spotsLeft === null || spotsLeft > 0) ? (
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary-200"
                >
                  {isFree ? "Join for Free" : `Register — ৳${event.registrationFee}`}
                </button>
              ) : isCompleted && !myReview && isJoined ? (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
                >
                  ⭐ Leave a Review
                </button>
              ) : (
                <div className="w-full py-3.5 bg-gray-100 text-gray-500 font-medium text-center rounded-xl text-sm">
                  {isCancelled
                    ? "Event Cancelled"
                    : isCompleted
                    ? "Event Completed"
                    : isJoined
                    ? "Already Registered"
                    : "Registration Closed"}
                </div>
              )}

              {/* Quick Info */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium text-gray-800">
                    {new Date(event.date).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span className="font-medium text-gray-800">{event.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type</span>
                  <span className="font-medium text-gray-800">{event.type}</span>
                </div>
                {event.maxParticipants && event.maxParticipants > 0 ? (
                  <div className="flex justify-between">
                    <span>Capacity</span>
                    <span className={`font-medium ${spotsLeft !== null && spotsLeft <= 5 ? "text-red-500" : "text-gray-800"}`}>
                      {event._count.participations} / {event.maxParticipants}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Organizer</h3>
              <div className="flex items-center gap-3">
                {event.organizer.image ? (
                  <Image
                    src={event.organizer.image}
                    alt={event.organizer.name}
                    width={44}
                    height={44}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-lg font-bold text-primary-600">
                    {event.organizer.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{event.organizer.name}</p>
                  <p className="text-xs text-gray-400">{event.organizer.email}</p>
                </div>
              </div>
            </div>

            {/* Related Category */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Category</h3>
              <Link
                href={`/events?categorySlug=${event.category.slug}`}
                className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors font-medium text-sm"
              >
                <span>{event.category.icon}</span>
                <span>{event.category.name}</span>
                <span className="ml-auto text-xs text-primary-400">Browse →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showJoinModal && event && (
        <JoinEventModal
          event={event}
          onClose={() => setShowJoinModal(false)}
          onSuccess={() => {
            setShowJoinModal(false);
            fetchEvent();
            fetchMyParticipation(event.id);
          }}
        />
      )}

      {showReviewModal && event && (
        <ReviewModal
          eventId={event.id}
          eventTitle={event.title}
          existingReview={myReview}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            fetchEvent();
          }}
        />
      )}
    </div>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}