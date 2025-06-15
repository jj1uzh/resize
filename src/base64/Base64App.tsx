import { Header } from '../components/Header'
import './Base64App.css'
import { useState } from "react"

export function Base64App() {
  const [encoderSrc, setEncoderSrc] = useState('')
  const [decoderSrc, setDecoderSrc] = useState('')
  return (
    <>
      <Header />
      <main>
        <title>Base64</title>
        <h1>Base64</h1>
        <h2>base64</h2>
        <textarea value={encoderSrc} onChange={e => setEncoderSrc(e.target.value)} />
        <textarea defaultValue={btoa(encoderSrc)} readOnly disabled />
        <h2>base64 -d</h2>
        <textarea value={decoderSrc} onChange={e => setDecoderSrc(e.target.value)} />
        <textarea defaultValue={atob(decoderSrc)} readOnly disabled />
      </main>
    </>
  )
}