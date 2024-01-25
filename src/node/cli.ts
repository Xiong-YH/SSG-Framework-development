//分发cli核心逻辑
import cac from 'cac';
import { resolve } from 'path';
import { build } from './build';

//脚手架名称
const cli = cac('island').version('0.0.0').help();

//两个参数，第二个参数是解释信息
cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  root = root ? resolve(root) : process.cwd();
  const createServer = async () => {
    const { createDevServer } = await import('./dev.js');

    const server = await createDevServer(root, async () => {
      await server.close();

      await createServer();
    });

    await server.listen();
    server.printUrls(); //是否输出server的URL地址
  };

  await createServer();
});
//1.bin字段创建
//2.npm link
//3.island dev

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    try {
      root = resolve(root);
      await build(root);
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
