import { Feature } from "@/types/feature";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph } = feature;
  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        <div className="bg-gray-500 hover:bg-gray-400 text-gray-100  mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md">
          {icon}
        </div>
        <h3 className="mb-5 text-xl font-bold text-gray-700 hover:text-gray-500 sm:text-2xl lg:text-xl xl:text-2xl">
          {title}
        </h3>
        <p className="text-body-color text-gray-700 hover:text-gray-500 pr-[10px] text-base leading-relaxed font-medium">
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SingleFeature;
