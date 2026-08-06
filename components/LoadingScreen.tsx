'use client';

import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  visible?: boolean;
}

export default function LoadingScreen({
  title,
  subtitle,
  visible = true,
}: LoadingScreenProps) {
  const { t } = useLanguage();
  const resolvedTitle = title ?? t('common.loading');
  const resolvedSubtitle = subtitle ?? t('common.loadingSubtitle');
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#05111f]/70 px-4 text-white backdrop-blur-2xl ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,184,73,0.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.2),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_30%)]" />
      <motion.div
        animate={{ opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-[2rem] border border-white/15 bg-[rgba(255,255,255,0.09)] px-8 py-10 text-center shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_0_0_8px_rgba(29,184,73,0.12)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full border-[3px] border-white/20 border-t-primary border-r-primary"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-5 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[#05111f] shadow-[0_0_28px_rgba(29,184,73,0.38)]"
          >
            <Loader2 size={28} className="animate-spin" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mt-6"
        >
          <p className="text-lg font-semibold text-white">{resolvedTitle}</p>
          <p className="mt-2 text-sm text-white/70">{resolvedSubtitle}</p>
        </motion.div>

        <div className="mt-8 flex items-center gap-2 text-primary">
          <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <Sparkles size={14} />
          </motion.span>
          <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.15 }}>
            <Sparkles size={14} />
          </motion.span>
          <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}>
            <Sparkles size={14} />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}