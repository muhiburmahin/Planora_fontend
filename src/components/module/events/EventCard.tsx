"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Star, Tag, Wifi, Lock } from "lucide-react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    date: string;
    time: string;
    venue: string;
    isOnline: boolean;
    type: "PUBLIC" | "PRIVATE";
    registrationFee: number;
    status: string;
    isFeatured: boolean;
    averageRating: number;
    totalReviews: number;
    images: { url: string }[];
    category: { name: string; icon?: string };
    organizer: { name: string; image?: string };
    _count?: { participations: number };
  };
  variant?: "default" | "compact" | "featured";
}

export default function EventCard({ event, variant = "default" }: EventCardProps) {
  const coverImage = event.images?.[0]?.url || "/placeholder-event.svg";
  const isFree = event.registrationFee === 0;
  const isUpcoming = event.status === "UPCOMING";
  const isCancelled = event.status === "CANCELLED";

  if (variant === "compact") {
    return (
      <Link href={`/events/${event.slug}`} className="group flex gap-4 p-3 rounded-xl hover:bg-primary-50 transition-colors">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={coverImage} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary-600 font-semibold mb-1">{event.category.name}</p>
          <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{event.title}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(event.date).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}</span>
          </div>
          <span className={`mt-1 inline-block text-xs font-bold ${isFree ? "text-green-600" : "text-primary-600"}`}>
            {isFree ? "Free" : `৳${event.registrationFee}`}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article className={`relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 ${isCancelled ? "opacity-70" : ""}`}>
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={coverImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {event.isFeatured && (
              <span className="px-2 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">⭐ Featured</span>
            )}
            {isCancelled && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">Cancelled</span>
            )}
            {event.type === "PRIVATE" && (
              <span className="px-2 py-1 bg-gray-800/80 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Private
              </span>
            )}
            {event.isOnline && (
              <span className="px-2 py-1 bg-blue-500/90 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Wifi className="w-3 h-3" /> Online
              </span>
            )}
          </div>

          {/* Price */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${isFree ? "bg-green-500 text-white" : "bg-white text-primary-600"}`}>
              {isFree ? "Free" : `৳${event.registrationFee}`}
            </span>
          </div>

          {/* Category bottom left */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
              {event.category.icon} {event.category.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
            {event.title}
          </h3>

          {event.shortDescription && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.shortDescription}</p>
          )}

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
              <span>{new Date(event.date).toLocaleDateString("en-BD", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} • {event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {event.organizer.image ? (
                <Image src={event.organizer.image} alt={event.organizer.name} width={24} height={24} className="rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">
                  {event.organizer.name[0]}
                </div>
              )}
              <span className="text-xs text-gray-500 truncate max-w-[100px]">{event.organizer.name}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              {event.totalReviews > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {event.averageRating.toFixed(1)}
                </span>
              )}
              {event._count && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {event._count.participations}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}