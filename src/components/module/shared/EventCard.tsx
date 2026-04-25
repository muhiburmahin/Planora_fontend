'use client';

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Star, Clock, Wifi } from "lucide-react";
import { Event } from "@/types/event";
import { EventStatus } from "@/types/enums";
import { formatDate } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
  variant?: "default" | "featured" | "compact";
}

// --- Helper Functions ---
const formatPrice = (price: number) => {
  return price === 0 ? "Free" : `$${price.toFixed(2)}`;
};

const getStatusColor = (status: EventStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'UPCOMING': return 'default';
    case 'ONGOING': return 'secondary';
    case 'CANCELLED': return 'destructive';
    case 'COMPLETED': return 'outline';
    default: return 'default';
  }
};

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const isPaid = event.registrationFee > 0;
  const isFull = event.maxParticipants
    ? (event._count?.participations || 0) >= event.maxParticipants
    : false;

  // 1. COMPACT VARIANT
  if (variant === "compact") {
    return (
      <Link href={`/events/${event.slug}`} className="group flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-purple-100 to-orange-100">
          {event.images?.[0] ? (
            <Image src={event.images[0].url} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-purple-600 font-medium mb-0.5">{event.category?.name}</p>
          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs font-bold ${isPaid ? "text-orange-500" : "text-green-600"}`}>
              {formatPrice(event.registrationFee)}
            </span>
            <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
          </div>
        </div>
      </Link>
    );
  }

  // 2. FEATURED VARIANT
  if (variant === "featured") {
    return (
      <Link href={`/events/${event.slug}`} className="group relative block rounded-3xl overflow-hidden h-80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-orange-50">
          {event.images?.[0] && (
            <Image src={event.images[0].url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {event.isFeatured && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              ⭐ Featured
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-xs text-purple-300 font-medium mb-1">{event.category?.name}</p>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">{event.title}</h3>
          <div className="flex items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(event.date)}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className={`text-sm font-bold ${isPaid ? "text-orange-400" : "text-green-400"}`}>
              {formatPrice(event.registrationFee)}
            </span>
            {event.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-orange-400 fill-current" />
                <span className="text-white text-xs">{event.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // 3. DEFAULT VARIANT
  return (
    <Link href={`/events/${event.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-50 transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-purple-50 to-orange-50 overflow-hidden">
        {event.images?.[0] ? (
          <Image src={event.images[0].url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-purple-200" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
          {event.isOnline && (
            <Badge variant="outline" className="flex items-center gap-1 bg-white">
              <Wifi className="w-3 h-3" /> Online
            </Badge>
          )}
        </div>
        {isFull && <div className="absolute top-3 right-3"><Badge variant="destructive">Full</Badge></div>}
        {event.isFeatured && <div className="absolute bottom-3 left-3"><span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">⭐ Featured</span></div>}
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-0.5 rounded-full">{event.category?.name}</span>
          {event.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(event.averageRating) ? 'text-secondary-500 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({event.totalReviews})</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">{event.title}</h3>
        {event.shortDescription && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.shortDescription}</p>}

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>{formatDate(event.date)}</span>
            <Clock className="w-3.5 h-3.5 text-purple-400 ml-1" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="truncate">{event.isOnline ? "Online Event" : event.venue}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className={`text-base font-bold ${isPaid ? "text-orange-500" : "text-green-600"}`}>
            {formatPrice(event.registrationFee)}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
              {event.organizer?.name?.[0] || 'U'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;