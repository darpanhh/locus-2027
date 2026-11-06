import React from "react";
import sponsor_data from "../data/sponsor_data.json";

const Sponsors = () => {
  // Group sponsors by sponsor_title
  const groupedSponsors = sponsor_data.reduce((groups, sponsor) => {
    const { sponsor_title } = sponsor;
    if (!groups[sponsor_title]) {
      groups[sponsor_title] = [];
    }
    groups[sponsor_title].push(sponsor);
    return groups;
  }, {});

  const getImgSrc = (src) => {
    if (!src) return "";
    return src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;
  };

  return (
    <div className="text-center text-white py-6 md:py-10 px-2 sm:px-4 w-full">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          Locus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f0abfc] via-[#d946ef] to-[#c026d3]">2026</span> Sponsors
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
          Proudly supported by our visionary partners and sponsors empowering technology and innovation.
        </p>
      </div>

      {/* Iterate through sponsor groups */}
      {Object.keys(groupedSponsors).map((sponsor_title, index) => (
        <div key={index} className="mb-16">
          {/* Elegant Section Divider with Neon Gradient */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#d946ef]/50 max-w-xs" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#f0abfc] to-[#d946ef] px-3">
              {sponsor_title}
            </h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#d946ef]/50 max-w-xs" />
          </div>

          {/* Responsive Sponsors Grid with Modern Glassmorphism */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groupedSponsors[sponsor_title].map((sponsor, idx) => {
              const imgSrc = getImgSrc(sponsor.image);
              const hasLink = Boolean(sponsor.sponsorlink && sponsor.sponsorlink.trim());

              return (
                <div
                  key={idx}
                  className="group relative bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-[#d946ef]/50 rounded-2xl p-5 shadow-lg hover:shadow-[0_0_25px_rgba(217,70,239,0.18)] transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
                >
                  {/* Sponsor Logo Container */}
                  <a
                    href={hasLink ? sponsor.sponsorlink : undefined}
                    target={hasLink ? "_blank" : undefined}
                    rel={hasLink ? "noopener noreferrer" : undefined}
                    className={`flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center p-3 rounded-xl bg-white/[0.07] border border-white/10 group-hover:bg-white/[0.12] transition-colors duration-300 ${!hasLink ? "cursor-default" : ""}`}
                  >
                    <img
                      src={imgSrc}
                      alt={`${sponsor.sponsor_name || sponsor.name} logo`}
                      loading="lazy"
                      decoding="async"
                      className="max-w-full max-h-full object-contain filter drop-shadow transition-transform duration-300 group-hover:scale-105"
                    />
                  </a>

                  {/* Sponsor Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#f0abfc] transition-colors truncate">
                      {sponsor.sponsor_name}
                    </h3>

                    {sponsor.subtitle && (
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
                        {sponsor.subtitle}
                      </p>
                    )}

                    {hasLink ? (
                      <a
                        href={sponsor.sponsorlink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs sm:text-sm font-medium text-[#d946ef] hover:text-[#f0abfc] transition-colors hover:underline"
                      >
                        {sponsor.sponsor_text || "Visit Sponsor"}
                        <span aria-hidden="true">→</span>
                      </a>
                    ) : sponsor.sponsor_text ? (
                      <span className="inline-block mt-3 text-[11px] uppercase tracking-wider text-gray-400 font-medium px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {sponsor.sponsor_text}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sponsors;
