/**
 * 사용자가 reduced-motion을 요청했는지(마운트 후 클라이언트에서만 호출).
 * 홈 코트는 reduced-motion이어도 표시하되, 혼자 시작되는 모션(등장 연출·흔들림·펄스·페이드)만 끈다.
 */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
