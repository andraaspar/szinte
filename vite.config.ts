import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
	plugins: [solid({ hot: false })],
	base: "./",
	server: {
		port: 8080,
	},
})
