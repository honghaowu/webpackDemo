//加载path模块，用于相关路径
const path=require('path');
//此插件，可以自动生成对应的入口html,把js自动的加载进去
const htmlPlugin=require('html-webpack-plugin');
// 用于样式的分离，否则样式是默认打包到index.html中style标签中
const extractTextPlugin=require('extract-text-webpack-plugin');
// 存地址，为了html中img标签路径查找正确
const website={
  publicPath: 'http://localhost:8082/'
} 
//去冗余css
const glob=require('glob');
const PurifyCssPlugin=require('purifycss-webpack');
//
const webpack=require('webpack');

module.exports={
  devtool: 'source-map',
  entry:{
    index:'./src/js/index.js'
  },
  output:{
    path: path.resolve(__dirname,'dist'),
    filename: '[name].js', //与上面的entry入口的key对应。
    publicPath:website.publicPath
  },
  module:{
    rules:[
      {
        test: /\.css$/,
        use: ['style-loader','css-loader','postcss-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: extractTextPlugin.extract({
          use:[
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ],
          fallback: 'style-loader'
        })
      },
      // {
      //   test: /\.(scss|sass)$/,
      //   use:['style-loader','css-loader','sass-loader','postcss-loader']
      // },
      {
        test:/\.js$/,
        use:[
          {loader: 'babel-loader'}
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'imgs/'
            }
          },
        ]
      },
      {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
      }
    ]
  },
  plugins:[
    new htmlPlugin({
      hash:true,
      template: './src/index.html'
    }),
    //分离出来的样式存在style.css中
    new extractTextPlugin('css/style.css'),
    //去除html中没用到的样式
    new PurifyCssPlugin({
      paths:glob.sync(path.join(__dirname,'src/*html'))
    }),
    new webpack.ProvidePlugin({
      $:'webpack-zepto'
    })
  ],
  devServer:{
    contentBase:path.resolve(__dirname,'./dist'),
    host: 'localhost',
    compress: true,
    port: 8082
  }
}