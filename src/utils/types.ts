import { writeFile } from 'fs/promises'

export type WriteFileData = Parameters<typeof writeFile>['1']

export interface OutputItem {
  data: WriteFileData
  destinationPath: string
}

export type Output = Array<OutputItem>
