"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@workspace/ui/components/carousel"
import { cn } from "@workspace/ui/lib/utils";
import { SanityImage } from "../sanity-image"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

import type { PagebuilderType } from "@/types"

import { LogoCard } from "../logo-card";

export type LogoCloudProps = PagebuilderType<"logoClouds">;

export function LogoCloud({ title, logos }: LogoCloudProps) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

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
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {logos?.map((logo) => (
              <LogoCard key={logo._key} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

