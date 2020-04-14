import File from 'vinyl'
import {absolutePathTransform} from '../utils'
import {Rule} from '../types'
import {fileTransformStream} from '../pipeline'

export default function configure(opts: {srcPath?: string}): Rule {
  const filePathTransformer = absolutePathTransform(opts.srcPath)
  const transformer = filePathTransformer(pathTransformer)

  // XXX: invariant - cannot have multiple paths

  return stream =>
    stream.pipe(
      fileTransformStream((file: File) => {
        // console.log({filePath: file.path})
        file.path = transformer(file.path)
        // console.log({filePathAfter: file.path})
        return file
      }),
    )
}

export function pathTransformer(path: string) {
  const regex = new RegExp(`(?:\\/?app\\/.*?\\/?)(pages\\/.+)$`)
  return (regex.exec(path) || [])[1] || path
}
