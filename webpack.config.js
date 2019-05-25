const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      },
      {
        test: /\.(png|jpg)$/,
        use:{
          loader: 'file-loader'
        }
      }
    ]
  },
  resolve: {
    alias:{
      __src__:path.resolve(__dirname, "src"),
      __lib__:path.resolve(__dirname, "lib")
    },
		modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "lib"), "node_modules"],
    extensions: [ '.tsx', '.ts', '.js', '.html' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HTMLPlugin()
  ]
};