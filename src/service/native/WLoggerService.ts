import { IWConfig } from '@/config/WConfig'
import { WAppRunModeEnum } from '@/config/WEnum'

export interface IWReadonlyLoggerService {
  log(tag: string, ...args: any[]): void

  error(tag: string, ...args: any[]): void

  info(tag: string, ...args: any[]): void

  trace(tag: string, ...args: any[]): void

  warn(tag: string, ...args: any[]): void
}

export interface IWLoggerService extends IWReadonlyLoggerService {

}

export class WLoggerService implements IWLoggerService {
  private config: IWConfig
  private background: string
  private fontColor: string

  constructor(config: IWConfig) {
    this.config = config

    switch (this.config.getAppRunMode()) {
      case WAppRunModeEnum.MAIN:
        this.background = '#F44336'
        break
      case WAppRunModeEnum.MICRO:
        this.background = '#43A047'
        break
      default:
        this.background = '#2196F3'
    }
    this.fontColor = '#ffffff'
  }

  public error(tag: string, ...args: any[]): void {
    console.error(`%c ${this.config.getAppName()} %c ${tag} `, `color: ${this.fontColor}; background: ${this.background}`, `background: #E0E0E0`, ...args)
  }

  public info(tag: string, ...args: any[]): void {
    console.info(`%c ${this.config.getAppName()} %c ${tag} `, `color: ${this.fontColor}; background: ${this.background}`, `background: #E0E0E0`, ...args)
  }

  public log(tag: string, ...args: any[]): void {
    console.log(`%c ${this.config.getAppName()} %c ${tag} `, `color: ${this.fontColor}; background: ${this.background}`, `background: #E0E0E0`, ...args)
  }

  public trace(tag: string, ...args: any[]): void {
    console.trace(`%c ${this.config.getAppName()} %c ${tag} `, `color: ${this.fontColor}; background: ${this.background}`, `background: #E0E0E0`, ...args)
  }

  public warn(tag: string, ...args: any[]): void {
    console.warn(`%c ${this.config.getAppName()} %c ${tag} `, `color: ${this.fontColor}; background: ${this.background}`, `background: #E0E0E0`, ...args)
  }

}
