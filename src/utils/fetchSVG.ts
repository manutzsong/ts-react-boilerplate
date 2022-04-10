import { Canvg, presets } from 'canvg'

const getStringSVG = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    fetch(url).then((response) => {
      resolve(response.text())
    })
    //   .then((blob) => {
    //     const reader = new FileReader()
    //     reader.onload = function () {
    //       resolve(this.result)
    //     } // <--- `this.result` contains a base64 data URI
    //     reader.readAsDataURL(blob)
    //   })
  })
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

const fetchSVG = async (url: string): Promise<string> => {
  const svg = await getStringSVG(url)
  const canvas = new OffscreenCanvas(400, 560)
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  const v = await Canvg.from(ctx, svg, presets.offscreen() as any)

  // Render only first frame, ignoring animations and mouse.
  await v.render()

  const blob = await canvas.convertToBlob()
  const pngUrl = URL.createObjectURL(blob)
  const pngBase64 = await blobToBase64(blob)
  return new Promise((resolve) => resolve(pngBase64))
}

export default fetchSVG
