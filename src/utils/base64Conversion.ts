export const encodeBase64ToBytes = (base64: string): Uint8Array => {
  const binaryString = atob(base64)
  const imageBytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    imageBytes[i] = binaryString.charCodeAt(i)
  }
  return imageBytes
}

export const decodeBase64FromBytes = (imageBytes: Uint8Array): string => {
  let binaryString = ''
  for (let i = 0; i < imageBytes.length; i++) {
    binaryString += String.fromCharCode(imageBytes[i])
  }
  return btoa(binaryString)
}

export const getSizeOfBase64Image = async (
  imageBase64: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    let image: HTMLImageElement | null = new Image()
    image.onload = () => {
      if (!image) {
        reject(Error('Unable to load image'))
        return
      }
      const result = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      }
      image.onload = image.onerror = null
      image.src = ''
      image = null
      resolve(result)
    }
    image.onerror = (error) => {
      if (image) {
        image.onload = image.onerror = null
        image.src = ''
        image = null
      }
      console.error(error, imageBase64)
      reject(Error('Unable to load image'))
    }
    image.src = imageBase64
  })
}
