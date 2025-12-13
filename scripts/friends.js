// scripts/generate-friends-page.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const PATHS = {
  data: path.join(__dirname, '../src/data/friends.json'),
  template: path.join(__dirname, '../templates/friends.template'),
  output: path.join(__dirname, '../src/pages/friends.astro')
};

// 验证友链数据格式
function validateFriendData(friend) {
  const required = ['name', 'url', 'description', 'icon'];
  return required.every(field => friend[field] && typeof friend[field] === 'string');
}

async function generateFriendsPage() {
  try {
    console.log('📖 Reading friends data...');
    
    // 读取并验证友链数据
    const friendsData = await fs.readFile(PATHS.data, 'utf-8');
    const friends = JSON.parse(friendsData);
    
    if (!Array.isArray(friends)) {
      throw new Error('Friends data should be an array');
    }
    
    // 验证每个友链对象
    friends.forEach((friend, index) => {
      if (!validateFriendData(friend)) {
        throw new Error(`Invalid friend data at index ${index}: missing required fields`);
      }
    });
    
    console.log('📋 Reading template file...');
    
    // 读取模板
    const astroTemplate = await fs.readFile(PATHS.template, 'utf-8');
    
    // 生成友链卡片代码 - 使用模板字符串
    const friendsCards = friends.map(friend => `
      <a
        href="${friend.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="friend-card"
      >
        <div class="flex items-center gap-2">
          <img
            src="${friend.icon}"
            alt="${friend.name}"
            loading="lazy"
            class="w-5 h-5 rounded"
          />
          <div class="font-bold text-black dark:text-white">
            ${friend.name}
          </div>
        </div>
        <div class="text-sm text-black/50 dark:text-white/50">
          ${friend.description}
        </div>
      </a>
    `).join('\n');
    
    // 替换模板中的占位符 - 注意这里使用的是模板字符串
    const astroContent = astroTemplate.replace(
      /\$\{friends\.map\(friend => `([\s\S]*?)`\)\.join\(''\)\}/,
      friendsCards
    );
    
    // 确保输出目录存在
    await fs.mkdir(path.dirname(PATHS.output), { recursive: true });
    
    // 写入生成的文件
    await fs.writeFile(PATHS.output, astroContent);
    
    console.log('✅ Friends page generated successfully!');
    console.log(`📁 Location: ${PATHS.output}`);
    console.log(`👥 Total friends: ${friends.length}`);
    
  } catch (error) {
    console.error('❌ Generate friends page failed:', error.message);
    process.exit(1);
  }
}

// 主函数
async function main() {
  console.log('🎯 Friends Generate Tools v1.0');
  console.log('🚀 Starting to generate friends page...\n');
  
  await generateFriendsPage();
}

// 执行主函数
main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});