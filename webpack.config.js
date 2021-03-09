require('dotenv').config()
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const isProduction = !!env.production;
    const { API_SERVER = 'http://localhost:8010' } = process.env;
    const PUBLIC_PATH = '/poorbox/';
    
    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'eval-source-map',
        entry: './index.js',
        output: {
            filename: '[fullhash].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: PUBLIC_PATH
        },
        module: {
            rules: [
                {
                    test: /\.svelte$/,
                    include: path.resolve(__dirname, 'src'),
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            compilerOptions: {
                                dev: !isProduction
                            },
                            // emitCss: isProduction,
                            hotReload: !isProduction
                        }
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'PoorBox',
                filename: isProduction ? 'poorbox.html' : 'index.html'
            })
        ],
        devServer: {
            port: 8000,
            hot: true,
            historyApiFallback: {
                rewrites: [
                    { from: /\/poorbox(\/.*)?$/, to: PUBLIC_PATH }
                ]
            },
            proxy: [
                {
                    context: ['/poorbox/api'],
                    target: API_SERVER,
                    secure: false
                }
            ]
        }
    }
};