import React from "react";
import { ExternalLink, Award } from "lucide-react";
import sponsor_data from "../data/sponsor_data.json";

function SponsorCard({ sponsor }) {
  const hasLink = Boolean(sponsor.sponsorlink && sponsor.sponsorlink.trim() !== "");
  const imageSrc = sponsor.image?.startsWith("/") ? sponsor.image : `/${sponsor.image}`;
  const displayRole =
    sponsor.subtitle ||
    (sponsor.sponsor_text && sponsor.sponsor_text.toLowerCase() !== "visit sponsor"
      ? sponsor.sponsor_text
      : null);

  return (
    <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-white/10 bg-[#14091a]/75 backdrop-blur-md p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-fuchsia-500/40 hover:bg-[#1a0c23]/85 hover:shadow-[0_14px_36px_rgba(217,70,239,0.15)] hover:-translate-y-1 transition-all duration-300">
      {/* Top Section: Logo & Titles */}
      <div className="flex flex-col items-center text-center">
        {/* Uniform Logo Showcase Box */}
        <div className="w-full h-36 rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 flex items-center justify-center relative overflow-hidden group-hover:bg-white/[0.07] group-hover:border-fuchsia-500/30 transition-all duration-300">
          <img
            src={imageSrc}
            alt={`${sponsor.sponsor_name} logo`}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Sponsor Name */}
        <h3
          className="mt-4 text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors line-clamp-1 w-full"
          title={sponsor.sponsor_name}
        >
          {sponsor.sponsor_name}
        </h3>

        {/* Role or Category Badge - fixed height for baseline alignment */}
        <div className="mt-2 h-7 flex items-center justify-center w-full px-1">
          {displayRole ? (
            <span
              className="inline-block max-w-full truncate px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 tracking-wide"
              title={displayRole}
            >
              {displayRole}
            </span>
          ) : (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-gray-500 border border-white/5 tracking-wide select-none">
              Partner
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Action Link / Status */}
      <div className="mt-5 pt-3 border-t border-white/5 w-full">
        {hasLink ? (
          <a
            href={sponsor.sponsorlink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-fuchsia-300 hover:text-white bg-fuchsia-500/10 hover:bg-fuchsia-500/25 border border-fuchsia-500/30 hover:border-fuchsia-400/60 transition-all duration-300 group/btn"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>
        ) : (
          <div className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-gray-500 bg-white/[0.02] border border-white/5 cursor-default select-none">
            <span>Official Partner</span>
          </div>
        )}
      </div>
    </div>
  );
}

const Sponsors = () => {
  // Group sponsors by normalized sponsor_title to preserve order and clean up spacing
  const groupedSponsors = sponsor_data.reduce((groups, sponsor) => {
    const rawTitle = sponsor.sponsor_title || "Partners";
    const title = rawTitle.trim().replace(/\s+/g, " ");
    if (!groups[title]) {
      groups[title] = [];
    }
    groups[title].push(sponsor);
    return groups;
  }, {});

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 text-white">
      {/* Page Header */}
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300 mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>Proud Supporters</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          LOCUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500">2026</span> Sponsors
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Empowering innovation, technology, and youth through our visionary sponsors and valued community partners.
        </p>
      </div>

      {/* Sponsor Groups */}
      <div className="space-y-12 md:space-y-16">
        {Object.entries(groupedSponsors).map(([sponsor_title, sponsors], index) => {
          const count = sponsors.length;
          // Determine uniform grid layout based on number of cards to prevent awkward spacing
          const gridClasses =
            count === 1
              ? "max-w-sm mx-auto"
              : count === 2
              ? "grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

          return (
            <section key={index} aria-label={sponsor_title}>
              {/* Category Divider with Glass Badge */}
              <div className="relative flex items-center justify-center my-8 md:my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />
                </div>
                <div className="relative px-5 py-1.5 rounded-full bg-[#14091a]/95 border border-fuchsia-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(217,70,239,0.12)]">
                  <h2 className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-fuchsia-300">
                    {sponsor_title}
                  </h2>
                </div>
              </div>

              {/* Grid of Sponsors */}
              <div className={gridClasses}>
                {sponsors.map((sponsor, idx) => (
                  <SponsorCard key={idx} sponsor={sponsor} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Sponsors;
