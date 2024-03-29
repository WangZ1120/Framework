export enum WAppServiceTypes {
  APP_COMM = 'WAppCommService',
  APP_ROUTER_BUILDER = 'WAppRouterBuilderService',
  APP_ROUTER_INTERCEPTION = 'WAppRouterInterceptionService',
  APP_ROUTER = 'WAppRouterService',
  APP_WEB_HISTORY = 'WAppWebHistoryService',
  APP_LOGIN = 'WAppLoginService',
}

export interface IWAppService {
  get<T>(type: WAppServiceTypes, ...args: any[]): T;

  bind<T>(type: WAppServiceTypes, constructor: new (...args: never[]) => T, ...args: any[]): void;

  getServices(): Map<string, WServiceConstructor<any>>;
}

export type WServiceConstructor<T> = {
  initialized: boolean
  ctor: { new(...args: any[]): T }
  instance: T | undefined
  args: Array<any> | undefined
}

export class WAppService implements IWAppService {
  private services: Map<string, WServiceConstructor<any>>

  constructor() {
    this.services = new Map()
  }

  public get<T>(type: WAppServiceTypes, ...args: any[]): T {
    let serviceCtor = this.services.get(type)
    if (!serviceCtor) {
      throw new Error(`未找到实例：${type}！`)
    }
    if (!serviceCtor.initialized) {
      let ctor = new serviceCtor.ctor(...args)
      serviceCtor.instance = ctor
      serviceCtor.initialized = true
    }
    return serviceCtor.instance
  }

  public bind<T>(type: WAppServiceTypes, constructor: { new(...args: any[]): T }): void {
    let instance = this.services.get(type)
    if (instance) {
      throw new Error(`相同实例以绑定过一次${type}！`)
    }
    this.services.set(type, {
      initialized: false,
      ctor: constructor,
      instance: undefined,
      args: undefined
    })
  }

  public getServices(): Map<string, WServiceConstructor<any>> {
    return this.services
  }
}
