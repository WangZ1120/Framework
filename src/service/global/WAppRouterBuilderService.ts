import { RouteRecordRaw } from 'vue-router'
import { WMenuEntity } from '../../entity/WMenuEntity'
import { TestMenuData } from '@/vue-test/mock/TestMenuData'

export interface IWReadonlyAppRouterBuilderService {
}

export interface IWAppRouterBuilderService extends IWReadonlyAppRouterBuilderService {

  buildMenus(): Array<WMenuEntity>;

  buildRoutes(routes: Array<RouteRecordRaw>): Array<RouteRecordRaw>
}

export class WAppRouterBuilderService implements IWAppRouterBuilderService {

  public buildMenus(): Array<WMenuEntity> {
    return TestMenuData.getMenuData()
  }

  public buildRoutes(routes: Array<RouteRecordRaw>): Array<RouteRecordRaw> {
    return routes
  }

}