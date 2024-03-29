import { WAppRunModeEnum, WAppDependencyModeEnum, WEnvEnum } from './WEnum'

export interface IWReadonlyConfig {
  getAppName(): string

  getAppSystemVersion(): string

  getAppId(): string

  getRoutePath(): string

  getAppDependencyMode(): WAppDependencyModeEnum

  getAppRunMode(): WAppRunModeEnum

  getEnv(): WEnvEnum

  isDevelopment(): boolean

  isTest(): boolean

  isUat(): boolean

  isProduction(): boolean

  isDebugMode(): boolean
}

export interface IWConfig extends IWReadonlyConfig {
  setAppName(appId: string): void

  setAppId(appId: string): void

  setRoutePath(routePath: string): void

  setAppRunMode(mode: WAppRunModeEnum): void

  setAppDependencyMode(mode: WAppDependencyModeEnum): void

  setDebugMode(isOpen: boolean): void
}

export interface IWBuildConfig {
  setConfig(config: IWConfig): void
}

export abstract class WConfig implements IWConfig, IWBuildConfig {
  protected appId: string = process.env.VUE_APP_ID || ''
  protected appName: string = ''
  protected routePath: string = ''
  protected isDebug: boolean = false
  protected appRunMode: WAppRunModeEnum = WAppRunModeEnum.INDEPENDENT
  protected appDependencyMode: WAppDependencyModeEnum = WAppDependencyModeEnum.NONE

  private config?: IWConfig

  constructor(config?: IWConfig) {
    this.config = config
  }

  public setAppName(appName: string): void {
    this.appName = appName
  }

  public getAppName(): string {
    return this.appName
  }

  public getAppSystemVersion(): string {
    return process.env.VUE_APP_SYSTEM_VERSION
  }

  public setAppId(appId: string): void {
    this.appId = appId
  }

  public getAppId(): string {
    return this.appId
  }

  public setRoutePath(routePath: string) {
    this.routePath = routePath
  }

  public getRoutePath(): string {
    return this.routePath
  }

  public getEnv(): WEnvEnum {
    return <WEnvEnum>process.env.NODE_ENV || WEnvEnum.TEST
  }

  public setAppRunMode(appRunMode: WAppRunModeEnum): void {
    this.appRunMode = appRunMode
  }

  public getAppRunMode(): WAppRunModeEnum {
    return this.appRunMode
  }

  public setAppDependencyMode(appDependencyMode: WAppDependencyModeEnum): void {
    this.appDependencyMode = appDependencyMode
  }

  public getAppDependencyMode(): WAppDependencyModeEnum {
    return this.appDependencyMode
  }

  public isDevelopment(): boolean {
    return this.getEnv() === WEnvEnum.DEVELOPMENT
  }

  public isTest(): boolean {
    return this.getEnv() === WEnvEnum.TEST
  }

  public isUat(): boolean {
    return this.getEnv() === WEnvEnum.UAT
  }

  public isProduction(): boolean {
    return this.getEnv() === WEnvEnum.PRODUCTION
  }

  public isDebugMode(): boolean {
    return this.isDebug
  }

  public setDebugMode(isOpen: boolean): void {
    this.isDebug = isOpen
  }

  public setConfig(config?: IWConfig): void {
    this.config = config
  }
}
