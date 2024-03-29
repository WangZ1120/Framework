export interface IWExport {
  [propName: string]: any
}

export interface IWDynamicExport {
  addExport(propName: string, obj: any): void
  addExports(exports: IWExport): void
}

export class WDynamicExport implements IWDynamicExport {
  public addExport(propName: string, obj: any): void {
    Object.assign(WInit, { [propName]: obj })
  }

  public addExports(exports: IWExport): void {
    Object.assign(WInit, exports)
  }
}

export const WInit: IWExport = {}
