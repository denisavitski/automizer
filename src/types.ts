import type { writeFile } from 'fs/promises'
import type { FaviconOptions } from 'favicons'

export type SourceDefaultSettings = {
  [key: string]: any
}

export type SourceSetting = { value: any }

export type Source<
  B = Buffer | File,
  T extends string = string,
  S extends SourceDefaultSettings = {}
> = {
  content: B
  type: T
  settings: S
}

export type SkipSource = Source<
  Buffer | File,
  'skip',
  {
    destinationPath: string
  }
>

export type ImageSource = Source<
  Buffer | File,
  'image',
  {
    destinationPath: string
    quality?: number
    scale?: number
    placeholder?: boolean
    webp?: boolean
    forceJPG?: boolean | string
  }
>

export type VideoSource = Source<
  Buffer | File,
  'video',
  {
    destinationPath: string
    quality?: number
    scale?: number
    fps?: number
  }
>

export type FaviconSource = Source<
  Buffer | File,
  'favicon',
  {
    destinationPath: string
    destinationHtmlPath: string
  } & FaviconOptions
>

export type SpriteSource = Source<
  Array<{ name: string; data: Buffer | File }>,
  'sprite',
  {
    destinationPath: string
    name?: string
    removeStroke?: boolean
    removeStrokeOpacity?: boolean
    removeFill?: boolean
    removeFillOpacity?: boolean
  }
>

export type SequenceSource = Source<
  Buffer | File,
  'sequence',
  {
    destinationPath: string
    fps?: number
    frameExtension?: 'png' | 'jpg'
  }
>

export interface HeadMetaSettings {
  title?: string
  description?: string
  metaTitle?: string
  url?: string
  keywords?: string
}

export type HeadSettings = HeadMetaSettings &
  FaviconSource['settings'] & {
    destinationCoverPath: string
  }

export type HeadSource = Source<
  { favicon?: Buffer | File; cover?: Buffer | File },
  'head',
  HeadSettings
>

export type KnownSource =
  | VideoSource
  | ImageSource
  | SkipSource
  | FaviconSource
  | SpriteSource
  | SequenceSource
  | HeadSource

export type OutputItemData = Parameters<typeof writeFile>['1']

export interface OutputItem {
  data: OutputItemData
  destinationPath: string
}

export type Output = Array<OutputItem>
