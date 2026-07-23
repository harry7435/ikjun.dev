"use client";

import { motion } from "framer-motion";

interface HoverTagProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 기술 태그용 마이크로 인터랙션 래퍼.
 * hover 시 살짝 떠오르는 스프링 모션. reduced-motion은 framer-motion이 자동 존중.
 */
export default function HoverTag({ children, className }: HoverTagProps) {
  return (
    <motion.li
      className={className}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      {children}
    </motion.li>
  );
}
