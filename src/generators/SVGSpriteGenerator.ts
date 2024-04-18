import { parse } from 'node-html-parser'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

export interface SVGSpriteGeneratorParamters {
  srcFolder: string
  destFile: string
  name?: string
  removeStroke?: boolean
  removeFill?: boolean
}

export class SVGSpriteGenerator {
  #srcFolder: string
  #destFile: string
  #name: string

  #removeStroke: boolean
  #removeFill: boolean

  constructor(parameters: SVGSpriteGeneratorParamters) {
    this.#srcFolder = parameters.srcFolder
    this.#destFile = parameters.destFile
    this.#name = parameters.name || 'sprite'

    this.#removeStroke = parameters.removeStroke || false
    this.#removeFill = parameters.removeFill || false
  }

  public generate() {
    const files = this.#readFiles()

    const svgOpenTag = `<svg id="${this.#name}" xmlns="http://www.w3.org/2000/svg">`
    const svgCloseTag = '</svg>'

    let svg = svgOpenTag

    files.forEach((file) => {
      const root = parse(file.content)
      const icon = root.querySelector('svg')!

      icon.removeAttribute('width')
      icon.removeAttribute('height')

      if (this.#removeFill) {
        icon.querySelectorAll('*').forEach((child) => {
          child.removeAttribute('fill')
        })
      }

      if (this.#removeStroke) {
        icon.querySelectorAll('*').forEach((child) => {
          child.removeAttribute('stroke')
        })
      }

      const symbolOpenTag = `<symbol id="${this.#getFullName(
        file.name,
      )}" viewBox="${icon.getAttribute('viewBox')}">`
      const symbolContent = icon.innerHTML
      const symbolCloseTag = `</symbol>`

      const symbol = symbolOpenTag + symbolContent + symbolCloseTag
      svg += symbol
    })

    svg += svgCloseTag

    writeFileSync(this.#destFile, svg)
  }

  #readFiles(directory: string = this.#srcFolder) {
    let files: Array<{ name: string; content: string }> = []

    const filesInDirectory = readdirSync(directory)

    for (const file of filesInDirectory) {
      const srcPath = join(directory, file)

      if (statSync(srcPath).isDirectory()) {
        const result = this.#readFiles(srcPath)
        files = [...files, ...result]
      } else {
        const name = file.split('.').slice(0, -1).join()
        const content = readFileSync(srcPath, { encoding: 'utf8' }).toString()

        files.push({ name, content })
      }
    }

    return files
  }

  #getFullName(name: string) {
    return `${this.#name}:${name}`
  }
}
