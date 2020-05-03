import {BaseExecutor, executorArgument, getExecutorArgument} from './executor'
import jscodeshift from 'jscodeshift'
import {filePrompt} from './file-prompt'

export interface FileTransformExecutor extends BaseExecutor {
  selectTargetFiles?(api: any, cliArgs: any): any[]
  singleFileSearch?: executorArgument<string>
  transform(fileInfo: any, api: any, options: any): any
}

export function isFileTransformExecutor(executor: BaseExecutor): executor is FileTransformExecutor {
  return (executor as FileTransformExecutor).transform !== undefined
}

export async function fileTransformExecutor(executor: FileTransformExecutor, cliArgs: any): Promise<void> {
  const fileToTransform: string = await filePrompt({
    context: cliArgs,
    globFilter: getExecutorArgument(executor.singleFileSearch, cliArgs),
    getChoices: executor.selectTargetFiles,
  })
  jscodeshift.run(executor.transform, [fileToTransform])
}
