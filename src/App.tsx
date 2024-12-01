import './App.css'
import { useCallback, useState } from "react"
import { resize, useImage } from './lib/image'

export default function App() {
  const [originalImageSrc, setOriginalImageSrc] = useState<string | undefined>(undefined)
  const [resizingWidth, setResizingWidth] = useState<number | undefined>(500)
  const [resizingHeight, setResizingHeight] = useState<number | undefined>(500)

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

  return (
    <>
      <h1>Resize</h1>
      <button onClick={pasteFromClipboard}>Paste from clipboard</button>
      <div>
        <h2>Original</h2>
        <img id="preview-original" src={originalImageSrc} />
        {originalImageSrc && <ImageInfo imageSrc={originalImageSrc} />}
      </div>
      <div>
        <h2>Resized</h2>
        <label>Width<input type="number" value={resizingWidth} onChange={(e) => setResizingWidth(parseInt(e.target.value))} /></label>
        <label>Height<input type="number" value={resizingHeight} onChange={(e) => setResizingHeight(parseInt(e.target.value))} /></label>
        {originalImageSrc && resizingWidth && resizingHeight &&
          <ResizedImage
            originalImageSrc={originalImageSrc}
            width={resizingWidth}
            height={resizingHeight} />}
      </div>
    </>
  )
}

function ResizedImage({ originalImageSrc, width, height }: { originalImageSrc: string, width: number, height: number }) {
  const originalImage = useImage(originalImageSrc)
  const resizedImageSrc = originalImage ? resize(originalImage, width, height) : undefined
  return (
    <>
      <img id="preview-resized" src={resizedImageSrc} />
      {resizedImageSrc && <ImageInfo imageSrc={resizedImageSrc} />}
    </>
  )
}

function ImageInfo({ imageSrc }: { imageSrc: string }) {
  const image = useImage(imageSrc)
  return (
    <dl>
      <dt>Width</dt><dd>{image?.width}</dd>
      <dt>Height</dt><dd>{image?.height}</dd>
      <dt>Natural Width</dt><dd>{image?.naturalWidth}</dd>
      <dt>Natural Height</dt><dd>{image?.naturalHeight}</dd>
    </dl>
  )
}
