/*
 * @Author: caidwang hust_wsc@163.com
 * @Date: 2024-10-12 13:24:50
 * @LastEditors: caidwang hust_wsc@163.com
 * @LastEditTime: 2024-10-14 08:32:09
 * @FilePath: /murphy/webpack.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: caidwang hust_wsc@163.com
 * @Date: 2024-10-12 13:24:50
 * @LastEditors: caidwang hust_wsc@163.com
 * @LastEditTime: 2024-10-14 08:28:38
 * @FilePath: /murphy/webpack.rules.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new ESLintPlugin({
      context: path.join(__dirname, 'src'),
      emitError: true,
      emitWarning: true,
    })
  ],
  module: {
    rules: [
      {
        test: /\.?(js|ts)(x?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', ['@babel/preset-react', {"runtime": "automatic"}]]
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].ext]',
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  devServer: {
    port: 3000
  },

}