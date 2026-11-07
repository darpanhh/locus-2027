import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

// Lazy-load Three.js wireframe so the huge three.js library isn't in the initial bundle
const WireframeSphere = lazy(() => import("./wireframe"));

const LocusDirectors = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only render WireframeSphere when it scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4">
             
             
             
             {/* <WireframeSphere /> */}

         
         {/* <div className="h-[40vw] w-[40vw] my-auto ">  */}
            {isVisible ? (
              <Suspense fallback={<div className="w-full h-full min-h-[300px]" />}>
                <WireframeSphere />
              </Suspense>
            ) : (
              <div className="w-full h-full min-h-[300px]" />
            )}
         {/* </div>  */}
         <div className="my-auto max-w-[50svw] space-y-4">
           <h2 className="text-xl sm:text-6xl lg:text-7xl tracking-tight ">
             <span className="text-primary">LOCUS </span>
             <span className="text-white">2027 </span>
             <span className="text-primary">Marvels </span>
             <span className="text-white">all </span>
             <span className="text-white">across </span>
             {/* <span className="text-white">the </span> */}
             <span className="text-primary">the </span>
             <span className="text-white">country </span>
           </h2>
         </div>
       </div>
     </div>
  )
}

export default LocusDirectors
