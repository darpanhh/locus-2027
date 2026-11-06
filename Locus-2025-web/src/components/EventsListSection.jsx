import React, { useMemo } from "react";
import { eventsData } from "../data/eventDetails";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

const EventsListSection = ({ numEventsToShow = eventsData.length }) => {
  const sortedEvents = useMemo(() => {
    const parseDate = (dateString) => {
      if (!dateString) return new Date(0);
      const cleanedDate = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");
      const parsed = new Date(cleanedDate);
      return isNaN(parsed.getTime()) ? new Date(0) : parsed;
    };

    return [...eventsData].sort((a, b) => {
      // Push 'Closed' events to the bottom
      if (a.event_type.status === "Closed" && b.event_type.status !== "Closed") {
        return 1;
      }
      if (a.event_type.status !== "Closed" && b.event_type.status === "Closed") {
        return -1;
      }

      // Prioritize 'Active' status
      if (a.event_type.status === "Active" && b.event_type.status !== "Active") {
        return -1;
      }
      if (a.event_type.status !== "Active" && b.event_type.status === "Active") {
        return 1;
      }

      // If status is the same, sort by start_date in descending order
      const dateA = parseDate(a.date_and_time?.start_date);
      const dateB = parseDate(b.date_and_time?.start_date);

      return dateB - dateA;
    });
  }, []);

  const eventsToDisplay = sortedEvents.slice(0, numEventsToShow);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12'>
      {eventsToDisplay.map((event) => {
        const isClosed = event.event_type.status === "Closed";
        const CardWrapper = isClosed ? "div" : Link;
        const cardProps = isClosed ? {} : { to: `/event/${event.title}` };

        return (
          <CardWrapper
            key={event.id}
            {...cardProps}
            className={`relative w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg ${isClosed ? "cursor-not-allowed" : ""}`}
          >
            <div className='aspect-w-5 aspect-h-5 bg-gray-900'>
              <img
                src={getImageUrl(event.imgSrc)}
                alt={`Event ${event.title}`}
                loading='lazy'
                decoding='async'
                referrerPolicy='no-referrer'
                className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {/* Dark gradient overlay to make buttons legible over any image */}
            <div className='absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none' />

            {/* Floating Buttons */}
            <div className='absolute bottom-4 left-4 right-4 flex justify-between items-center z-10'>
              {event.event_type.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-md ${
                    event.event_type.status === "Coming Soon" ||
                    event.event_type.status === "Open"
                      ? "bg-[#d946ef]/25 text-[#f0abfc] border-[#d946ef]/60"
                      : event.event_type.status === "Active" ||
                          event.event_type.status === "Ongoing"
                        ? "bg-fuchsia-500/25 text-fuchsia-200 border-fuchsia-500/60"
                        : "bg-zinc-800/80 text-zinc-300 border-zinc-600/60"
                  }`}
                >
                  {event.event_type.status}
                </span>
              )}
              {!isClosed && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-white bg-black/70 hover:bg-[#d946ef] border border-white/30 hover:border-[#d946ef] backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 ${
                    !event.event_type.status ? "ml-auto" : ""
                  }`}
                >
                  More
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default React.memo(EventsListSection);
