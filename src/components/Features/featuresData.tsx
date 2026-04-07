import Link from "next/link";
import { Feature } from "@/types/feature";
import { CiSearch } from "react-icons/ci";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { AiOutlineAlert } from "react-icons/ai";
import { IoLogoAndroid } from "react-icons/io";
import { FaApple } from "react-icons/fa";
import { Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";


type Dictionary = (typeof dictionaries)[Locale];

const featuresData = (dictionary: Dictionary): Feature[] => [
  {
    id: 1,
    icon: <CiSearch size={40} />,
    title: dictionary.features.items[0].title,
    paragraph: <>{dictionary.features.items[0].paragraph}</>,
  },
  {
    id: 2,
    icon: <MdFormatListBulletedAdd size={40} />,
    title: dictionary.features.items[1].title,
    paragraph: <>{dictionary.features.items[1].paragraph}</>,
  },
  {
    id: 3,
    icon: <FaExchangeAlt size={40} />,
    title: dictionary.features.items[2].title,
    paragraph: <>{dictionary.features.items[2].paragraph}</>,
  },
  {
    id: 4,
    icon: <AiOutlineAlert size={40} />,
    title: dictionary.features.items[3].title,
    paragraph: <>{dictionary.features.items[3].paragraph}</>,
  },
  {
    id: 5,
    icon: <IoLogoAndroid size={40} />,
    title: dictionary.features.items[4].title,
    paragraph:
      <>
        {dictionary.features.items[4].paragraph.replace("Play Store para download.", "")}{" "}
        <Link href="/#" className="text-primary hover:opacity-80">
          Play Store
        </Link>.
      </>
  },
  {
    id: 6,
    icon: <FaApple size={40} />,
    title: dictionary.features.items[5].title,
    paragraph:
      <>
        {dictionary.features.items[5].paragraph.replace("Apple Store para download.", "")}{" "}
        <Link href="/#" className="text-primary hover:opacity-80">
          Apple Store
        </Link>.
      </>
  },
];
export default featuresData;
