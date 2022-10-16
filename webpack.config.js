const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const htmlPlugins = ['index', 'packaging', 'brand-identity', 'layout', 'others'].map(key => (new HtmlWebpackPlugin({
  filename: `${key}.html`,
  template: `./src/${key}.html`,
  minify: false
})))

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    // devtool: false,
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'main.js',
      clean: true,
      assetModuleFilename: "assets/[name][ext]",
    },
    plugins: [
      // new HtmlWebpackPlugin({
      //   filename: "index.html",
      //   template: './src/index.html',
      //   minify: {
      //     collapseWhitespace: false,
      //   }
      // }),
      ...htmlPlugins,
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: {
                quality: 75,
              },
            },
          },
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.(scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: () => [
                    require('autoprefixer')
                  ]
                }
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset',
        },
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.uglifyJsMinify,
        }),
      ],
    },
    devServer: {
      static: path.resolve(__dirname, 'public'),
      port: 8080,
      hot: true
    },
  }
}