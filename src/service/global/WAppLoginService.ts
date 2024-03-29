import { IWConfig } from '@/config/WConfig'
import { loadMicroApp } from 'qiankun'
import { IWAppRouterService } from '@/service/global/WAppRouterService'
import { AppServiceContainer } from '@/bootstrap/WBootstrap'
import { WAppServiceTypes } from '@/service/global/WAppService'

export interface IWReadonlyAppLoginService {
  isLogin(): boolean

  login(isLogin: boolean): void

  setLoginListener(listener: () => void): void
}

export interface IWAppLoginService extends IWReadonlyAppLoginService {
  startLogin(): void
}

export class WAppLoginService implements IWAppLoginService {
  private config: IWConfig
  private loginState: boolean = true
  private loginListener?: () => void

  constructor(config: IWConfig) {
    this.config = config
  }

  public isLogin(): boolean {
    return this.loginState
  }

  public startLogin(): void {
    loadMicroApp({
      name: 'demo-login',
      entry: '//localhost:8000',
      container: '#app-login'
    })
  }

  public login(isLogin: boolean): void {
    this.loginState = isLogin

    if (this.loginState && this.loginListener) {
      this.loginListener()
    }
  }

  public setLoginListener(listener: () => void): void {
    this.loginListener = listener
  }
}