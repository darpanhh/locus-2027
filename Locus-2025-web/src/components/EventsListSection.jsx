import React from "react";
import { eventsData } from "../data/eventDetails";
import { Link } from "react-router-dom";

const EventsListSection = ({ numEventsToShow = eventsData.length }) => {
  // Helper function to convert Google Drive links to direct image URLs
  const getImageUrl = (url) => {
    if (!url) return url;

    // Extract file ID from various Google Drive URL formats
    let fileId = null;

    // Format 1: /d/{FILE_ID}
    const driveMatch1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch1) {
      fileId = driveMatch1[1];
    }

    // Format 2: id={FILE_ID} or ?id={FILE_ID}
    const driveMatch2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch2) {
      fileId = driveMatch2[1];
    }

    // If we found a Google Drive file ID, use the thumbnail endpoint
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    return url;
  };

  const sortedEvents = [...eventsData].sort((a, b) => {
    // Helper function to clean and parse dates
    const parseDate = (dateString) => {
      // Remove ordinal suffixes (st, nd, rd, th)
      const cleanedDate = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");
      // Parse cleaned date
      return new Date(cleanedDate);
    };

    // Push 'Closed' events to the bottom
    if (a.event_type.status === "Closed" && b.event_type.status !== "Closed") {
      return 1; // 'a' goes to bottom
    }
    if (a.event_type.status !== "Closed" && b.event_type.status === "Closed") {
      return -1; // 'b' goes to bottom
    }

    // Prioritize 'Active' status
    if (a.event_type.status === "Active" && b.event_type.status !== "Active") {
      return -1; // 'a' comes first
    }
    if (a.event_type.status !== "Active" && b.event_type.status === "Active") {
      return 1; // 'b' comes first
    }

    // If status is the same, sort by start_date in descending order
    const dateA = parseDate(a.date_and_time.start_date);
    const dateB = parseDate(b.date_and_time.start_date);

    return dateB - dateA; // Descending order
  });

  // Slice the array to display only the number of events defined in numEventsToShow
  const eventsToDisplay = sortedEvents.slice(0, numEventsToShow);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12'>
      {eventsToDisplay.map((event) => {
        const isClosed = event.event_type.status === "Closed";
        const CardWrapper = isClosed ? 'div' : Link;
        const cardProps = isClosed ? {} : { to: `/event/${event.title}` };

        return (
          <CardWrapper
            key={event.id}
            {...cardProps}
            className={`group relative w-full mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-fuchsia-400/20 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(217,70,239,0.25)] hover:border-fuchsia-400/50 ${isClosed ? 'cursor-not-allowed' : ''}`}
          >
            <div className='aspect-w-5 aspect-h-5 bg-gray-900'>
              <img
                src={getImageUrl(event.imgSrc)}
                alt={`Event ${event.title}`}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
            </div>
            {/* Gradient overlay at bottom to ensure badges and buttons are distinct from the photo */}
            <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none' />
            {/* Floating Buttons */}
            <div className='absolute bottom-3.5 left-3.5 right-3.5 flex justify-between items-center z-10 gap-2'>
              {event.event_type.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm ${
                    event.event_type.status === "Coming Soon" ||
                    event.event_type.status === "Open" ||
                    event.event_type.status === "Upcoming"
                      ? "bg-[#d946ef]/20 text-[#d946ef] border-[#d946ef]/40"
                      : event.event_type.status === "Active" ||
                          event.event_type.status === "Ongoing"
                        ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40"
                        : "bg-zinc-700/60 text-zinc-300 border-zinc-600/40"
                  }`}
                >
                  {event.event_type.status}
                </span>
              )}
              {!isClosed && (
                <span
                  className='ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 border border-fuchsia-300/40 shadow-[0_4px_14px_rgba(217,70,239,0.45)] group-hover:shadow-[0_4px_20px_rgba(217,70,239,0.7)] group-hover:scale-105 active:scale-95 transition-all duration-300'
                >
                  <span>More</span>
                  <span className='transition-transform duration-300 group-hover:translate-x-0.5 font-bold'>→</span>
                </span>
              )}
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default EventsListSection;
