import {prompt as enquirer} from 'enquirer'
import jscodeshift from 'jscodeshift'
import globby from 'globby'

enum SearchType {
  file,
  directory,
}

interface FilePromptOptions {
  globFilter?: string
  getChoices?(jscodeshift: jscodeshift.JSCodeshift, context: any): string[]
  searchType?: SearchType
  context: any
}

async function getMatchingFiles(filter: string = ''): Promise<string[]> {
  return globby(filter, {expandDirectories: true})
}

export async function filePrompt(options: FilePromptOptions): Promise<string> {
  jscodeshift('asdf', {})
  const choices = options.getChoices
    ? options.getChoices(jscodeshift, options.context)
    : await getMatchingFiles(options.globFilter)
  const prompt = enquirer({
    type: 'autocomplete',
    name: 'file',
    message: 'Select the target file',
    // @ts-ignore
    limit: 10,
    choices,
  })
  const {file}: {file: string} = await prompt.run()
  return file
}
