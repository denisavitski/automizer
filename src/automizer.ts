import { existsSync } from 'fs'
import { inputFiles, InputFilesParameters } from './inputFiles'
import { optimize, OptimizeOptions } from './optimize'
import { clear, outputFiles } from './utils/fs'

export type AutomizerParameters = InputFilesParameters &
  OptimizeOptions & {
    clearDestination?: boolean
  }

export async function automizer(parameters: AutomizerParameters) {
  let input = await inputFiles(parameters)

  if (!parameters.clearDestination) {
    input = input.filter((item) => !existsSync(item.settings.destinationPath))
  } else {
    await clear(parameters.destinationFolder)
  }

  const optimized = await optimize(input, parameters)

  await outputFiles(optimized)
}
