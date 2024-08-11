import { parse } from 'node-html-parser'
import { Output, SpriteSource } from './types'
import { getBuffer } from './utils/buffer'

export async function generateSprite(source: Omit<SpriteSource, 'type'>) {
  const output: Output = []

  const { settings } = source

  const spriteName = source.settings.name || 'sprite'

  const svgOpenTag = `<svg id="${spriteName}" xmlns="http://www.w3.org/2000/svg">`
  const svgCloseTag = '</svg>'

  let spriteString = svgOpenTag

  for await (const item of source.content) {
    const buffer = await getBuffer(item.data)

    const svgString = buffer.toString()

    const root = parse(svgString)
    const icon = root.querySelector('svg')!

    icon.removeAttribute('width')
    icon.removeAttribute('height')

    if (settings.removeFill) {
      icon.querySelectorAll('*').forEach((child) => {
        child.removeAttribute('fill')
      })
    }

    if (settings.removeStroke) {
      icon.querySelectorAll('*').forEach((child) => {
        child.removeAttribute('stroke')
      })
    }

    const symbolOpenTag = `<symbol id="${`${spriteName}:${item.name}`}" viewBox="${icon.getAttribute(
      'viewBox'
    )}">`
    const symbolContent = icon.innerHTML
    const symbolCloseTag = `</symbol>`

    const symbol = symbolOpenTag + symbolContent + symbolCloseTag
    spriteString += symbol
  }

  spriteString += svgCloseTag

  output.push({
    data: spriteString,
    destinationPath: source.settings.destinationPath,
  })

  return output
}
