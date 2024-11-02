export {}

declare global {
  interface Window {
    tauriContainer?: {
      openedFile: string
    }
  }
}
