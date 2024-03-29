import { IWConfig } from '../config/WConfig'

export interface IWReadonlyMenu {
  closeMenu(): void
}

export interface IWMenu extends IWReadonlyMenu {}

export class WMenuHelper implements IWMenu {
  private static instance: WMenuHelper

  private config: IWConfig
  private initialized: boolean = false

  private constructor(config: IWConfig) {
    if (!this.initialized) {
      this.config = config
      this.initialized = true
    } else {
      throw new Error('已创建单一实例。使用 get() 方法。')
    }
  }

  public static createInstance(config: IWConfig): void {
    if (WMenuHelper.instance) {
      throw new Error('已创建单一实例，使用 getInstance() 方法。')
    }
    WMenuHelper.instance = new WMenuHelper(config)
  }

  public static get(): WMenuHelper {
    if (!WMenuHelper.instance || !WMenuHelper.instance.initialized) {
      throw new Error('WMenuHelper 还未创建单一实例，请先调用 createInstance() 创建实例')
    }
    return WMenuHelper.instance
  }

  public static isInitialized(): boolean {
    return WMenuHelper.instance && WMenuHelper.instance.initialized
  }

  public closeMenu(): void {}
}

export class WMenuHelperProxy {
  private static getInstance(): WMenuHelper {
    if (!WMenuHelper.isInitialized()) {
      throw new Error(
        'WMenuHelperProxy 依赖 WMenuHelper，而 WMenuHelper 还未创建单一示例，请先调用 WMenuHelper.createInstance() 创建实例'
      )
    }
    return WMenuHelper.get()
  }

  public static closeMenu(): void {
    WMenuHelperProxy.getInstance().closeMenu()
  }
}
