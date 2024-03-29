import { WAppDependencyModeEnum, WAppRunModeEnum } from '../config/WEnum'

export class WAppRunDependency {
  public static dependencyToRun(dependency: WAppDependencyModeEnum): WAppRunModeEnum {
    if (dependency === WAppDependencyModeEnum.INDEPENDENT) {
      return WAppRunModeEnum.INDEPENDENT
    } else if (dependency === WAppDependencyModeEnum.MAIN) {
      return WAppRunModeEnum.MAIN
    } else if (dependency === WAppDependencyModeEnum.MICRO) {
      return WAppRunModeEnum.MICRO
    } else if (dependency === WAppDependencyModeEnum.LIB) {
      return WAppRunModeEnum.LIB
    }
    return WAppRunModeEnum.INDEPENDENT
  }

  public static runToDependency(run: WAppRunModeEnum): WAppDependencyModeEnum {
    if (run === WAppRunModeEnum.INDEPENDENT) {
      return WAppDependencyModeEnum.INDEPENDENT
    } else if (run === WAppRunModeEnum.MAIN) {
      return WAppDependencyModeEnum.MAIN
    } else if (run === WAppRunModeEnum.MICRO) {
      return WAppDependencyModeEnum.MICRO
    } else if (run === WAppRunModeEnum.LIB) {
      return WAppDependencyModeEnum.LIB
    }
    return WAppDependencyModeEnum.INDEPENDENT
  }
}
