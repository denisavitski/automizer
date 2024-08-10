import { optimizer } from '../src'

optimizer({
  sourceFolder: 'playground/source',
  destinationFolder: 'playground/dest',
  settings: {
    image: (p) => {
      return {
        forceJPG: true,
        placeholder: true,
        webp: true,
        path:
          p.destinationPath.split('.').slice(0, -1).join('.') +
          '.qwerty.' +
          p.destinationPath.split('.').slice(-1).join('.'),
      }
    },
    video: () => {
      return {
        scale: 0.7,
        quality: 50,
      }
    },
    favicon: () => {
      return {
        appDescription: 'qwerty',
      }
    },
    sprite: () => {
      return {
        name: 'qwerty',
      }
    },
    sequence: () => {
      return {
        fps: 2,
      }
    },
  },
})
