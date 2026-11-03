import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar";
import BackgroundAnimation from "./components/ParticleAnimation/BackgroundAnimation";
import LocusEventPopup from "./components/popup/LocusEventPopup";
import ScrollToTop from "./components/ScrollToTop";
import { Footer } from "./components/footer/Footer";

const Layout = () => {
  return (
    <div className='relative isolate min-h-screen text-white flex flex-col'>
      <ScrollToTop />
      <Navbar />
      <BackgroundAnimation />
      {/* Added padding-top to account for fixed navbar */}
      <main className='relative z-10 flex-grow max-w-5xl w-full mx-auto px-4 pt-24 md:pt-28 lg:pt-32'>
        <Outlet />
      </main>
      <Footer />
      {/* <LocusEventPopup /> */}
    </div>
  );
};

export default Layout;
