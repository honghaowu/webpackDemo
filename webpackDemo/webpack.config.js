const path=require('path');
// const uglify=require('uglifyjs-webpack-plugin');
const htmlPlugin=require('html-webpack-plugin');

module.exports={
    //入口文件的配置项
    entry:{
      entry:'./src/entry.js'
    },
    //出口文件的配置项
    output:{
      path: path.resolve(__dirname,'dist'),
      filename: '[name].js'
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
      rules:[
        {
        test: /\.css$/,
        use: ['style-loader','css-loader']
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