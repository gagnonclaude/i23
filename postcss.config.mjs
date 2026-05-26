const config = {
  plugins: {
    "@tailwindcss/postcss": {
      lightningcss: {
        targets: {
          safari: (14 << 16),
          ios_saf: (14 << 16),
          chrome: (90 << 16),
          firefox: (90 << 16),
          edge: (90 << 16),
        },
      },
    },
  },
};

export default config;
