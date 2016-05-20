var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var precss = require('precss');

var webpackConfig = {
  devtool: 'source-map',
  entry: {
    index: './src/index',
  },
  output: {
    path: path.join(__dirname, 'dist'), // реальная папка сборки
    filename: '[name].js', // имя файла
    publicPath: '/static/' // папка, в которой потом будет статика на продакшне
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    }, {
      test: /\.png$/,
      loader: "file-loader" // !url-loader?limit=100000
    }, {
      test: /\.jpg$/,
      loader: "file-loader"
    }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
    }]
  },
  // resolve: { // чтобы можно было подключать require('App')
  //   extensions: ['', '.js', '.less'],
  //   root: [
  //     path.join(__dirname, './src')
  //   ]
  // },
  postcss: function () {
    return [precss, autoprefixer];
  },
  plugins: [
    //
  ],
};

switch (process.env.NODE_ENV) {
  case 'development':
    webpackConfig.devtool = 'eval';
    webpackConfig.entry.index = [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      webpackConfig.entry.index
    ];
    webpackConfig.plugins.push(
      new ExtractTextPlugin('[name].css')
    );
    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
    break;

  default:
    webpackConfig.plugins.push(
      new ExtractTextPlugin('[name].css')
    );
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings:     false,
            drop_console: true,
            unsafe:       true
          }
        })
    );
}

module.exports = webpackConfig;
