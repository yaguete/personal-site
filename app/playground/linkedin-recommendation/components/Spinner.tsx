import { motion } from 'framer-motion'

export default function Spinner() {
  return (
    <div className="flex items-center space-x-0.5">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-1 h-1 bg-current rounded-full"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
} 