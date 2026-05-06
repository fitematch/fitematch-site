import { FAQ_STYLES } from '@/constants/styles';

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div
      className={`${FAQ_STYLES.box} overflow-hidden rounded-2xl shadow-[0_18px_48px_rgba(0,0,0,0.32)] transition`}
    >
      <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      <h3 className={FAQ_STYLES.boxTitle}>
        {question}
      </h3>

      <p className={`mt-3 leading-6 ${FAQ_STYLES.boxText}`}>
        {answer}
      </p>
    </div>
  );
}
