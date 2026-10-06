import {
  Building2,
  ShieldCheck,
  MapPin,
  RefreshCcw,
} from "lucide-react";

import {
  Card,
  Container,
  SectionTitle,
} from "../ui";

const features = [
  {
    icon: Building2,
    title: "Campus Verified",
    desc: "Every account is associated with a campus, keeping the marketplace relevant to your student community.",
  },
  {
    icon: ShieldCheck,
    title: "Approved Sellers",
    desc: "Seller applications go through an approval workflow before students can list products.",
  },
  {
    icon: MapPin,
    title: "Campus Pickup",
    desc: "Listings can include convenient campus pickup locations for simple student-to-student exchange.",
  },
  {
    icon: RefreshCcw,
    title: "Reuse & Save",
    desc: "Give useful academic and hostel essentials a second life while helping students save money.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">

      <Container>

        <SectionTitle
          title="Why CampusLoop?"
          subtitle="A marketplace designed around the way students actually buy, sell, and reuse."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.desc}
                </p>

              </Card>
            );
          })}

        </div>

      </Container>

    </section>
  );
};

export default WhyChooseUs;
