import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

const SOCIAL_LINKS = [
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/locus_ioe/" },
  { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/locus.ioe" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/company/locusioe/" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='relative z-10 mt-20 border-t border-white/10 bg-[#08070d] text-zinc-400 overflow-hidden'>
      <div className='relative z-10 px-4 py-16 sm:py-24'>
        <div className='mx-auto grid max-w-7xl gap-12 px-4 sm:grid-cols-3 items-center'>
          <div className='flex flex-col items-center sm:items-start space-y-6'>
            <Link to='https://drive.google.com/file/d/1e_vjXg-iqrlAEXUfMFL5KzMUuN9pg1pF/view?usp=sharing' target='_blank' rel='noopener noreferrer'>
              <button className='px-8 py-3 bg-pink-500/10 text-pink-200 border border-pink-400/30 rounded-lg font-semibold text-sm uppercase tracking-wider transition-colors hover:bg-pink-500/20 hover:border-pink-300/50'>
                Prospectus
              </button>
            </Link>
            <Link to='https://discord.gg/locus' target='_blank' rel='noopener noreferrer'>
              <button className='px-8 py-3 bg-pink-500/10 text-pink-200 border border-pink-400/30 rounded-lg font-semibold text-sm uppercase tracking-wider transition-colors hover:bg-pink-500/20 hover:border-pink-300/50'>
                Join Discord
              </button>
            </Link>
            <div className='text-center sm:text-left space-y-3'>
              <h3 className='text-lg font-bold sm:text-xl font-arial tracking-[0.1em] text-white'>IOE PULCHOWK</h3>
              <div className='space-y-1 font-helvetica text-sm sm:text-base opacity-60'>
                <p>Pulchowk, Lalitpur</p>
                <p>Nepal</p>
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center group'>
            <img src='/assets/home/footer.png' alt='LOCUS 2026 Logo' className='h-36 w-auto object-contain transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 drop-shadow-[0_0_22px_rgba(244,114,182,0.2)]' />
          </div>
          <div className='flex flex-col items-center sm:items-end space-y-12'>
            <div className='text-center sm:text-right'>
              <h3 className='text-lg font-bold sm:text-xl font-arial tracking-[0.1em] text-white'>CONTACT US</h3>
              <a href='mailto:locus@ioe.edu.np' className='mt-3 text-sm sm:text-base flex items-center justify-center sm:justify-end gap-3 hover:text-pink-300 transition-colors duration-500 font-helvetica'>
                <Mail className='h-5 w-5' />
                <span className='tracking-wide'>locus@ioe.edu.np</span>
              </a>
            </div>
            <div className='text-center sm:text-right'>
              <h3 className='text-lg font-bold sm:text-xl font-arial tracking-[0.1em] text-pink-300'>FOLLOW US</h3>
              <div className='mt-5 flex justify-center gap-5 sm:justify-end'>
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link key={social.name} to={social.url} target='_blank' rel='noopener noreferrer' className='p-3.5 rounded-full bg-white/5 border border-pink-300/10 text-zinc-400 transition-all duration-500 hover:text-pink-200 hover:border-pink-300/40 hover:bg-pink-500/10 hover:-translate-y-1.5' title={social.name}>
                      <Icon className='h-5 w-5' />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='mx-auto mt-24 max-w-7xl border-t border-white/10 pt-12 font-helvetica flex flex-col sm:flex-row justify-between items-center gap-4 px-4'>
          <p className='flex items-center justify-center sm:justify-start gap-3 text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-zinc-500'>
            MADE WITH <span className='text-red-500 animate-pulse text-base sm:text-lg'>❤</span> BY LOST
          </p>
          <p className='text-[10px] sm:text-xs uppercase tracking-[0.3em] opacity-30 text-center sm:text-right'>
            ©COPYRIGHT 2027, PULCHOWK ENGINEERING CAMPUS
          </p>
        </div>
      </div>
    </footer>
  );
}
