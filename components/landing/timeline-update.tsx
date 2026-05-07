import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineItemProps {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  step,
  title,
  desc,
  icon: Icon,
  isLast,
}) => (
  <motion.div
    // Scroll Animation: Ease in and slide up
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Custom cubic-bezier for "clarity" ease
    // Hover Interaction: Gentle scale
    whileHover={{ scale: 1.03 }}
    className="relative flex gap-8 group cursor-default"
  >
    {/* Line with animated gradient */}
    {!isLast && (
      <div className="absolute left-[27px] top-14 bottom-[-32px] w-[2px] bg-stone-200 dark:bg-stone-800 overflow-hidden">
        <motion.div
          className="w-full h-full bg-gradient-to-b from-orange-400 to-transparent"
          animate={{ translateY: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )}

    {/* Icon Bubble */}
    <div
      className="relative flex-shrink-0 w-14 h-14 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center z-10
                    group-hover:border-orange-500/50 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] transition-all duration-500 shadow-sm"
    >
      <Icon
        size={24}
        className="text-stone-500 group-hover:text-orange-500 transition-colors duration-300"
      />
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-bold rounded-full flex items-center justify-center">
        {step}
      </div>
    </div>

    {/* Content */}
    <div className="pb-16 pt-2">
      <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-stone-500 dark:text-stone-400 leading-relaxed max-w-sm">
        {desc}
      </p>
    </div>
  </motion.div>
);

export default TimelineItem;
