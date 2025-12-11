const path = require('path');

module.exports = {
  target: 'electron-main',
  entry: {
    main: './src/main.ts',
    preload: './src/preload.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  node: {
    __dirname: false,
  },
};
