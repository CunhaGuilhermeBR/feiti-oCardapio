import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['app/**/*.{ts,js}', '!node_modules'],
	outDir: 'build',
	target: 'es2020',
	format: ['cjs', 'esm'],
	sourcemap: false,
	splitting: false,
	clean: true,
	loader: {
		'.pug': 'text',
		'.ico': 'file',
	},
	onSuccess: 'cp -r app/infrastructure/http/views build/infrastructure/http',
})
