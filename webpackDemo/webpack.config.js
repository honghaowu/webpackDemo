const path=require('path');
// const uglify=require('uglifyjs-webpack-plugin');
const htmlPlugin=require('html-webpack-plugin');
//css冗余去除的插件
const glob=require('glob');
const PurifyCSSPlugin=require('purifycss-webpack');
//css分离出去的插件
const extractTextPlugin=require('extract-text-webpack-plugin');
var website={
  publicPath: 'http://172.30.67.141:8081/'
}

//引入entry模块
const entry=require('./webpack_config/entry_webpack.js');
//配置第三方插件，引入webpack，用到webpack自带的插件ProvidePlugin
const webpack=require('webpack');

module.exports={
    devtool: 'source-map',
    //入口文件的配置项
    entry:entry.path,
    //出口文件的配置项
    output:{
      path: path.resolve(__dirname,'dist'),
      filename: '[name].js',
      // publicPath: website.publicPath
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
      rules:[
        {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
        },
        {
          test: /\.less$/,
          use: [{
            loader: 'style-loader'
          },{
            loader: 'css-loader'
          },{
            loader: 'less-loader'
          }]
        },
        {
          test: /\.scss$/,
          use:[{
            loader: 'style-loader'
          },{
            loader: 'css-loader'
          },{
            loader: 'sass-loader'
          }]
        },
        // {
        //   test: /\.js$/,
        //   use: ['babel-loader'],
        //   query: {presets: ['es2015']}
        // }
        {
          test: /\.(png|jpg|gif)/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'images/'
            }
          }]
        },
        {
          test: /\.(htm|html)$/i,
          use: ["html-withimg-loader"]
        },
        {
          test: /\.(jsx|js)$/,
          use:[
            {
              loader: 'babel-loader'
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    //插件，用于生产模版和各项功能
    plugins:[
      // new uglify(),
      new htmlPlugin({
        minify:{removeAttributeQuotes:true},
        hash: true,
        template: './src/index.html'
      }),
      //css分离插件配置，去除冗余也需要此插件
      new extractTextPlugin('css/index.css'),
      //css冗余插件的配置
      new PurifyCSSPlugin({
        paths: glob.sync(path.join(__dirname,'src/*.html'))
      }),
      //配置jquery
      new webpack.ProvidePlugin({
        $: 'jquery'
      })
    ],
    //配置webpack开发服务功能
    devServer:{
      contentBase:path.resolve(__dirname,'dist'),
      host: 'localhost',
      compress: true,
      port: 8081
    }
}