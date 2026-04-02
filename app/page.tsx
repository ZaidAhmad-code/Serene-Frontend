"use client";

import React from "react";
import IntroAnimation from "@/components/landingpage/Hero";
import { InfiniteTextMarquee } from "@/components/landingpage/InfiniteText";
import Features from "@/components/landingpage/Features";
import HowItWorks from "@/components/landingpage/Howitworks";
import About from "@/components/landingpage/About";

const Page = () => {
  return (
    <main>
      {/*
        ✅ FIX: overflow-hidden keeps the hero self-contained.
        IntroAnimation uses a virtual scroll (wheel hijack) internally.
        This div acts as a sealed viewport for that — wheel events inside
        stay inside, and the page can scroll past this block normally.
      */}
      <div className="h-screen w-full overflow-hidden relative">
        <IntroAnimation />
      </div>

      {/*
        ✅ FIX: Marquee is now normal page flow.
        Once the user finishes the hero animation (virtualScroll hits MAX),
        the wheel event is released and the page scrolls here naturally.
      */}
      <section className="w-full overflow-x-hidden  border-stone-200 bg-[#FAFAFA]">
        <InfiniteTextMarquee
          text="Serene AI"
          speed={20}
          tooltipText="Always here for you 🌿"
          fontSize="8rem"
          textColor="#1c1917"
          hoverColor="#059669"
          showTooltip={true}
        />
      </section>
      <Features />
      <HowItWorks />
      <About />
    </main>
  );
};

export default Page;
