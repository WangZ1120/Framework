import { WMenuHelper } from '../common/WMenuHelper'
import { IWConfig } from '../config/WConfig'
import { IWUser } from '../common/WUserHelper'

export interface IWReadonlyAppState {
  getConfig(): IWConfig

  getMenuHelper(): WMenuHelper

  getUserHelper(): IWUser
}

export interface IWAppState extends IWReadonlyAppState {
  setConfig(config: IWConfig): void

  setMenuHelper(menu: WMenuHelper): void

  setUserHelper(userInfo: IWUser): void
}

export class WAppState implements IWAppState {
  private static instance: WAppState
  private readonly initialized: boolean = false

  public config: IWConfig
  public menuHelper: any
  public userHelper!: IWUser
  public tokenData: any

  private constructor(config: IWConfig) {
    if (!this.initialized) {
      this.config = config
      this.initialized = true
    } else {
      throw new Error('已创建单一实例。使用 get() 方法。')
    }
  }

  public static createInstance(config: IWConfig): void {
    if (WAppState.instance) {
      throw new Error('已创建单一实例，使用 getInstance() 方法。')
    }
    WAppState.instance = new WAppState(config)
  }

  public static get(): WAppState {
    if (!WAppState.instance || !WAppState.instance.initialized) {
      throw new Error('WAppState 还未创建单一实例，请先调用 createInstance() 创建实例')
    }
    return WAppState.instance
  }

  public static isInitialized(): boolean {
    return WAppState.instance && WAppState.instance.initialized
  }

  public setConfig(config: IWConfig): void {
    this.config = config
  }

  public getConfig(): IWConfig {
    return this.config
  }

  public setMenuHelper(menu: WMenuHelper): void {
    this.menuHelper = menu
  }

  public getMenuHelper(): WMenuHelper {
    return this.menuHelper
  }

  public setUserHelper(userInfo: IWUser): void {
    this.userHelper = userInfo
  }

  public getUserHelper(): IWUser {
    return this.userHelper
  }
}

export class WAppStateProxy {
  private static getInstance(): WAppState {
    if (!WAppState.isInitialized()) {
      throw new Error(
        'WAppStateProxy 依赖 WAppState，而 WAppState 还未创建单一示例，请先调用 WAppState.createInstance() 创建实例'
      )
    }
    return WAppState.get()
  }

  public static getConfig(): IWConfig {
    return WAppStateProxy.getInstance().getConfig()
  }

  public static getMenuHelper(): WMenuHelper {
    return WAppStateProxy.getInstance().getMenuHelper()
  }

  public static getUserInfo(): IWUser {
    return WAppStateProxy.getInstance().getUserHelper()
  }
}
