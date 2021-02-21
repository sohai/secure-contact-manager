module.exports = {
  extends: "@snowpack/app-scripts-react",
  plugins: ["@snowpack/plugin-typescript"],
  mount: {
    public: { url: "/", static: true },
    "src/renderer": { url: "/dist" },
  },
  buildOptions: {
    baseUrl: "./",
  },
  packageOptions: {
    rollup: {
      plugins: [require("rollup-plugin-pnp-resolve")()],
    },
  },
};
