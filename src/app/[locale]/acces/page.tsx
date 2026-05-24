import { setRequestLocale } from "next-intl/server";
import { PricingCards } from "@/components/acces/PricingCards";

export default async function AccesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-i23-turquoise font-semibold text-sm tracking-wide uppercase mb-2">
            Accès i+
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-i23-gris-fonce">
            Choisis ton forfait
          </h1>
        </div>
        <PricingCards />
      </div>
    </div>
  );
}
