/// <reference types="vite/client" />

declare module 'motion/react' {
  import { motion, AnimatePresence } from 'motion';
  export { motion, AnimatePresence };
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
