import { IWConfig } from '../config/WConfig'
import { IWReadonlyAppState } from '../app-state/WAppState'
import { IWEventBusCallback } from '../event-bus/WEventBus'
import { WUserEntity } from '../entity/WUserEntity'
import { IWAppService } from '../service/WService'
import { WAppRunModeEnum } from '../config/WEnum'

declare global {
  interface Window {
    wAppConfig: IWConfig
    wAppState: IWReadonlyAppState
    wGlobalAppState: IWReadonlyAppState

    W_APP_SERVICE: IWAppService,
    W_USER: WUserEntity,
    W_EVENTS_POOL: Map<string, Array<IWEventBusCallback>>
  }

  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT: number
      DB_USER: string
      ENV: 'test' | 'dev' | 'prod'
      VUE_APP_MODE: WAppRunModeEnum
      VUE_APP_SYSTEM_VERSION: string
      VUE_APP_ID: string
      VUE_APP_NAME: string
    }
  }
}