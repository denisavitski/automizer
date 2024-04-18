import { ImageOptimizer } from '../src/index'

await new ImageOptimizer({
  srcFolder: 'playground/source/images',
  destFolder: 'playground/assets/images',
}).optimize()
