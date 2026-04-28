import { CARD_STYLES, TEXT_STYLES } from '@/constants/styles';

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className={`${CARD_STYLES.featureBox} p-5`}>
      <h3 className={TEXT_STYLES.featureTitle}>
        {question}
      </h3>

      <p className={`mt-3 leading-6 ${TEXT_STYLES.featureText}`}>
        {answer}
      </p>
    </div>
  );
}
