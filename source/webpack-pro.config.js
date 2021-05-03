const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // 还需要在package.json中定义browserslist
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: ['postcss-preset-env'],
      },
    },
  },
];
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      // airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
      // eslint-loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true,
        },
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [...commonCssLoader],
          },
          {
            test: /\.less$/,
            use: [...commonCssLoader, 'less-loader'],
          },
          {
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              esModule: false,
              name: '[hash:10].[ext]',
              outputPath: 'imgs',
            },
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
              esModule: false,
            },
          },
          {
            exclude: /\.(css|js|less|jpg|png|gif|html)$/,
            loader: 'file-loader',
            options: {
              name: '[hash:10].[ext]',
              outputPath: 'media',
              publicPath: resolve(__dirname, 'build/media'),
            },
          },
          /*
            js兼容性处理：babel-loader @babel/core
            1. 基本js兼容性处理 --> @babel/preset-env
              问题：只能转换基本语法，如promise高级语法不能转换
            2. 全部js兼容性处理 --> @babel/polyfill
              问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
            3. 需要做兼容性处理的就做：按需加载  --> core-js
          */
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              // 预设：指示babel做怎么样的兼容性处理
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // 按需加载
                    useBuiltIns: 'usage',
                    // 指定core-js版本
                    corejs: {
                      version: 3,
                    },
                    // 指定兼容性做到哪个版本浏览器
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17',
                    },
                  },
                ],
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built[contenthash:10].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  mode: 'production',
  devtool: 'source-map',
};
