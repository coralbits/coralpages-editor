module.exports = {
  serve: {
    proxy: {
      "/api": {
        target: "http://localhost:8006",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
