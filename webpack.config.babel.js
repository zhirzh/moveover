import path from 'path';

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

export default {
  entry: [
    'babel-polyfill',
    path.resolve(SRC_DIR, 'index.js'),
  ],

  output: {
    path: DIST_DIR,
    filename: 'move-over.js',
    library: 'MoveOver',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: SRC_DIR,
        loader: 'babel',
      },
    ],
  },
};
