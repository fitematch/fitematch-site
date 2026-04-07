"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({
  items,
}: Readonly<{
  items: FaqItem[];
}>) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="rounded-xs border border-gray-200 bg-white p-6"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="text-base font-semibold text-black md:text-lg">
                {item.question}
              </span>
              <span
                className={`text-xl text-gray-500 transition-transform ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            {isOpen ? (
              <p className="text-body-color mt-4 text-base leading-relaxed">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
