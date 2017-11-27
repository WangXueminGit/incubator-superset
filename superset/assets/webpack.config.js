const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// input dir
const APP_DIR = path.resolve(__dirname, './');

// output dir
const BUILD_DIR = path.resolve(__dirname, './dist');

const VERSION_STRING = JSON.parse(fs.readFileSync('package.json')).version;

const config = {
  entry: {
    'css-theme': APP_DIR + '/javascripts/css-theme.js',
    common: APP_DIR + '/javascripts/common.js',
    dashboard: ['babel-polyfill', APP_DIR + '/javascripts/dashboard/Dashboard.jsx'],
    explorev2: ['babel-polyfill', APP_DIR + '/javascripts/explorev2/index.jsx'],
    sqllab: ['babel-polyfill', APP_DIR + '/javascripts/SqlLab/index.jsx'],
    welcome: ['babel-polyfill', APP_DIR + '/javascripts/welcome.js'],
    profile: ['babel-polyfill', APP_DIR + '/javascripts/profile/index.jsx'],
  },
  output: {
    path: BUILD_DIR,
    filename: `[name].${VERSION_STRING}.entry.js`,
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
    alias: {
      webworkify: 'webworkify-webpack',
    },

  },
  module: {
    loaders: [
      {
        test: /datatables\.net.*/,
        loader: 'imports-loader?define=>false',
      },
      {
        test: /\.jsx?$/,
        exclude: APP_DIR + '/node_modules',
        loader: 'babel-loader',
        query: {
          presets: [
            'airbnb',
            'es2015',
            'react',
          ],
        },
      },
      /* for require('*.scss') */
      {
        test: /\.scss$/,
        include: APP_DIR,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
      /* for require('*.css') */
      {
        test: /\.css$/,
        include: APP_DIR,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      /* for css linking images */
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader',
      },
      {
        test: /\.gif$/,
        loader: 'file-loader',
      },
      /* for font-awesome */
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      /* for require('*.less') */
      {
        test: /\.less$/,
        include: APP_DIR,
        loader: 'style-loader!css-loader!less-loader',
      },
    ],
  },
  node: {
    fs: 'empty'
  },
  externals: {
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    "./cptable": "var cptable",
    "./jszip": "jszip"
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.IgnorePlugin(/cptable/),
  ],
};
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}
module.exports = config;
