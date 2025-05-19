import { useEffect, useState } from "react";

export function useImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined)
  useEffect(() => {
    const underlying = new Image()
    underlying.src = src
    underlying.onload = () => setImage(underlying)
    return () => {
      setImage(undefined)
    }
  }, [src])
  return image
}

export function resize(image: HTMLImageElement, width: number, height: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  ctx?.drawImage(image, 0, 0, width, height)

  // Determine image format from source
  const format = image.src.includes('image/jpeg') ? 'image/jpeg' : 'image/png'
  const quality = format === 'image/jpeg' ? 0.95 : undefined

  return canvas.toDataURL(format, quality)
}

export function rotate(image: HTMLImageElement, degrees: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Set proper canvas dimensions for the rotated image
  if (degrees % 180 === 0) {
    // For 0 or 180 degrees rotation, dimensions stay the same
    canvas.width = image.width
    canvas.height = image.height
  } else {
    // For 90 or 270 degrees rotation, swap width and height
    canvas.width = image.height
    canvas.height = image.width
  }
  
  if (ctx) {
    // Move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2)
    
    // Rotate the canvas context
    ctx.rotate((degrees * Math.PI) / 180)
    
    // Draw the image centered but rotated
    ctx.drawImage(
      image,
      -image.width / 2,
      -image.height / 2,
      image.width,
      image.height
    )
    
    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
  
  // Determine image format from source
  const format = image.src.includes('image/jpeg') ? 'image/jpeg' : 'image/png'
  const quality = format === 'image/jpeg' ? 0.95 : undefined

  return canvas.toDataURL(format, quality)
}