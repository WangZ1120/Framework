import { ServiceContainer, WServiceTypes } from '@/service/native/WService'
import { IWLoggerService } from '@/service/native/WLoggerService'

export type WWebHistory = {
  routePath: string
  routePathPrefix: string
}

export interface IWReadonlyAppWebHistoryService {

}

export interface IWAppWebHistoryService extends IWReadonlyAppWebHistoryService {
  addHistory(routePath: string, routePathPrefix: string): void

  getLastHistory(): WWebHistory | undefined
}

const TAG = 'WAppWebHistoryService'

export class WAppWebHistoryService implements IWAppWebHistoryService {
  private routerHistories: Array<WWebHistory>
  private loggerService: IWLoggerService

  constructor() {
    this.routerHistories = []
    this.loggerService = ServiceContainer.get<IWLoggerService>(WServiceTypes.LOGGER)
  }

  public addHistory(routePath: string, routePathPrefix: string): void {
    this.loggerService.log(TAG, `添加历史记录 routePath: ${routePath} routePathPrefix: ${routePathPrefix}`)
    this.routerHistories.push({ routePath, routePathPrefix })
  }

  public getLastHistory(): WWebHistory | undefined {
    return this.routerHistories[this.routerHistories.length - 1]
  }
}