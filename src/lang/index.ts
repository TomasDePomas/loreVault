import type { App } from 'vue'
import i18next, { TOptions } from 'i18next'
import Singleton from 'src/classes/Singleton'
import { computed, Ref, ref } from 'vue'
import EN from './EN'

export enum UILanguage {
  EN = 'EN',
}
class Translator extends Singleton<Translator> {
  private _initialized: boolean = false
  private _language: Ref<UILanguage> = ref(UILanguage.EN)
  private initializePromise: Promise<void> | undefined = undefined
  private resolveInitializePromise: (() => void) | undefined = undefined

  constructor() {
    super(Translator, (instance: Translator) => {
      instance.initialize()
    })
  }

  public awaitInitalized(): Promise<void> {
    if (!this.initializePromise) {
      this.initializePromise = new Promise((resolve) => {
        if (this._initialized) {
          resolve()
        }
        this.resolveInitializePromise = resolve
      })
    }
    return this.initializePromise
  }

  get language() {
    return this._language.value
  }

  async install(app: App) {
    app.config.globalProperties.$t = this.t.bind(this)

    return this.initialize()
  }

  async initialize() {
    if (this._initialized) {
      return
    }
    const lng = await this._loadLanguage(UILanguage.EN)
    this._language.value = lng

    await i18next.init({
      lng,
      fallbackLng: UILanguage.EN,
      resources: {
        EN,
      },
    })
    this._initialized = true
    if (this.resolveInitializePromise) {
      this.resolveInitializePromise()
    }
  }

  t(key: string, options: TOptions = {}): string {
    if (!this._initialized) {
      throw Error('Translator is not yet initialized. Unable to translate')
    }
    return computed(() => {
      return i18next.t(key, { ...options, lng: this.language })
    }).value
  }

  has(key: string) {
    return i18next.exists(key)
  }

  async setLanguage(tag: UILanguage) {
    if (!this._initialized) {
      throw Error('Translator is not yet initialized. Unable to set language')
    }
    await i18next.changeLanguage(tag)
    this._language.value = tag
    // await PreferencesManager.set('ui-language', tag)
  }

  async reloadLanguage() {
    if (!this._initialized) {
      throw Error(
        'Translator is not yet initialized. Unable to reload language',
      )
    }
    const lng = await this._loadLanguage(UILanguage.EN)
    this._language.value = lng
    await i18next.changeLanguage(lng)
  }

  async _loadLanguage(fallbackLanguage: UILanguage): Promise<UILanguage> {
    // if (await PreferencesManager.isSet('ui-language')) {
    //   return await PreferencesManager.get('ui-language').value
    // }

    if (navigator.languages !== undefined) {
      const foundLanguage = navigator.languages.find((language) => {
        const simpleLanguage = this._simplifyLanguageTag(language)
        return simpleLanguage in UILanguage
      })
      if (foundLanguage) {
        return this._simplifyLanguageTag(foundLanguage) as UILanguage
      }
    }
    if (navigator.language !== undefined) {
      const simpleLanguage = this._simplifyLanguageTag(navigator.language)
      if (simpleLanguage in UILanguage) {
        return simpleLanguage as UILanguage
      }
    }

    return fallbackLanguage
  }

  _simplifyLanguageTag(tag: string): string {
    const parts = tag.split('-')
    const language = parts[0]
    return language.toUpperCase()
  }
}
export default new Translator()
