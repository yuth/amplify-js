const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")

function nameToTitleCase(str) {
    str = str.startsWith('@aws-') ? str.replace('@aws-', '') : str;
    return str
        .replace(/\w+/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
        .replace('-', '')
        .replace('/', '.');
}

module.exports = {
    entry: {
        'aws-amplify-auth': './src/index.ts',
        'aws-amplify-auth.min': './src/index.ts'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
        library: ['Amplify', 'Auth'],
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: [function(context, request, callback) {
        if(request.startsWith('@aws-amplify')) {
            console.log(request);
            callback(null, `root ${nameToTitleCase(request)}`)
        }
        else {
            callback();
        }
    }],
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
        new UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            include: /\.min\.js$/,
        }),
        new CompressionPlugin({
            include: /\.min\.js$/,
        })
    ],
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { 
                test: /\.tsx?$/, 
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
                query: {
                    declaration: false
                }
             },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            //{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                presets: ['react', 'es2015', 'stage-2'],
                }
            }
        ]
    }
};
