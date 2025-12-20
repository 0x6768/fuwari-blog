import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// 命令执行api
import { execSync } from 'child_process';
console.log('🎯 Git Hash Implant Tools v1.0');
console.log('🔧 Implant Git Hash into Footer component\n');
// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const PATHS = {
  template: path.join(__dirname, '../templates/Footer.template'),
  output: path.join(__dirname, '../src/components/Footer.astro')
};

// 读取模板文件
console.log('📖 Read template file');
const templateContent = await fs.readFile(PATHS.template, 'utf8');
// 替换模板中的占位符

// 获取当前git短哈希

const gitShortHash = execSync('git rev-parse --short HEAD').toString().trim();
console.log(`📋 Get Git short hash: ${gitShortHash}`);
// 替换模板中的占位符
console.log('🔄 Replace placeholder in template');
const outputContent = templateContent.replace('::GIT_SHORT_HASH::', gitShortHash);
// 写入输出文件
await fs.writeFile(PATHS.output, outputContent);
console.log(`✅ Git hash ${gitShortHash} written to ${PATHS.output}`);
