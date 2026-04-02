"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type InfiniteTextMarqueeProps = {
  text?: string;
  link?: string;
  speed?: number;
  showTooltip?: boolean;
  tooltipText?: string;
  fontSize?: string;
  textColor?: string;
  hoverColor?: string;
};

export const InfiniteTextMarquee: React.FC<InfiniteTextMarqueeProps> = ({
  text = "Let's Get Started",
  link = "/",
  speed = 30,
  showTooltip = true,
  tooltipText = "Time to Flex 💪",
  fontSize = "8rem",
  textColor = "",
  hoverColor = "",
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!showTooltip) return;
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      const midpoint = window.innerWidth / 2;
      const distance = Math.abs(e.clientX - midpoint);
      const rot = (distance / midpoint) * 8;
      setRotation(e.clientX > midpoint ? rot : -rot);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showTooltip]);

  const track = Array(12).fill(text).join(" — ") + " — ";

  return (
    <>
      {showTooltip && (
        <div
          className={`fixed z-[99] pointer-events-none select-none font-bold px-10 py-5 rounded-3xl whitespace-nowrap bg-stone-900 text-white transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            top: cursorPosition.y,
            left: cursorPosition.x,
            transform: `rotateZ(${rotation}deg) translate(-50%, -140%)`,
          }}
        >
          {tooltipText}
        </div>
      )}

      {/*
        ✅ FIX 1: w-vw is not a Tailwind class → w-full + overflow-hidden
        ✅ FIX 2: <style jsx> removed — not valid in App Router.
                  Hover color handled via React state + inline style.
        ✅ FIX 3: x:[0,-1000] (broken hardcoded px) → x:["0%","-50%"]
                  Two copies rendered; -50% = exactly one copy = seamless loop.
      */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        >
          {[0, 1].map((copy) => (
            <Link
              key={copy}
              href={link}
              aria-hidden={copy === 1 ? true : undefined}
              tabIndex={copy === 1 ? -1 : 0}
              className="shrink-0 no-underline"
            >
              <MarqueeText
                text={track}
                fontSize={fontSize}
                textColor={textColor}
                hoverColor={hoverColor}
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </>
  );
};

function MarqueeText({
  text,
  fontSize,
  textColor,
  hoverColor,
}: {
  text: string;
  fontSize: string;
  textColor: string;
  hoverColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer font-bold tracking-tight py-10 inline-block"
      style={{
        fontSize,
        color: hovered && hoverColor ? hoverColor : textColor || "inherit",
        transition: "color 0.25s ease",
      }}
    >
      {text}
    </span>
  );
}