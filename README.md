# 架构设计

实现一个主应用、子应用和库可以无缝接入的基础框架。

## 通信方式

用于应用间通信的类 `WAppCommunication`，实现方式类似 `WEventBus`。

```typescript
interface WAppCommService {
  on()
  off()
  emit()
}
```

通信方式：

```typescript
/** 全局：构建路由和菜单 */
class WAppRouterBuilderService {
  appCommService: IWAppCommService

  constructor(): void {
    this.appCommService = WService.get(WAppServiceTypes.APP_COMM_SERVICE)
    this.appCommService.on('menus-build', (data) => this.buildMenus(data))
  }

  buildMenus(): void {
    this.appCommService.emit('menus-build', { ... })
  }

  buildRoutes(routes: Array): void {
    this.appCommService.emit('routes-build', { ... })
  }
}

class WAppRouterService {
  appCommService: IWAppCommService
  appWebHistoryService: IWAppWebHistoryService

  constructor(): void {
    this.appCommService = WService.get(WAppServiceTypes.APP_COMM_SERVICE)
    this.appWebHistoryService = WService.get(WAppServiceTypes.APP_WEB_HISTORY_SERVICE)
    this.appCommService.on('routes-push', (router, path) => this.push(router, path))
  }

  push(microRouter, path): void {
    if (this.appWebHistoryService.isSame(path)) {
      mainRouter.push(path)
    } else {
      microRouter.push(path)
    }
  }
}

/** 局部：菜单操作服务 */
class WMenusService {
  cachedMenus: Array

  constructor(): void {
    this.appCommService.on('menus-build', (data) => this.cachedMenus = data)
  }
}

/** 局部：路由操作服务 */
class WRouterService {
  cachedRoutes: Array

  constructor(): void {
    this.appCommService.on('routes-build', (data) => this.cachedRoutes = data)
  }

  push(path: string): void {
    this.appCommService.emit('routes-push', { router, path })
  }
}
```

### 路由管理（Router）

不管是主应用还是微应用，都要处理路由问题。目前的方案不管是主应用还是微应用，最后打包的时候都以运行 qiankun 的主应用为主，为此方案就简单了。

路由管理器根据主应用所依赖的微应用来确定需要哪些菜单，统一由主应用调用相关 API 负责渲染、管理和拦截，尽可能将路由逻辑从主应用中剥离。

实现类：`RouterBuilderService`

1. 根据主应用所依赖的微应用，通过接口获取相关菜单数据。
2. 将菜单数据与微应用的路由相互关联，构建出可供 Vue 使用的路由数据
3. 拦截路由，做一些相关操作

> 注意事项：
> 1. 当项目为微应用的时候，不需要注册 RouterBuilderService，路由构建统一交给主应用。
> 2. 不管是主应用还是微应用都需要调用对应的 API 将本地路由传递过去，构建对应的 Vue Router 后，再使用 app.use() 进行设置。

使用方式：

```typescript
import routes from './router'

/** 主应用 */
class MainBootstrap extends WMainHelper {
  public onStart(config?: any): void {
    const buildRouters = this.buildRouter(routes)
    app.use(buildRouters)
  }
}

import routes from './router'

/** 微应用 */
export class MicroBootstrap extends WMicroHelper {
  public onMount(props: any, config: IWConfig): void {
    const history = createWebHistory('/permission')
    const buildRouters = this.buildRouter(routers)
    const router = createRouter({ history: history, buildRouters })
    app.use(router)
  }
}
```

### 数据的全局共享和局部共享

对数据的设计分成 `全局共享` 和 `局部共享` 两种，全局共享支持应用间共享，局部共享仅只是应用内共享。其中有几点要注意：

1. 主应用、微应用都只能使用局部共享，这意味着主项目也不能跟微项目直接进行数据共享。
2. 多应用之间共享数据只能使用单独提供的全局共享 API 来进行通信。

通过这种方式，可以把一些确定的逻辑，例如登录信息、菜单信息等全部放到 `全局共享` 中，这些业务很容易确定。
其他的业务都由应用自身处理，也就放到局部共享中。
