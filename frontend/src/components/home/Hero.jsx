import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  MapPin,
  Recycle,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";

import { HERO_CONTENT } from "../../utils/constants";

const Hero = () => {
  const shopPath =
    HERO_CONTENT?.buttons?.shop?.path || "/products";

  const sellerPath =
    HERO_CONTENT?.buttons?.seller?.path || "/seller";

  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute right-[-10%] top-[5%] h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute bottom-[-20%] left-[35%] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(59,130,246,0.14),transparent_35%)]" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-7xl -translate-y-3 px-5 py-12 sm:-translate-y-4 sm:px-8 sm:py-16 lg:-translate-y-5 lg:px-10 lg:py-20">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur">
              <BadgeCheck size={17} />
              Campus-Verified Marketplace
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Buy, sell &{" "}
              <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                reuse
              </span>
              <br />
              within your campus.
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Discover affordable academic and hostel essentials from
              students around you. Sell what you no longer need and find
              useful items without leaving your campus community.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={shopPath}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-slate-900 shadow-xl shadow-blue-950/30 transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
              >
                Explore Campus Listings

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to={sellerPath}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <Store size={18} />
                Sell an Item
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <TrustPoint
                icon={<BadgeCheck size={17} />}
                title="Campus Verified"
              />

              <TrustPoint
                icon={<MapPin size={17} />}
                title="Easy Pickup"
              />

              <TrustPoint
                icon={<Recycle size={17} />}
                title="Reuse First"
              />
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE
              
              IMPORTANT:
              NO OVERLAPPING ABSOLUTE FLOATING CARDS.
              
              Everything is placed using a 3-column grid:
              
                  CARD | MAIN | CARD
                  CARD | MAIN | CARD
              
              ====================================================== */}
          <div className="w-full">
            <div className="grid grid-cols-[minmax(90px,0.7fr)_minmax(220px,1.8fr)_minmax(90px,0.7fr)] items-center gap-3 sm:gap-5">
              
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-5">
                <FloatingCard
                  icon={<BadgeCheck size={18} />}
                  label="Community"
                  title="Campus Verified"
                  animation="heroFloatA"
                />

                <FloatingCard
                  icon={<Sparkles size={18} />}
                  label="Wanted Board"
                  title="Post a Request"
                  animation="heroFloatB"
                />
              </div>

              {/* CENTER */}
              <div className="relative">
                {/* Glow behind main card */}
                <div className="absolute inset-8 rounded-[3rem] bg-blue-500/20 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">
                  
                  {/* Top header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 sm:text-xs">
                        CampusLoop
                      </p>

                      <h2 className="mt-1 text-base font-bold text-white sm:text-lg">
                        Marketplace
                      </h2>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-blue-300 sm:h-11 sm:w-11">
                      <ShoppingBag size={19} />
                    </div>
                  </div>

                  {/* Main product */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent p-4 sm:p-6">
                    <div className="flex justify-center">
                      <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-xl sm:h-36 sm:w-36">
                        <BookOpen
                          size={52}
                          strokeWidth={1.5}
                          className="text-blue-600 sm:h-16 sm:w-16"
                        />

                        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 shadow-lg">
                          <BadgeCheck size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-white sm:text-base">
                            Academic Essentials
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                            Available from students on your campus
                          </p>
                        </div>

                        <span className="shrink-0 rounded-lg bg-emerald-400/15 px-2.5 py-1.5 text-[10px] font-bold text-emerald-300 sm:text-xs">
                          AVAILABLE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <InfoPill
                      icon={<MapPin size={14} />}
                      title="Pickup"
                      value="On Campus"
                    />

                    <InfoPill
                      icon={<Recycle size={14} />}
                      title="Purpose"
                      value="Reuse"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-5">
                <FloatingCard
                  icon={<Store size={18} />}
                  label="Seller"
                  title="Sell Your Items"
                  animation="heroFloatC"
                />

                <FloatingCard
                  icon={<MapPin size={18} />}
                  label="Pickup"
                  title="Meet On Campus"
                  animation="heroFloatD"
                />
              </div>
            </div>

            {/* Bottom caption */}
            <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 text-center text-xs text-slate-400 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              A student-first marketplace built around campus reuse.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />

      {/* Animations */}
      <style>{`
        @keyframes heroFloatA {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes heroFloatB {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(7px);
          }
        }

        @keyframes heroFloatC {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        @keyframes heroFloatD {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-floating-card {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

/* ================================================================
   FLOATING CARD
================================================================ */

const FloatingCard = ({
  icon,
  label,
  title,
  animation,
}) => {
  return (
    <div
      className="hero-floating-card w-full"
      style={{
        animation: `${animation} 5s ease-in-out infinite`,
      }}
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-2.5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-blue-300/30 hover:bg-white/10 sm:p-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300 sm:h-10 sm:w-10">
            {icon}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[9px] font-medium text-slate-400 sm:text-[10px]">
              {label}
            </p>

            <p className="mt-0.5 text-[10px] font-bold leading-tight text-white sm:text-xs">
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   INFO PILL
================================================================ */

const InfoPill = ({ icon, title, value }) => {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-2.5 py-2.5">
      <span className="shrink-0 text-blue-300">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[9px] text-slate-500">
          {title}
        </p>

        <p className="truncate text-[10px] font-semibold text-white sm:text-xs">
          {value}
        </p>
      </div>
    </div>
  );
};

/* ================================================================
   TRUST POINT
================================================================ */

const TrustPoint = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200 backdrop-blur-sm">
      <span className="text-blue-300">
        {icon}
      </span>

      <span className="font-medium">
        {title}
      </span>
    </div>
  );
};

export default Hero;