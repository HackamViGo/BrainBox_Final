'use client'

import { useState, useCallback } from 'react'

/**
 * useDragDrop - Handle drag and drop logic for BrainBox.
 * Currently used as a drag source for items moving into the Workspace.
 */
export function useDragDrop() {
  const [isDragging, setIsDragging] = useState(false)

  const onDragStart = useCallback((event: React.DragEvent, type: string, data: any) => {
    setIsDragging(true)
    event.dataTransfer.setData('application/brainbox-type', type)
    event.dataTransfer.setData('application/json', JSON.stringify(data))
    event.dataTransfer.effectAllowed = 'move'
    
    // Set drag image if needed
    const dragImg = new Image()
    dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    event.dataTransfer.setDragImage(dragImg, 0, 0)
  }, [])

  const onDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  return {
    isDragging,
    onDragStart,
    onDragEnd
  }
}
