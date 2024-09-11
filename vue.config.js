const { defineConfig } = require("@vue/cli-service");
const port = process.env.port || 8070;
const CompressionPlugin = require("compression-webpack-plugin");
// const port = process.env.port || process.env.npm_config_port || 5000; // dev port
const path = require("path");
const resolve = (dir) => {
  return path.join(__dirname, dir);
};

module.exports = defineConfig({
  devServer: {
    port: port,
    open: false,
  },
  chainWebpack(config) {
   
  },
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: "./",
  outputDir: "html",

  configureWebpack: () => {
    if (process.env.NODE_ENV) {
      return {
        cache: {
          type: "filesystem",
        },
        module: {
          rules: [
            {
              test: /.js$/,
              use: ["babel-loader"],
              exclude: /node_modules/,
            },
          ],
        },

        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
            threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
            deleteOriginalAssets: false, // 是否删除原文件
          }),
          //   解决spreadjs 打包太慢的问题
        ],
      };
    }
  },
  // css 相关选项
  css: {
    loaderOptions: {},
  },
});
