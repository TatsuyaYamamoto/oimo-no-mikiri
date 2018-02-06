const {resolve} = require("path");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require("webpack-node-externals");

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new UglifyJsPlugin({
    compress: {
      drop_console: true
    },
    comments: false,
  }));
}

const config = {
  entry: {
    bundle: resolve(__dirname, "src/js/index.functions.ts")
  },
  output: {
    path: resolve(__dirname, "functions"),
    filename: "index.functions.js",
    libraryTarget: "this",
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: [
          {loader: 'ts-loader'}
        ]
      },
    ]
  },
  target: 'node',
  externals: [nodeExternals()],
};

module.exports = config;
