const Path = require('path'); // 从node上导入path
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const isDev = process.env.NODE_ENV === 'development'; // 在package.json scripts里面设置的生产和开发环境的环境变量都存在于cross-dev:标识是开发环境还是生产环境,我们设置脚本的时候启动的环境变量全都存在于process.env里面
const HTMLWebpackPlugin = require('html-webpack-plugin'); // 网页的入口
const Webpack = require('webpack'); // 引入webpack为了下面用webpack的插件DefinePlugin

let config = {
    target: 'web', // webpack的编译目标是web项目
    entry: Path.resolve(__dirname, './src/index.js'), // 以join拼接path的形式配置绝对路径,相对路径打包后找不到会报错
    output: {
        filename: 'vendor.build.js',
        path: Path.resolve(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1024, // 判断图片的大小   如果小于1024就会转换成base64
                    name: '[name].[ext]' // 输出图片的名字  ext是扩展名
                }
            }
        }]
    },
    plugins: [
        new Webpack.DefinePlugin({ //做vue或react的项目必须用到的,这些项目都会根据环境来区分打包
            'process-env': {
                NODE_ENV: isDev ? '"development"' : '"production"' // 在webpack编译的过程中 对写的js代码都会判断环境,根据不同环境对代码进行打包(我们只想要"development",所以外面会加上单引号)
            }
        }),
        new VueLoaderPlugin(),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: Path.resolve(__dirname, './src/index.html'),
            hash: true
        })
    ]
};

if (isDev) {
    config.devtool = '#cheap-module-eval-source-map';
    config.devServer = {
        port: 8088,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        compress: true,
        hot: true,
        hotOnly: true
    };
    config.plugins.push(new Webpack.HotModuleReplacementPlugin());
}

module.exports = config;
