import {BaseExecutor, executorArgument, getExecutorArgument} from './executor'
import {Generator, GeneratorOptions} from '@blitzjs/generator'

export interface NewFileExecutor extends BaseExecutor {
  templatePath: executorArgument<string>
  templateValues: executorArgument<{[key: string]: string}>
  destinationRoot?: executorArgument<string>
  destinationPathPrompt?: executorArgument<string>
}

export function isNewFileExecutor(executor: BaseExecutor): executor is NewFileExecutor {
  return (executor as NewFileExecutor).templatePath !== undefined
}

interface TempGeneratorOptions extends GeneratorOptions {
  templateRoot: string
  templateValues: any
}

class TempGenerator extends Generator<TempGeneratorOptions> {
  sourceRoot: string
  templateValues: any

  constructor(options: TempGeneratorOptions) {
    super(options)
    this.sourceRoot = options.templateRoot
    this.templateValues = options.templateValues
  }

  getTemplateValues() {
    return this.templateValues
  }
}

export async function newFileExecutor(executor: NewFileExecutor, cliArgs: any): Promise<void> {
  const generator = new TempGenerator({
    destinationRoot: getExecutorArgument(executor.destinationRoot, cliArgs) || '',
    templateRoot: getExecutorArgument(executor.templatePath, cliArgs),
    templateValues: getExecutorArgument(executor.templateValues, cliArgs),
  })
  await generator.run()
}
