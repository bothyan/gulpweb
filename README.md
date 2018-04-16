npm install

支持ssi

本项目支持LESS，在运行时会看到生成一个less目录，这是开发调试时临时生成的css文件

注意，以下目录不要提交
1.node_modules 目录，这个可以通过安装依赖生成
2.dist 目录，这个是服务器编译时生成，如果你本地测试过服务器编译也会生成
3.less 目录，在开发模式下存放编译完的临时css，在服务器执行编译时会再次生成css到dist目录

本地开发
npm run dev

线上部署
npm run build