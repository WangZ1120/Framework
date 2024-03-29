import { FrameworkLifeCycles, LoadableApp, ObjectType } from 'qiankun'
import { IWConfig } from '@/config/WConfig'

export interface IWReadonlyMicroLifeCyclesService {
  onBeforeLoad?(app: LoadableApp<ObjectType>, global: typeof window): any

  onBeforeMount?(app: LoadableApp<ObjectType>, global: typeof window): any

  onAfterMount?(app: LoadableApp<ObjectType>, global: typeof window): any

  onBeforeUnmount?(app: LoadableApp<ObjectType>, global: typeof window): any

  onAfterUnmount?(app: LoadableApp<ObjectType>, global: typeof window): any
}

export interface IWMicroLifeCyclesService extends IWReadonlyMicroLifeCyclesService {
  bindLifeCycles(): FrameworkLifeCycles<ObjectType>

  addLifeCycles(lifeCycle: IWMicroLifeCyclesService): void

  removeLifeCycles(lifeCycle: IWMicroLifeCyclesService): boolean
}

export class WMicroLifeCyclesService implements IWMicroLifeCyclesService {
  private config: IWConfig
  private lifeCycles: Map<IWMicroLifeCyclesService, IWMicroLifeCyclesService> = new Map()

  constructor(config: IWConfig) {
    this.config = config
  }

  public bindLifeCycles(): FrameworkLifeCycles<ObjectType> {
    return {
      beforeLoad: (app: LoadableApp<ObjectType>, global: typeof window): any =>
        this.onBeforeLoad(app, global),
      beforeMount: (app: LoadableApp<ObjectType>, global: typeof window): any =>
        this.onBeforeMount(app, global),
      afterMount: (app: LoadableApp<ObjectType>, global: typeof window): any =>
        this.onAfterMount(app, global),
      beforeUnmount: (app: LoadableApp<ObjectType>, global: typeof window): any =>
        this.onBeforeUnmount(app, global),
      afterUnmount: (app: LoadableApp<ObjectType>, global: typeof window): any =>
        this.onAfterUnmount(app, global)
    }
  }

  public addLifeCycles(lifeCycle: IWMicroLifeCyclesService): void {
    this.lifeCycles.set(lifeCycle, lifeCycle)
  }

  public removeLifeCycles(lifeCycle: IWMicroLifeCyclesService): boolean {
    return this.lifeCycles.delete(lifeCycle)
  }

  public onBeforeLoad(app: LoadableApp<ObjectType>, global: typeof window): any {
    this.lifeCycles.forEach((value, key) => {
      if (key.onBeforeLoad) key.onBeforeLoad(app, global)
    })
  }

  public onBeforeMount(app: LoadableApp<ObjectType>, global: typeof window): any {
    this.lifeCycles.forEach((value, key) => {
      if (key.onBeforeMount) key.onBeforeMount(app, global)
    })
  }

  public onAfterMount(app: LoadableApp<ObjectType>, global: typeof window): any {
    this.lifeCycles.forEach((value, key) => {
      if (key.onAfterMount) key.onAfterMount(app, global)
    })
  }

  public onBeforeUnmount(app: LoadableApp<ObjectType>, global: typeof window): any {
    this.lifeCycles.forEach((value, key) => {
      if (key.onBeforeUnmount) key.onBeforeUnmount(app, global)
    })
  }

  public onAfterUnmount(app: LoadableApp<ObjectType>, global: typeof window): any {
    this.lifeCycles.forEach((value, key) => {
      if (key.onAfterUnmount) key.onAfterUnmount(app, global)
    })
  }
}