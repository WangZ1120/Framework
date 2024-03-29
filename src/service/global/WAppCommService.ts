export interface IWAppCommService {
  post(type: string, data: any): void

  register(type: string, callback: IWAppCommCallback): void

  unregister(type: string, callback: IWAppCommCallback): void
}

export interface IWAppCommCallback {
  (data: any): void
}

export class WAppCommService implements IWAppCommService {
  private static instance: WAppCommService
  private events: Map<string, Array<IWAppCommCallback>>

  public constructor() {
    if (!window.W_EVENTS_POOL) {
      this.events = new Map()
      window.W_EVENTS_POOL = this.events
    } else {
      this.events = window.W_EVENTS_POOL
    }
  }

  public static get(): WAppCommService {
    if (!WAppCommService.instance) {
      WAppCommService.instance = new WAppCommService()
    }
    return WAppCommService.instance
  }

  public post(type: string, data: any): void {
    let array = this.events.get(type)
    if (!array) {
      console.warn('未找到注册的事件')
      return
    }
    array.forEach((value) => {
      value(data)
    })
  }

  public register(type: string, callback: IWAppCommCallback): void {
    let array = this.events.get(type)
    if (!array) {
      array = []
      this.events.set(type, array)
    }
    array.push(callback)
  }

  public unregister(type: string, callback: IWAppCommCallback): void {
    let array = this.events.get(type)
    if (!array) {
      return
    }
  }
}
