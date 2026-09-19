"use client";

import Image from "next/image";
import { useMemo } from "react";
import icon from "../../../public/images/icon-vellatech.jpg";
import logo from "../../../public/images/logo-vellatech.png";

const STAR_COLORS = ["#C9A84C", "#D4A060", "#8B1A3A", "#E8C97A", "#b5883a"];

interface Star {
  left: number;
  bottom: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

function useStars(count: number): Star[] {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: 5 + Math.random() * 90,
        bottom: 4 + Math.random() * 40,
        delay: Math.random() * 5.5,
        duration: 2.8 + Math.random() * 3.5,
        size: 6 + Math.random() * 10,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      })),
    [count]
  );
}

export default function HeroBanner() {
  const stars = useStars(28);

  return (
    <section className="hero-banner relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-vella-cream px-6 py-16 text-center">
      <div className="icon-reveal absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden">
        <Image src={icon} alt="" fill className="object-cover" priority />
      </div>

      <div className="hero-content relative z-[2] flex flex-col items-center">
        <Image
          src={logo}
          alt="VellaTech — Tu belleza, nuestra pasión"
          className="h-auto w-[280px] max-w-[80vw]"
          priority
        />
        <div className="shimmer-bar my-3 h-[1.5px] rounded" />
        <h1 className="mb-2 font-serif text-xl italic text-vella-wine">
          Tu belleza, nuestra pasión
        </h1>
        <p className="max-w-md text-sm leading-7 text-vella-navy/80">
          Descubre productos seleccionados para tu rutina de belleza y cuidado
          personal.
        </p>
      </div>

      {stars.map((star, i) => (
        <div
          key={i}
          className="star-p absolute pointer-events-none"
          style={{
            left: `${star.left}%`,
            bottom: `${star.bottom}%`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 20 20">
            <path
              d="M10 0L11.9 8.1L20 10L11.9 11.9L10 20L8.1 11.9L0 10L8.1 8.1Z"
              fill={star.color}
            />
          </svg>
        </div>
      ))}

      <style jsx>{`
        .icon-reveal {
          opacity: 0;
          animation: iconReveal 3s ease forwards;
        }
        @keyframes iconReveal {
          0% {
            opacity: 0;
            filter: blur(0px) brightness(1.3);
            transform: translate(-50%, -50%) scale(1.2);
          }
          20% {
            opacity: 0.9;
            filter: blur(0px) brightness(1.05);
            transform: translate(-50%, -50%) scale(1.04);
          }
          65% {
            opacity: 0.5;
            filter: blur(8px) brightness(1.4);
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 0;
            filter: blur(22px) brightness(2);
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
        .hero-content {
          opacity: 0;
          animation: contentIn 1.1s ease 2.5s forwards;
        }
        @keyframes contentIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .shimmer-bar {
          width: 0;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          animation: expandBar 1s ease 3.1s forwards;
        }
        @keyframes expandBar {
          to {
            width: 260px;
          }
        }
        .star-p {
          opacity: 0;
          animation-name: starFloat;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes starFloat {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.4) rotate(0deg);
          }
          15% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.4) rotate(45deg);
          }
        }
      `}</style>
    </section>
  );
}
