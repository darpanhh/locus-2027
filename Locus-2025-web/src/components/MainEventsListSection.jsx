import React, { useMemo } from "react";
import { mainEventsData } from "../data/eventDetails";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

const MainEventsListSection = ({ numEventsToShow = mainEventsData.length }) => {
  const sortedEvents = useMemo(() => {
    const parseDate = (dateString) => {
      if (!dateString) return new Date(0);
      const cleanedDate = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");
      const parsed = new Date(cleanedDate);
      return isNaN(parsed.getTime()) ? new Date(0) : parsed;
    };

    return [...mainEventsData].sort((a, b) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
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
            <div className="aspect-w-5 aspect-h-5 bg-gray-900">
              <img
                src={getImageUrl(event.imgSrc)}
                alt={`Event ${event.title}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {/* Soft gradient overlay for natural legibility */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {/* Floating Buttons */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex justify-between items-center z-10">
              {event.event_type.status && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-md border ${
                    event.event_type.status === "Coming Soon" || event.event_type.status === "Open"
                      ? "bg-black/60 text-purple-200/90 border-purple-400/25"
                      : event.event_type.status === "Active" || event.event_type.status === "Ongoing"
                      ? "bg-black/60 text-emerald-200/90 border-emerald-400/25"
                      : "bg-black/60 text-zinc-400 border-zinc-700/40"
                  }`}
                >
                  {event.event_type.status}
                </span>
              )}
              {!isClosed && (
                <span
                  className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-normal text-zinc-200 hover:text-white bg-black/60 hover:bg-black/80 border border-white/20 hover:border-white/40 backdrop-blur-md transition-colors ${
                    !event.event_type.status ? "ml-auto" : ""
                  }`}
                >
                  More
                  <span aria-hidden="true" className="text-zinc-400">→</span>
                </span>
              )}
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default React.memo(MainEventsListSection);
