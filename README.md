# webpack搭建移动端开发运行环境
## [1.搭建步骤](#1)
## [2.注意事项](#2)

## <h2 id='1'>1.搭建步骤</h2>
### 1.1 webpack安装
      *npm 初始化，(-y就是yes缩写，按照默认项初始化npm)*
      npm init -y   
      npm install webpack --save-dev
      webpack -v
### 1.2 package.json配置
        ```
        {
          "name": "ES6",
          "version": "1.0.0",
          "description": "",
          "main": "index.js",
          "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "build": "webpack",// 初次运行
            "server": "webpack-dev-server" //运行服务，启动热加载
          },
          "keywords": [],
          "author": "",
          "license": "ISC",
          "devDependencies": {
            "autoprefixer": "^7.2.4",//css3自动加前缀
            "babel-core": "^6.26.0",//ES6转ES5
            "babel-loader": "^7.1.2",//，识别ES6,ES6转ES5
            "babel-preset-env": "^1.6.1",//ES6转ES5
            "css-loader": "^0.28.8",//css-loader用来将css插入到页面的style标签
            "extract-text-webpack-plugin": "^3.0.2",//把css样式单独分离出去，即以<style>标签的形式插入到html
            "file-loader": "^1.1.6",//文件加载，html中的img加载需要用到
            "html-webpack-plugin": "^2.30.1",//插件用来生产index.html 入口文件，并且把css,js引入到html中
            "html-withimg-loader": "^0.1.16",//解决img标签的src引用的问题
            "node-sass": "^4.7.2",//sass
            "postcss-loader": "^2.0.10",//配合antoprefixer,实现自动添加css3前缀
            "purify-css": "^1.2.5",//主要是去除没用用到的css,比如html中没有相关的标签或者类，但是css中写的有，即写了但没用到，就是冗余，会检查之后去除
            "purifycss-webpack": "^0.7.0",//同上
            "sass-loader": "^6.0.6",//sass 编译；sass-loader依赖于node-sass
            "style-loader": "^0.19.1",//style-loader用来处理css中的url等
            "url-loader": "^0.6.2",// 处理css中图片
            "webpack": "^3.10.0",
            "webpack-dev-server": "^2.10.1"//webpack服务
          },
          "dependencies": {
            "jquery": "^3.2.1",//第三方插件jquery
            "webpack-zepto": "^0.0.1"//第三方插件zepto
          }
        }
        ```
### 1.1webpack安装
### 1.1webpack安装


## <h2 id='2'>注意事项</h2>
### 2.1 html中img路径
  ```
  const website={
    publicPath: 'http://localhost:8082/'
  } 
  npm install html-withimg-loader --save-dev
  //把图片打包在dist/imgs文件夹下，小于5000b编码为base64。
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
  ```
### 2.2 zepto引入
   zepto引入，plugins中用webpack-zepto, ProvidePlugin是webpack自带的插件，所以要先再webpack.config.js中引入webpack。 配置如下：
  const webpack=require('webpack'); 
   npm install webpack-zepto --save (生产阶段也会用到，所以--save,--save-dev,是开发环境)   
  ```
    new webpack.ProvidePlugin({
      $:'webpack-zepto'
    })
  ```
