"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@workspace/ui/components/carousel"
import { cn } from "@workspace/ui/lib/utils";
import { SanityImage } from "../sanity-image"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

import type { PagebuilderType } from "@/types"

import { LogoCard } from "../logo-card";

export type LogoCloudProps = PagebuilderType<"logoClouds"> & {
  autoScroll?: boolean
  scrollSpeed?: "slow" | "medium" | "fast"
  showControls?: boolean
  showGradientEdges?: boolean
  logoHoverEffect?: boolean;
} 

export function LogoCloud({ title, logos,  autoScroll = true,
  scrollSpeed = "medium",
  showControls = false,
  showGradientEdges = true,
  logoHoverEffect = true, }: LogoCloudProps) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [api, setApi] = useState<any>()

  // Set up auto-scrolling
  useEffect(() => {
    if (!api || !autoScroll) return

    const speedMap = {
      slow: 5000,
      medium: 3000,
      fast: 1500,
    }

    const interval = setInterval(() => {
      if (inView) {
        api.scrollNext()
      }
    }, speedMap[scrollSpeed])

    return () => clearInterval(interval)
  }, [api, autoScroll, inView, scrollSpeed])

  // Calculate items per view based on screen size
  const getItemsPerView = () => {
    if (isMobile) return 2
    return 5
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
      <section ref={ref} className="py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="container flex flex-col items-center text-center">
        <motion.h2
          className="mb-8 text-2xl font-bold text-pretty md:text-3xl lg:text-4xl"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={titleVariants}
        >
          {title}
        </motion.h2>
      </div>

      <div className="pt-6 md:pt-10">
        <div className="relative mx-auto flex items-center justify-center max-w-7xl px-4">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              skipSnaps: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
                   <CarouselContent className="ml-0">
              {logos?.map((logo, index) => (
                <CarouselItem
                  key={logo._key}
                  className={cn("flex justify-center pl-0", `basis-1/${Math.min(logos.length, getItemsPerView())}`)}
                >
                  <motion.div
                    className="mx-4 sm:mx-6 md:mx-8 flex shrink-0 items-center justify-center p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={logoHoverEffect ? { scale: 1.05, filter: "grayscale(0)" } : {}}
                  >
                    <LogoCard key={logo._key} logo={logo} logoHoverEffect={logoHoverEffect} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {showControls && (
              <>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </>
            )}
          </Carousel>

          {showGradientEdges && (
            <>
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}