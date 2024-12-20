import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"./runtimeConfig": "./runtimeConfig.browser",
		},
	},
	plugins: [react()],
});
