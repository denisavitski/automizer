import { VideoOptimizer } from '../src'

await new VideoOptimizer({
  srcFolder: 'playground/source/videos/',
  destFolder: 'playground/result/videos/',
  scale: 0.8,
}).optimize()
