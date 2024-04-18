import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig((env) => {
  if (env.command === 'build') {
    return {
      plugins: [
        dtsPlugin({
          include: 'src',
        }),
      ],
      build: {
        ssr: 'src/index.ts',
        outDir: 'lib',
      },
    }
  }

  return {}
})
