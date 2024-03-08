const HtmlWebpackPlugin=require('html-webpack-plugin');

module.exports={
    entry:'./src/app.js',
    output:{
        path:__dirname+'/dist',
        filename:'bundle.js'
    },
    devServer:{
        port:8000,
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
                
            },
            {
                test: /\.png$/,
                use: [
                  'file-loader'
                ]
              }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
}