import { defineConfig } from "vite"

export default defineConfig(() => {
	return {
		build: {
			target: "esnext",
			rollupOptions: {
				input: ["index.html", "create/index.html", "src/app.html"]
			}
		}
	}
})
