const MAX_POSTER_SIDE = 960
const POSTER_QUALITY = 0.82

export async function fileToPosterDataUrl(file: File) {
  const source = await readFileAsDataUrl(file)
  const image = await loadImage(source)
  const scale = Math.min(1, MAX_POSTER_SIDE / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d", {
    alpha: false,
  })

  if (!context) {
    return source
  }

  context.drawImage(image, 0, 0, width, height)

  return canvas.toDataURL("image/webp", POSTER_QUALITY)
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Poster file could not be read"))
    })

    reader.addEventListener("error", () => {
      reject(new Error("Poster file could not be read"))
    })

    reader.readAsDataURL(file)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", () => {
      reject(new Error("Poster image could not be decoded"))
    })
    image.src = src
  })
}
