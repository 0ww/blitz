import {BaseExecutor, executorArgument, getExecutorArgument} from './executor'
import * as fs from 'fs-extra'
import spawn from 'cross-spawn'

interface NpmPackage {
  name: string
  // defaults to latest published
  version?: string
  // defaults to false
  isDevDep?: boolean
}

export interface AddDependencyExecutor extends BaseExecutor {
  packages: executorArgument<NpmPackage[]>
}

export function isAddDependencyExecutor(executor: BaseExecutor): executor is AddDependencyExecutor {
  return (executor as AddDependencyExecutor).packages !== undefined
}

async function getPackageManager(): Promise<'yarn' | 'npm'> {
  if (fs.existsSync('yarn.lock')) {
    return 'yarn'
  }
  return 'npm'
}

export async function addDependencyExecutor(executor: AddDependencyExecutor, cliArgs: any): Promise<void> {
  const packageManager = await getPackageManager()
  const packagesToInstall = getExecutorArgument(executor.packages, cliArgs)
  for (const pkg of packagesToInstall) {
    const args: string[] = []
    pkg.isDevDep ? args.push('-DE') : args.push('-E')
    pkg.version ? args.push(`${pkg.name}@${pkg.version}`) : args.push(pkg.name)
    spawn.sync(packageManager, args, {
      stdio: ['inherit', 'pipe', 'pipe'],
    })
  }
}
