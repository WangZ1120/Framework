
export interface IWReadonlyUser {
  getUsername(): string
}

export interface IWUser extends IWReadonlyUser {
  setUsername(username: string): void
}

export interface IWUserExecutor extends IWUser, IWReadonlyUser {}

export class WUser implements IWUser {
  private executor: IWUserExecutor

  constructor(executor: IWUserExecutor) {
    this.executor = executor
  }

  public setUsername(username: string): void {
    this.executor.setUsername(username)
  }

  public getUsername(): string {
    return this.executor.getUsername()
  }
}

export class WGlobalUser implements IWUserExecutor {
  public setUsername(username: string): void {
    window.W_USER.username = username
  }

  public getUsername(): string {
    return window.W_USER.username
  }
}

export class WNativeUser implements IWUserExecutor {
  public username: string = ''

  public setUsername(username: string): void {
    this.username = username
  }

  public getUsername(): string {
    return this.username
  }
}