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
  return canvas.toDataURL('image/png')
}