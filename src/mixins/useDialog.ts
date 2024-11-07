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
    showToast,
  }
}
