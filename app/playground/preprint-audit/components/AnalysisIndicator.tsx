import { motion } from 'framer-motion'

interface AnalysisIndicatorProps {
  type: 'original' | 'projected'
  size: {
    width: number
    height: number
    label?: string
  }
}

const getPaperSizeFromDimensions = (width: number, height: number) => {
  const tolerance = 5
  const paperSizes = [
    { name: 'A0', width: 841, height: 1189 },
    { name: 'A1', width: 594, height: 841 },
    { name: 'A2', width: 420, height: 594 },
    { name: 'A3', width: 297, height: 420 },
    { name: 'A4', width: 210, height: 297 },
    { name: 'A5', width: 148, height: 210 },
    { name: 'A6', width: 105, height: 148 },
    { name: 'B0', width: 1000, height: 1414 },
    { name: 'B1', width: 707, height: 1000 },
    { name: 'B2', width: 500, height: 707 },
    { name: 'B3', width: 353, height: 500 },
    { name: 'B4', width: 250, height: 353 },
    { name: 'B5', width: 176, height: 250 },
  ]
  
  for (const size of paperSizes) {
    if (Math.abs(width - size.width) <= tolerance && Math.abs(height - size.height) <= tolerance) {
      return size.name
    }
    if (Math.abs(width - size.height) <= tolerance && Math.abs(height - size.width) <= tolerance) {
      return size.name
    }
  }
  
  return null
}

export default function AnalysisIndicator({ type, size }: AnalysisIndicatorProps) {
  const isOriginal = type === 'original'
  const paperSize = getPaperSizeFromDimensions(size.width, size.height)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 py-2 px-3 rounded-lg border ${
        isOriginal 
          ? 'bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700' 
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      }`}
    >
      <svg 
        className={`h-5 w-5 ${
          isOriginal 
            ? 'text-gray-500 dark:text-gray-400' 
            : 'text-blue-600 dark:text-blue-400'
        }`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className={`text-sm ${
        isOriginal 
          ? 'text-gray-600 dark:text-gray-300' 
          : 'text-blue-700 dark:text-blue-300'
      }`}>
        {isOriginal 
          ? `Original size: ${size.width} × ${size.height} mm${paperSize ? ` (${paperSize} approx.)` : ''}`
          : size.label === 'Custom'
            ? 'Custom analysis'
            : `Analysis for printing in ${size.label} (${size.width} × ${size.height} mm)`
        }
      </span>
    </motion.div>
  )
} 