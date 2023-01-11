import { buildSync } from 'esbuild'
import { dependencies, devDependencies } from './package.json'

buildSync({
	entryPoints: ['src/server.ts'],
	external: [...Object.keys(dependencies), ...Object.keys(devDependencies)],
	bundle: true,
	outdir: '.build',
})
