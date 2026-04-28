import { FAQ_STYLES } from '@/constants/styles';

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className={FAQ_STYLES.box}>
      <h3 className={FAQ_STYLES.boxTitle}>
        {question}
      </h3>

      <p className={`mt-3 leading-6 ${FAQ_STYLES.boxText}`}>
        {answer}
      </p>
    </div>
  );
}
