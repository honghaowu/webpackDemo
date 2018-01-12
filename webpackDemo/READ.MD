## 1 webpack的安装 
* 进入命令窗口：win+R cmd 
* 新建文件夹：mkdir webpackDemo
* 进入文件夹：cd webpackDemo
* 安装node,检查版本node -V
* 初始化项目目录：npm init (生成package.json文件，文件中包含了项目的信息和生产/开发环境)需要的依赖包。
* 安装webpack: cnpm install webpack --save--dev (--save-dev是保存到package.json中的开发环境依赖包中)。
* 检查webpack版本：webpack -v

## 2 webpack入门
* 新建文件夹src和dist，src是源码文件，dist是我们编译打包好的文件；一个用于开发环境，一个用于生产环境。
* 在dist文件夹下新建index.html,引入bundle.js，在src文件夹下新建entry.js。执行如下命令打包：
* webpack {entry file} {destination for bundled file}  
  {entry file}:入口文件的路径，本文中就是src/entery.js的路径；  
  {destination for bundled file}:填写打包后存放的路径。
* 注意：在命令行中是不需要写{ }的。
例如：$ webpack src/entery.js dist/bundle.js

## 3 webpack.config.js的基本配置
```
module.exports={
    //入口文件的配置项
    entry:{
      entry: './src/index.js'
    },
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
**entry中的配置项的名字，对应output中filename: '[name].js' ,配置完成后，命令行输入webpack,将文件从src打包到dist**
## 4 配置服务和热更新
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

## 5 css文件打包
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
## 6 JS的压缩，注意压缩是在生产环境中，
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
## 7 配置插件 HTML文件的发布
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

## 8 图片的处理1,css中的图片
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

## 9 css分离,使用插件方法如下：
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

## 10 图片处理，处理html中的图片
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

## 11 less打包
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

## 12 sass文件的打包
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

## 13 postcss处理属性前缀
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
## 14 CSS冗余样式去除
需要PurifyCSS插件和9中的extract-text-webpack-plugin相结合  
PurifyCSS-webpack依赖purify-css  
* 安装：npm i purifycss-webpack purify-css -D 
* 引入模块 
  同步检查html模板，需要引入node的glob对象使用。在webpack.config.js文件头部引入glob：const glob = require('glob');  
  引入purifycss-webpack：     
  const PurifyCSSPlugin = require("purifycss-webpack");
* 配置插件
```
  new PurifyCSSPlugin({
    // Give paths to parse for rules. These should be absolute!
    paths: glob.sync(path.join(__dirname, 'src/*.html')),
  })
```
  paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了,没有使用到的css,会去除。
## 15 ES6处理
* Babel其实是一个编译JavaScript的平台，它的强大之处表现在可以通过便宜帮你达到以下目的：  
  使用下一代的javaScript代码(ES6,ES7….)，即使这些标准目前并未被当前的浏览器完全支持。  
  使用基于JavaScript进行了扩展的语言，比如React的JSX。
* 安装：cnpm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev  
  核心包：babel-core；常用包：解析ES6的babel-preset-es2015包和解析JSX的babel-preset-react包
* 配置：
```
{
    test:/\.(jsx|js)$/,
    use:[{
        loader:'babel-loader',
        options:{
            presets:[
                "es2015","react"
            ]
        }
    }],
    exclude:/node_modules/
}
```
* 为了方便Babel的配置，单独建立文件.babelrc,即把上面的options单独配置
```
{
  "presets":["react","es2015"]
}
```
* babel-preset-es2015，现在官方推荐使用的是babel-preset-env,
* 安装：npm install --save-dev babel-preset-env
* 配置：
```
{
    "presets":["react","env"]
}
```
## 16 映射，方便调试
* devtool配置：
```
module.exports = {
  devtool: 'eval-source-map',
  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  }
}
```
* 在配置devtool时，webpack给我们提供了四种选项。  
>source-map:在一个单独文件中产生一个完整且功能完全的文件。这个文件具有最好的source map,但是它会减慢打包速度；  
>cheap-module-source-map:在一个单独的文件中产生一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号）,会对调试造成不便。  
>eval-source-map:使用eval打包源文件模块，在同一个文件中生产干净的完整版的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定要不开启这个选项。  
>cheap-module-eval-source-map:这是在打包文件时最快的生产source map的方法，生产的 Source map 会和打包后的JavaScript文件同行显示，没有影射列，和eval-source-map选项具有相似的缺点。
  source map只适用于开发阶段，上线前记得修改这些调试设置。  
  
  |devtool                        |   构建    |   重构建  |   生产环境       |    特性              |
  |:-----------------------------:|:--------:|:---------:|:---------------:|:--------------------:|
  |  eval                         |   +++    |  +++      |  no             |  生成后的代码         |
  |  cheap-eval-source-map        |    +     |   ++      |  no             |  转换过的代码（仅限行）|
  |  cheap-source-map             |    +     |     o     |  yes            |  转换过的代码（仅限行）|
  |  cheap-module-eval-source-map |    o	   |     ++    |  no             |  原始源码（仅限行）    |
  |  cheap-module-source-map      |    o	   |      -		 |  yes            |  原始源码（仅限行）    |
  |  eval-source-map              |    --	   |     +	   |  no             |  原始源码             |
  |  source-map                   |    --	   |     --	   |  yes            |  原始源码             |
  |  nosources-source-map         |    --	   |     --    |  yes            |  无源码内容           |


## 17 开发与生产环境
* 在package.json中，  
  开发依赖： devDependencies 下面的包，安装例如：npm install jquery --save-dev	  
  生产依赖： dependencies 下面的包,安装例如：npm install jquery --save  
* 安装全部依赖： npm install  
  安装生产环境依赖： npm install --production

## 	18 模块化配置（以entery入口为例）
* 配置前：
```
 //入口文件的配置项
    entry:{
      entry:'./src/entry.js'
    },
```
* 配置过程，新建文件夹webpack_config,新建entry_webpack.js，写入：
```
//声明对象
const entry={};
// 声明路径属性
entry.path={
  entry: './src/entry.js'
}
// 模块化
module.exports=entry;
```
webpack.config.js中配置修改：  
引入entry模块：const entry=require('./webpack_config/entry_webpack.js');   
配置修改如下：
```
 entry:entry.path,
```
## 19 引入第三方库的方法（以jQuery为例）
* 第一种  
  安装： npm install jquery --save  
  在entry.js中引入： import $ from 'jquery'  
  然后直接在引入后的文件中使用 $(".xx").html(xxx);   
  vue的引入多用这种方法
* 第二种：plugin引入  
  webapck.config.js中配置的方法  
  需要插件：ProvidePlugin  
  ProvidePlugin是一个webpack自带的插件，  
  因为ProvidePlugin是webpack自带的插件，所以要先再webpack.config.js中引入webpack。
配置如下：
  ```  
  const webpack=require('webpack');
  plugins: [
    new webpack.ProvidePlugin({
      $:'jquery'
    })
  ]
  ```
  import引入方法：引用后不管你在代码中使用不适用该类库，都会把该类库打包起来，这样有时就会让代码产生冗余。   
  ProvidePlugin引入方法：引用后只有在类库使用时，才按需进行打包，所以建议在工作使用插件的方式进行引入。
