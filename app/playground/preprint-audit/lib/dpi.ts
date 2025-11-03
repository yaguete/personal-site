export const calculateProjectedDPI = (
  originalDpi: number, 
  originalWidth: number, 
  originalHeight: number, 
  targetWidth?: number, 
  targetHeight?: number
) => {
  if (!targetWidth || !targetHeight) return originalDpi // tamaño original
  
  const scaleFactorWidth = targetWidth / originalWidth
  const scaleFactorHeight = targetHeight / originalHeight
  const projectedDpiWidth = originalDpi / scaleFactorWidth
  const projectedDpiHeight = originalDpi / scaleFactorHeight
  return Math.round((projectedDpiWidth + projectedDpiHeight) / 2)
}

export const getDpiCategory = (dpi: number): string => {
  if (dpi < 70) return 'very_low'
  if (dpi < 150) return 'low'
  if (dpi < 300) return 'medium'
  return 'high'
}

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'very_low': return 'bg-red-100 border-red-300 text-red-800'
    case 'low': return 'bg-orange-100 border-orange-300 text-orange-800'
    case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
    case 'high': return 'bg-green-100 border-green-300 text-green-800'
    default: return 'bg-gray-100 border-gray-300 text-gray-800'
  }
}

export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'very_low': return 'Very Low (< 70 DPI)'
    case 'low': return 'Low (< 150 DPI)'
    case 'medium': return 'Medium (< 300 DPI)'
    case 'high': return 'High (≥ 300 DPI)'
    default: return 'Unknown'
  }
} 