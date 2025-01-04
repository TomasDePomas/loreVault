export const resizeImage = (
  base64: string,
  targetWidth: number = 300,
): Promise<string | null> => {
  return new Promise((resolve) => {
    const image = new Image()
    image.onerror = () => resolve(null)
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        return resolve(null)
      }
      canvas.width = targetWidth
      canvas.height = (image.height / image.width) * targetWidth
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      resolve(canvas.toDataURL())
    }
    image.src = base64
  })
}
