import { ImageSequenceGenerator } from '../src'
import { BackgroundRemoval } from '../src/generators/BackgroundRemoval'

await new ImageSequenceGenerator({
  srcFolder: 'playground/source/video/1.mp4',
  destFolder: 'playground/source/video/seq',
  fps: 20,
}).generate()

await new BackgroundRemoval({
  srcFolder: 'playground/source/video/seq',
  destFolder: 'playground/source/video/seq-wb',
  options: {
    type: 'mask',
  },
}).generate()
