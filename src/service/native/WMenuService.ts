import { WMenuEntity } from '../../entity/WMenuEntity'
import { IWAppRouterBuilderService } from '../../service/global/WAppRouterBuilderService'
import { AppServiceContainer } from '../../bootstrap/WBootstrap'
import { WAppServiceTypes } from '../../service/global/WAppService'
import { IWConfig } from '../../config/WConfig'

export interface IReadonlyWMenuService {
  getMenus(): Array<WMenuEntity>
}

export interface IWMenuService extends IReadonlyWMenuService {
  setMenus(menus: Array<WMenuEntity>): void

  buildMenus(): Array<WMenuEntity>
}

export class WMenuService implements IWMenuService {
  private appRouterBuilderService: IWAppRouterBuilderService
  private cachedMenus: Array<WMenuEntity> = []
  private config: IWConfig

  constructor(config: IWConfig) {
    this.config = config
    this.appRouterBuilderService = AppServiceContainer.get<IWAppRouterBuilderService>(WAppServiceTypes.APP_ROUTER_BUILDER)
  }

  public setMenus(menus: Array<WMenuEntity> = []): void {
    this.cachedMenus = menus
  }

  public buildMenus(): Array<WMenuEntity> {
    if (!this.cachedMenus || this.cachedMenus.length <= 0) {
      this.cachedMenus = this.appRouterBuilderService.buildMenus()
    }
    return this.cachedMenus
  }

  public getMenus(): Array<WMenuEntity> {
    return this.cachedMenus
  }

}