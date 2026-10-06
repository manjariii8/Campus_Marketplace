import { ArrowRight, ClipboardList, Search } from "lucide-react";
import { Link } from "react-router-dom";

import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhyChooseUs from "../components/home/WhyChooseUs";

const Home = () => {
  return (
    <main>

      <Hero />

      <Categories />

      <FeaturedProducts />

      <WhyChooseUs />

      {/* WANTED BOARD */}

      <section className="bg-white px-4 py-16 sm:py-20">

        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-14 lg:px-16">

            {/* Decorative elements */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-indigo-300/10 blur-3xl" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">

              <div className="max-w-2xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                    <ClipboardList size={22} />
                  </div>

                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-blue-100">
                    Wanted Board
                  </span>

                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  Can't find what you're looking for?
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-blue-100">
                  Post what you need, set your budget, and discover
                  matching listings from students in your campus
                  community.
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                <Link
                  to="/wanted"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Search
                    size={18}
                    className="mr-2"
                  />

                  Browse Requests

                  <ArrowRight
                    size={17}
                    className="ml-2"
                  />
                </Link>

                <Link
                  to="/wanted/create"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Post a Request
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Home;
