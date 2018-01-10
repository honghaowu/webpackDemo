# 1 webpack的安装 
* 进入命令窗口：win+R cmd 
* 新建文件夹：mkdir webpackDemo
* 进入文件夹：cd webpackDemo
* 安装node,检查版本node -V
* 初始化项目目录：npm init (生成package.json文件，文件中包含了项目的信息和生产/开发环境)需要的依赖包。
* 安装webpack: cnpm install webpack --save--dev (--save-dev是保存到package.json中的开发环境依赖包中)。
* 检查webpack版本：webpack -v

# 2 webpack入门
* 新建文件夹src和dist，src是源码文件，dist是我们编译打包好的文件；一个用于开发环境，一个用于生产环境。
* 在dist文件夹下新建index.html,引入bundle.js，在src文件夹下新建entry.js。执行如下命令打包：
* webpack {entry file} {destination for bundled file}  
  {entry file}:入口文件的路径，本文中就是src/entery.js的路径；  
  {destination for bundled file}:填写打包后存放的路径。
* 注意：在命令行中是不需要写{ }的。
例如：$ webpack src/entery.js dist/bundle.js

# 3 webpack.config.js的基本配置
```
module.exports={
    //入口文件的配置项
    entry:{},
    //出口文件的配置项
    output:{
      path: path.resolve(__dirname,'dist'),//绝对路径
      filename: 'bundle.js'//打包后的名字'[name].js'会和入口的名称相同
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{},
    //插件，用于生产模版和各项功能
    plugins:[],
    //配置webpack开发服务功能
    devServer:{}
}
```
entry：配置入口文件的地址，可以是单一入口，也可以是多入口。  
output：配置出口文件的地址，在webpack2.X版本后，支持多出口配置。  
module：配置模块，主要是解析CSS和图片转换压缩等功能。  
plugins：配置插件，根据你的需要配置不同功能的插件。  
devServer：配置开发服务功能，后期我们会详细讲解。  

# 4 配置服务和热更新
* 执行webpack-dev-server：npm install webpack-dev-server –save-dev  
* 配置devServer：  
```
devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:8081
    }
```
contentBase:配置服务器基本运行路径，用于找到程序打包地址。  
host：服务运行地址，建议使用本机IP，这里为了讲解方便，所以用localhost。  
compress：服务器端压缩选型，一般设置为开启，如果你对服务器压缩感兴趣，可以自行学习。  
port：服务运行端口，建议不使用80，很容易被占用，这里使用了8081.  
* 在package.json中配置如下：
```
"scripts":{ 
    "server":"webpack-dev-server" 
  } 
```
* 在终端运行 npm run server即可替代webpack-dev-server  

# 5 css文件打包
* 在src新建css文件夹,新建index.css  
* 在入口文件entery.js中引入import css from './css/index.css'  
* 在webpack.config.js中配置module模块，  
style-loader用来处理css中的url等，  
css-loader用来将css插入到页面的style标签  
```
module:{
        rules: [
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            }
          ]
    },
```
注：  
test：用于匹配处理文件的扩展名的表达式，这个选项是必须进行配置的；  
use：loader名称，就是你要使用模块的名称，这个选项也必须进行配置，否则报错；  
include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；  
query：为loaders提供额外的设置选项（可选）。      
loader的三种模块写法：  
* 第一种写法：直接用use。
```
   module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    },
```
* 第二种写法：把use换成loader。
```
   module:{
        rules:[
            {
                test:/\.css$/,
                loader:['style-loader','css-loader']
            }
        ]
    }
```
* 第三种写法：用use+loader的写法：
```
   module:{
        rules:[
            {
                test:/\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    },
```
# 6 JS的压缩，注意压缩是在生产环境中，
* 引入一个uglifyjs-webpack-plugin进行JS压缩，webpack版本里默认已经集成，不需要再次安装。
* 在webpack.config.js中引入：
```
const uglify = require('uglifyjs-webpack-plugin');
```
* 在plugins中配置如下：
```
    plugins:[
        new uglify()
    ],
```
# 7 配置插件 HTML文件的发布
* 安装：npm install html-webpack-plugin --save-dev  
  用此插件，不用手动JS引入代码（webpack会自动为我们引入JS）
* 在webpack.config.js中修改如下：
  引入插件：```const htmlPlugin=require('html-webpack-plugin');```
* 配置,在plugins中：
```
new htmlPlugin({
        minify:{removeAttributeQuotes:true},
        hash: true,
        template: './src/index.html'
      })
```
minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。  
hash：为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。  
template：是要打包的html模版路径和文件名称。  

# 8 图片的处理1,css中的图片
* 安装图片loader： cnpm install file-loader url-loader --save-dev  
  file-loader：解决引用路径的问题;
  url-loader：如果图片较多，会发很多http请求，会降低页面性能,其中包含file-loader。
* 配置如下：
```
{
  test: /\.(png|jpg|gif)/,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 500000
    }
  }
```
test:/\.(png|jpg|gif)/是匹配图片文件后缀名称。  
use：是指定使用的loader和loader的配置参数。  
limit：是把小于500000B的文件打成Base64的格式，写入JS。  

# 9 css分离,使用插件方法如下：
* 安装：npm install --save-dev extract-text-webpack-plugin  
* 配置：const extractTextPlugin = require("extract-text-webpack-plugin");  
  plugins中配置：new extractTextPlugin("/css/index.css")；//这里的/css/index.css是分离后的路径位置。    
  module中配置：
  ```{
       test: /\.css$/,
       use: extractTextPlugin.extract({
         fallback: "style-loader",
         use: "css-loader"
       })
     },
  ```
* css分离后路径问题处理：  
  在webpack.config.js中声明对象：  
```
  var website ={
    publicPath:"http://172.30.67.141:8081/" //这里的IP和端口，是你本机的ip或者是你devServer配置的IP和端口。
  }
```
  再output中，配置如下：  
  ```
  output:{
        //输出的路径，用了Node语法
        path:path.resolve(__dirname,'dist'),
        //输出的文件名称
        filename:'[name].js',
        publicPath:website.publicPath
    },
```

# 10 图片处理，处理html中的图片
* webpack打包：package.json中配置：
```
"scripts": {
    "server": "webpack-dev-server",
    "build": "webpack"
},
```
* 运行：npm run build 进行打包
* 图片路径存放：
```
  {
    test:/\.(png|jpg|gif)/ ,
    use:[{
        loader:'url-loader',
        options:{
            limit:5000,
            outputPath:'images/',// 图片的存放路径
        }
    }]
  }
```
* 安装：npm install html-withimg-loader --save-dev  
* 配置：
```
{
   test: /\.(htm|html)$/i,
   use: ["html-withimg-loader"]
 }
```

# 11 less打包
less-loader 是将less文件编译成css  
sass-loader 是将sass文件编译成css  
* 安装：npm install less --save-dev  
      npm install less-loader --save-dev (编译为css)  
* 配置module（loader的加载要有先后顺序）： 
```
  {
    test: /\.less$/,
    use: [
      loader: 'style-loader'
    },{<br>
      loader: 'css-loader'
    },{<br>
      loader: 'less-loader'
    }]
  }, 
```
* 在入口js中引入  
import less from './css/black.less';

# 12 sass文件的打包
node-sass：因为sass-loader依赖于node-sass，所以需要先安装node-sass
* 安装：npm install node-sass sass-loader --save-dev
* 配置：
 ```
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
```

# 13 postcss处理属性前缀
postcss-loader 和autoprefixer（自动添加前缀的插件）
* 安装：npm install postcss-loader autoprefixer --save-dev
* 在webpack.config.js同级建postcss.config.js
```
module.exports={
  plugins: [
    require('autoprefixer')
  ]
}
```
* webpack.config.js中loader修改
```
{
      test: /\.css$/,
      use: [
            {
              loader: "style-loader"
            }, {
              loader: "css-loader",
              options: {
                 modules: true
              }
            }, {
              loader: "postcss-loader"
            }
      ]
}
```
