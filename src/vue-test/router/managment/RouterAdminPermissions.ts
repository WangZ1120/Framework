import { ServiceContainer, WServiceTypes } from '@/service/native/WService'
import { IWRouterService } from '@/service/native/WRouterService'

export class RouterAdminPermissions {
  public static routerService = ServiceContainer.get<IWRouterService>(WServiceTypes.ROUTER)

  public static pushAdminAccountEdit(): void {
    this.routerService.push('/admin/account/edit')
  }
}
