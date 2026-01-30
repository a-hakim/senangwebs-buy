const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { EsbuildPlugin } = require('esbuild-loader');
module.exports = (env, argv) => {
  const commonConfig = {
    entry: {
      swb: ['./src/js/swb.js', './src/css/swb.css'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    }
  };

  const commonOutput = {
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'SWB',
      type: 'umd',
    },
    globalObject: 'this'
  };

  const devConfig = Object.assign({}, commonConfig, {
    mode: 'development',
    output: Object.assign({}, commonOutput, {
      filename: 'swb.js',
    }),
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'swb.css'
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ]
  });

  const prodConfig = Object.assign({}, commonConfig, {
    mode: 'production',
    output: Object.assign({}, commonOutput, {
      filename: 'swb.min.js',
    }),
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'swb.min.css'
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    optimization: {
      minimizer: [
        new EsbuildPlugin({
          target: 'es2015',
          css: true
        })
      ],
    },
  });

  return [devConfig, prodConfig];
};