export enum WServiceTypes {
  MENU = 'WMenuService',
  MICRO_LIFE_CYCLES = 'WMicroLifeCyclesService',
  ROUTER = 'WRouterService',
  LOGGER = 'WLoggerService'
}

export interface IWService {
  get<T>(type: WServiceTypes, ...args: any[]): T;

  bind<T>(type: WServiceTypes, constructor: new (...args: never[]) => T, ...args: any[]): IWService;

  getServices(): Map<string, ServiceConstructor<any>>;
}

export type ServiceConstructor<T> = {
  initialized: boolean
  constructor: { new(...args: any[]): T }
  instance: T | undefined
  args: Array<any> | undefined
}

export class WService implements IWService {
  private services: Map<string, ServiceConstructor<any>>

  constructor() {
    this.services = new Map()
  }

  public get<T>(type: WServiceTypes, ...args: any[]): T {
    let ctor = this.services.get(type)
    if (!ctor) {
      throw new Error(`未找到实例：${type}！`)
    }
    if (!ctor.initialized) {
      ctor.instance = new ctor.constructor(...args)
      ctor.initialized = true
    }
    return ctor.instance
  }

  public bind<T>(type: WServiceTypes, constructor: { new(...args: any[]): T }): IWService {
    let instance = this.services.get(type)
    if (instance) {
      throw new Error(`相同实例以绑定过一次${type}！`)
    }
    this.services.set(type, {
      initialized: false,
      constructor: constructor,
      instance: undefined,
      args: undefined
    })
    return this
  }

  public getServices(): Map<string, ServiceConstructor<any>> {
    return this.services
  }
}

let ServiceContainer: IWService = new WService()
export { ServiceContainer }