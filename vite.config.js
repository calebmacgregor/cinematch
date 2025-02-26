import { defineConfig } from "vite"

export default defineConfig(() => {
	return {
		build: {
			target: "esnext",
			rollupOptions: {
				input: ["index.html", "create.html", "app.html"],
				output: {
					entryFileNames: ["index.html", "create.html", "app.html"]
				}
			}
		}
	}
})
