// vite.config.js
import { defineConfig } from "file:///D:/OSTECHGithub/NewOstechRepo/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/OSTECHGithub/NewOstechRepo/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  // Optional: Add resolve to handle paths better
  resolve: {
    alias: {
      "@": "/src"
      // For cleaner imports, optional
    }
  },
  // Proxy configuration
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3024",
        // Backend server URL
        changeOrigin: true,
        // Change the origin of the host header to the target URL
        secure: false
        // Set to false if you're not using HTTPS
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxPU1RFQ0hHaXRodWJcXFxcTmV3T3N0ZWNoUmVwb1xcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcT1NURUNIR2l0aHViXFxcXE5ld09zdGVjaFJlcG9cXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L09TVEVDSEdpdGh1Yi9OZXdPc3RlY2hSZXBvL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICAvLyBPcHRpb25hbDogQWRkIHJlc29sdmUgdG8gaGFuZGxlIHBhdGhzIGJldHRlclxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogJy9zcmMnLCAvLyBGb3IgY2xlYW5lciBpbXBvcnRzLCBvcHRpb25hbFxuICAgIH0sXG4gIH0sXG4gIC8vIFByb3h5IGNvbmZpZ3VyYXRpb25cbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjMwMjRcIiwgLy8gQmFja2VuZCBzZXJ2ZXIgVVJMXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy8gQ2hhbmdlIHRoZSBvcmlnaW4gb2YgdGhlIGhvc3QgaGVhZGVyIHRvIHRoZSB0YXJnZXQgVVJMXG4gICAgICAgIHNlY3VyZTogZmFsc2UsIC8vIFNldCB0byBmYWxzZSBpZiB5b3UncmUgbm90IHVzaW5nIEhUVFBTXG4gICAgICAgICB9LFxuICAgIH0sXG4gIH0sIFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRTLFNBQVMsb0JBQW9CO0FBQ3pVLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUE7QUFBQSxFQUVqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUE7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsUUFBUTtBQUFBO0FBQUEsTUFDUDtBQUFBLElBQ0w7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
