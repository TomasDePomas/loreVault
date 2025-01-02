import { Dialog, Notify, QDialogOptions, QNotifyCreateOptions } from 'quasar'
import type { QNotifyUpdateOptions } from 'quasar'

export const useDialog = () => {
  const showDialog = async <TResponse = true>(
    options: QDialogOptions = {},
  ): Promise<TResponse | null> => {
    return new Promise((resolve) => {
      Dialog.create({
        title: 'Are you sure?',
        ok: {
          color: 'primary',
        },
        ...options,
      })
        .onOk((data: TResponse) => {
          if (data === undefined) {
            resolve(true as TResponse)
          }
          resolve(data as TResponse)
        })
        .onCancel(() => {
          resolve(null)
        })
        .onDismiss(() => {
          resolve(null)
        })
    })
  }
  const showPrompt = async (
    title: string = 'Prompt',
    startValue: string = '',
    minLength: number = 3,
  ): Promise<string | null> => {
    return showDialog<string>({
      title,
      prompt: {
        model: startValue,
        isValid: (val) => val.length >= minLength,
        type: 'text',
      },
    })
  }

  const showToast = (
    options: QNotifyCreateOptions = {},
  ): ((props?: QNotifyUpdateOptions) => void) => {
    return Notify.create({
      type: 'error',
      position: 'bottom',
      message: 'Something went wrong',
      ...options,
    })
  }

  return {
    showDialog,
    showPrompt,
    showToast,
  }
}
