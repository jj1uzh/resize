import './App.css'
import { useCallback, useEffect, useRef, useState } from "react"
import { resize, useImage } from './lib/image'

export default function App() {
  const [originalImageSrc, setOriginalImageSrc] = useState<string | undefined>(undefined)
  const originalImage = useRef<HTMLImageElement>(null)
  const [resizingWidth, setResizingWidth] = useState<number | undefined>(undefined)
  const [resizingHeight, setResizingHeight] = useState<number | undefined>(undefined)
  const [originalWidth, setOriginalWidth] = useState<number | undefined>(undefined)
  const [originalHeight, setOriginalHeight] = useState<number | undefined>(undefined)
  const [keepsRatio, setKeepsRatio] = useState<boolean>(true)

  const pasteFromClipboard = useCallback(async () => {
    try {
      const contents = await navigator.clipboard.read()
      for (const content of contents) {
        if (!content.types.includes('image/png')) {
          throw new Error('Not a png file')
        }
        const blob = await content.getType('image/png')
        const dataURL = URL.createObjectURL(blob)
        setOriginalImageSrc(dataURL)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    const mainRef = main.current
    if (!mainRef) {
      return
    }
    function onPaste(event: ClipboardEvent) {
      event.preventDefault()
      const data = event.clipboardData
      if (data === null) {
        return
      }
      for (const item of data.items) {
        if (item.type === 'image/png') {
          const file = item.getAsFile()
          if (file === null) continue
          const dataURL = URL.createObjectURL(file)
          setOriginalImageSrc(dataURL)
        }
      }
    }
    mainRef.addEventListener('paste', onPaste)
    return () => {
      mainRef.removeEventListener('paste', onPaste)
    }
  }, [])

  useEffect(() => {
    if (originalImage.current) {
      originalImage.current.onload = () => {
        setResizingWidth(originalImage.current!.naturalWidth)
        setResizingHeight(originalImage.current!.naturalHeight)
        setOriginalWidth(originalImage.current!.naturalWidth)
        setOriginalHeight(originalImage.current!.naturalHeight)
      }
    }
  }, [])

  function changeWidth(toWidth: number) {
    if (keepsRatio && originalHeight && originalWidth) {
      setResizingHeight(toWidth * originalHeight / originalWidth)
    }
    setResizingWidth(toWidth)
  }
  function changeHeight(toHeight: number) {
    if (keepsRatio && originalHeight && originalWidth) {
      setResizingWidth(toHeight * originalWidth / originalHeight)
    }
    setResizingHeight(toHeight)
  }

  return (
    <main ref={main}>
      <h1>Resize</h1>
      <button onClick={pasteFromClipboard}>Paste from clipboard</button>
      <span> or C-v</span>
      <div>
        <h2>Original</h2>
        <img id="preview-original" src={originalImageSrc} ref={originalImage} />
      </div>
      <div>
        <h2>Resized</h2>
        <div>
          <label>Width<input type="number" value={resizingWidth} onChange={(e) => changeWidth(parseInt(e.target.value))} /></label>
          <label>Height<input type="number" value={resizingHeight} onChange={(e) => changeHeight(parseInt(e.target.value))} /></label>
          <button onClick={() => { setResizingWidth(originalWidth); setResizingHeight(originalHeight) }}>Reset</button>
          <label><input type="checkbox" checked={keepsRatio} onChange={(e) => setKeepsRatio(e.target.checked)} />Keep Ratio</label>
        </div>
        {originalImageSrc && resizingWidth && resizingHeight &&
          <ResizedImage
            originalImageSrc={originalImageSrc}
            width={resizingWidth}
            height={resizingHeight} />}
      </div>
    </main>
  )
}

function ResizedImage({ originalImageSrc, width, height }: { originalImageSrc: string, width: number, height: number }) {
  const originalImage = useImage(originalImageSrc)
  const resizedImageSrc = originalImage ? resize(originalImage, width, height) : undefined
  return (
    <img id="preview-resized" src={resizedImageSrc} />
  )
}
