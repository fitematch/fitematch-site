import Brands from "../Brands";
import SectionTitle from "../Common/SectionTitle";
import { Locale } from "@/i18n/config";
import { getServerDictionary } from "@/i18n/server";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = async ({
  locale,
}: Readonly<{
  locale?: Locale;
}>) => {
  const { dictionary } = await getServerDictionary(locale);
  const items = featuresData(dictionary);

  return (
    <section id="features" className="bg-gray-200 py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title={dictionary.features.title}
            paragraph={dictionary.features.paragraph}
            center
          />
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {items.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
        <Brands />
      </section>
  );
};

export default Features;
