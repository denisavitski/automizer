import { ImageOptimizer, SVGSpriteGenerator, UnionTypeGenerator } from '../src'

await new ImageOptimizer({
  srcFolder: 'playground/source/images/',
  destFolder: 'playground/result/images/',
}).optimize()

new SVGSpriteGenerator({
  srcFolder: 'playground/source/icons',
  destFile: 'playground/result/sprite.svg',
  name: 'xx',
}).generate()
