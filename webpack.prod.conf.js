//线上正式环境的打包配置
var webpack = require('webpack');
var path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  mode: "production",
  devtool: false,
  entry:'./src/app.js',
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "bundle.js",
    libraryTarget: 'commonjs2' // 采用通用模块定义
  },
  resolve: {
      //设置它引入js文件时可以不用写.js后缀
      extensions: [".js", ".jsx"],
      //别名：如果之前是这样引用的import "../../api/service.js",现在可以这样使用import "api/service.js"
      alias: {}
  },
  module: {
      rules: [{
              test: /\.(js|jsx)$/,
              exclude: /node_moudles/,
              use: [{
                  loader: "babel-loader",
                  
              }]
          },
          
          {
              test: /\.(css|less)$/,
              exclude: /node_moudles/,
              use: ExtractTextPlugin.extract({
                      fallback: "style-loader",
                      use: [{
                              loader: "css-loader",
                              options: {
                                importLoaders: 1,
                                modules: true,
                                sourceMap: true,
                                modules: {
                                  localIdentName: '[local]',
                                },
                            }
                          },
                          {   
                              loader: "postcss-loader"
                          },
                          {
                            loader: "less-loader"
                        },
                      ]
                  }

              )

          },

          {
              test: /\.(jpg|jpeg|png|svg|gif|bmp)/i,
              use: [{
                  loader: "url-loader",
                  options: {
                      publicPath: "",
                      outputPath: "img/",
                      limit: 5000
                  }
              }]
          },
          {
              test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
              use: [{
                  loader: "url-loader",
                  options: {
                      publicPath: "",
                      limit: 5000
                  }
              }]
          },

          {
              test: /\.html$/,
              use: [{
                      loader: "html-loader",
                      options: {
                          attrs: ["img:src", "img:data-src"]

                      }

                  }

              ]
          },

      ]
  },
  devServer: {
    contentBase: './lib'
  },
  plugins: [
      new LodashModuleReplacementPlugin(),
      //提取css
      new ExtractTextPlugin({
          filename: 'style.css',
          disable: true
      }),

      new CleanWebpackPlugin(),
      
      // html 模板插件
      // new HtmlWebpackPlugin({
      //     filename: "index.html",
      //     template: path.join(__dirname, "./example/src/index.html"),
      //     minify: {
      //         removeComments: true,
      //         // 删除空格
      //         collapseInlineTagWhitespace: true,
      //         collapseWhitespace: true

      //     }
      // }),
      

      new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: JSON.stringify('production')
          }
      }),
      
      new webpack.NamedChunksPlugin(),
      new webpack.NamedModulesPlugin()
      

  ],
  optimization: { //webpack4 代码压缩
      minimize: true, //第一种方法
      //第二种方法
      // minimizer: [
      //     new UglifyJs({
      //         uglifyOptions: {
      //             parallel: true,
      //             sourceMap: true,
      //             cache: true,
      //             compress: {
      //                 warnings: false,
      //                 drop_console: true,
      //             }
      //         }

      //         })
      //     ],

      },

  }