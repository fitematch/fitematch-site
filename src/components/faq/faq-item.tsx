import { motion } from 'framer-motion';
import { FAQ_STYLES } from '@/constants/styles';

interface FaqItemProps {
  question: string;
  answer: string;
  index?: number;
}

export function FaqItem({ question, answer, index = 0 }: FaqItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={`${FAQ_STYLES.box} overflow-hidden rounded-2xl shadow-[0_18px_48px_rgba(0,0,0,0.32)] transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.06),0_18px_48px_rgba(0,0,0,0.34),0_0_24px_rgba(34,197,94,0.06)]`}
    >
      <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      <h3 className={FAQ_STYLES.boxTitle}>{question}</h3>

      <p className={`mt-3 leading-6 ${FAQ_STYLES.boxText}`}>{answer}</p>
    </motion.div>
  );
}
