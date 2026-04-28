interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="rounded-xl border border-gray-900 bg-black p-5">
      <h3 className="text-lg font-semibold text-gray-100">
        {question}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-700">
        {answer}
      </p>
    </div>
  );
}