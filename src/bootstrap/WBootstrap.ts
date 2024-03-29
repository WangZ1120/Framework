import { WAppDependencyModeEnum, WAppRunModeEnum, WEnvEnum } from '../config/WEnum'
import { IWConfig, WConfig } from '../config/WConfig'
import { WDynamicExport, IWDynamicExport } from './WDynamicExport'
import { WAppRunDependency } from './WAppRunDependency'
import { WAppState } from '../app-state/WAppState'
import { IWMainHelper, WMainBootstrap } from './WMainBootstrap'
import { IWMicroHelper, WMicroBootstrap } from './WMicroBootstrap'
import { IWUserExecutor, WGlobalUser, WNativeUser, WUser } from '../common/WUserHelper'
import { WAppRouterBuilderService } from '../service/global/WAppRouterBuilderService'
import { WAppWebHistoryService } from '../service/global/WAppWebHistoryService'
import { IWAppService, WAppService, WAppServiceTypes } from '@/service/global/WAppService'
import { WAppCommService } from '@/service/global/WAppCommService'
import { WAppRouterService } from '@/service/global/WAppRouterService'
import { WAppRouterInterceptionService } from '@/service/global/WAppRouterInterceptionService'
import { WAppLoginService } from '@/service/global/WAppLoginService'

export interface IWBootstrap {
  run(config?: IWConfig): void
}

export interface IWBootstrapConfig {
  addBootstrap<T extends IWBootstrapHelper>(ctor: new () => T): void
}

export class WBootstrap implements IWBootstrap, IWBootstrapConfig {
  public static WAIT_APP_BOOTSTRAP: Array<(config: IWConfig) => void> = []

  public appRunMode: WAppRunModeEnum
  public dynamicExport: IWDynamicExport
  public appConfig!: IWConfig

  private bootstraps: Map<string, new () => IWBootstrapHelper>

  constructor(appRunMode: WAppRunModeEnum) {
    this.appRunMode = appRunMode
    this.dynamicExport = new WDynamicExport()
    this.bootstraps = new Map()
  }

  public async run(): Promise<void> {
    if (this.bootstraps.size <= 0) {
      throw new Error('没有设置启动程序，请通过 addBootstrap 添加！')
    }

    let appRunMode = this.appRunMode
    let ctor: (new () => IWBootstrapHelper) | undefined
    let bootstrap: IWRealBootstrap
    let libDependentConfig: IWConfig

    switch (appRunMode) {
      case WAppRunModeEnum.INDEPENDENT:
        ctor = this.bootstraps.get(WAppRunModeEnum.INDEPENDENT)
        break
      case WAppRunModeEnum.MAIN:
        ctor = this.bootstraps.get(WAppRunModeEnum.MAIN)
        break
      case WAppRunModeEnum.MICRO:
        ctor = this.bootstraps.get(WAppRunModeEnum.MICRO)
        break
      case WAppRunModeEnum.LIB:
        ctor = this.bootstraps.get(WAppRunModeEnum.LIB)
        break
      default:
        throw new Error('未匹配到启动程序！')
    }

    if (!ctor) {
      throw new Error(`没有 ${appRunMode} 启动程序，请通过 addBootstrap 添加！`)
    }

    this.appConfig = this.initConfig(this.appRunMode, libDependentConfig!)
    this.initGlobalService(this.appRunMode)

    switch (appRunMode) {
      case WAppRunModeEnum.MAIN:
        bootstrap = new WMainBootstrap(new ctor() as IWMainHelper)
        break
      case WAppRunModeEnum.INDEPENDENT:
        bootstrap = new WIndependentBootstrap(new ctor() as IWIndependentHelper)
        break
      case WAppRunModeEnum.MICRO:
        bootstrap = new WMicroBootstrap(new ctor() as IWMicroHelper)
        break
      case WAppRunModeEnum.LIB:
        bootstrap = new WLibBootstrap(new ctor!() as IWLibHelper)
        libDependentConfig = await this.waitForLibDependentConfig()
        break
    }

    await bootstrap.run(this.appConfig)
  }

  private async waitForLibDependentConfig(): Promise<IWConfig> {
    return new Promise((resolve, reject) => {
      WBootstrap.WAIT_APP_BOOTSTRAP.push((config: IWConfig): void => {
        resolve(config)
      })
    })
  }

  public addBootstrap<T extends IWBootstrapHelper>(ctor: new () => T): void {
    let runMode = this.retrieveAppRunMode(ctor)
    if (this.bootstraps.get(runMode)) {
      new Error('相同类型的项目运行模式已经添加过一次！')
    }
    this.bootstraps.set(runMode, ctor)
  }

  private isInterface(ctor: any, methodName: string): ctor is new () => IWBootstrap {
    return 'prototype' in ctor && methodName in ctor.prototype
  }

  private retrieveAppRunMode(ctor: new () => IWBootstrapHelper): WAppRunModeEnum {
    if (this.isInterface(ctor, 'getRegistrableApp')) {
      return WAppRunModeEnum.MAIN
    } else if (this.isInterface(ctor, 'onMount')) {
      return WAppRunModeEnum.MICRO
    } else if (this.isInterface(ctor, 'onInstallation')) {
      return WAppRunModeEnum.LIB
    }
    return WAppRunModeEnum.INDEPENDENT
  }

  private initConfig(appRunMode: WAppRunModeEnum, libDependentConfig: IWConfig): IWConfig {
    class Config extends WConfig {
    }

    let config = new Config()
    config.setAppId(this.buildOnly(8, 8))
    config.setDebugMode(!WEnvEnum.PRODUCTION)
    config.setAppRunMode(appRunMode)
    config.setConfig(undefined)

    if (appRunMode === WAppRunModeEnum.LIB && libDependentConfig!) {
      this.appConfig.setAppDependencyMode(
        WAppRunDependency.runToDependency(libDependentConfig.getAppRunMode())
      )
    } else {
      config.setAppDependencyMode(WAppDependencyModeEnum.NONE)
    }

    return config
  }

  private initGlobalService(appRunMode: WAppRunModeEnum): void {
    if (!window.W_USER) {
      window.W_USER = {} as any
    }
    if (!window.W_EVENTS_POOL) {
      window.W_EVENTS_POOL = new Map()
    }

    if (!window.W_APP_SERVICE) {
      AppServiceContainer = new WAppService()
      window.W_APP_SERVICE = AppServiceContainer
      AppServiceContainer.bind(WAppServiceTypes.APP_COMM, WAppCommService)
      AppServiceContainer.bind(WAppServiceTypes.APP_ROUTER, WAppRouterService)
      AppServiceContainer.bind(WAppServiceTypes.APP_ROUTER_BUILDER, WAppRouterBuilderService)
      AppServiceContainer.bind(WAppServiceTypes.APP_WEB_HISTORY, WAppWebHistoryService)
      AppServiceContainer.bind(WAppServiceTypes.APP_ROUTER_INTERCEPTION, WAppRouterInterceptionService)
      AppServiceContainer.bind(WAppServiceTypes.APP_LOGIN, WAppLoginService)
    } else {
      AppServiceContainer = window.W_APP_SERVICE
    }

    WAppState.createInstance(this.appConfig)

    let userExecutor: IWUserExecutor
    switch (appRunMode) {
      case WAppRunModeEnum.INDEPENDENT:
      case WAppRunModeEnum.MAIN:
      case WAppRunModeEnum.MICRO:
      case WAppRunModeEnum.LIB:
        userExecutor = new WGlobalUser()
        break
      default:
        userExecutor = new WNativeUser()
    }
    const user = new WUser(userExecutor)
    WAppState.get().setUserHelper(user)

  }

  private buildOnly(len: number, radix: number): string {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = [],
      i
    radix = radix || chars.length
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
      let r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16)
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  }
}

export interface IWRealBootstrap {
  run(config: IWConfig): void
}

export class WIndependentBootstrap implements IWRealBootstrap {
  private helper: IWIndependentHelper
  private config!: IWConfig

  constructor(helper: IWIndependentHelper) {
    this.helper = helper
  }

  public async run(config: IWConfig): Promise<void> {
    this.config = config
    this.helper.onStart(this.config)
  }
}

export class WLibBootstrap implements IWRealBootstrap {
  private helper: IWLibHelper
  private config!: IWConfig

  constructor(helper: IWLibHelper) {
    this.helper = helper
  }

  public async run(config: IWConfig): Promise<void> {
    this.config = config
    this.helper.onInstallation(this.config)
  }
}

export type IWBootstrapHelper = IWIndependentHelper | IWMainHelper | IWMicroHelper | IWLibHelper

export interface IWIndependentHelper {
  onStart(config?: IWConfig): void
}

export interface IWLibHelper {
  onInstallation(config?: IWConfig): void
}

const WInstallation = {
  install: (app: any, config: IWConfig) => {
    WBootstrap.WAIT_APP_BOOTSTRAP.forEach((fun) => fun(config))
  }
}

let AppServiceContainer: IWAppService
export { WInstallation, AppServiceContainer }
