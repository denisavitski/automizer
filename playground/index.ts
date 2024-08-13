import { automizer } from '../src'

automizer({
  sourceFolder: 'playground/source',
  destinationFolder: 'playground/dest',
  clearDestination: true,
  settings: {
    head: () => {
      return {
        url: 'https://denisavitski.netlify.app/',
      }
    },
  },
})
