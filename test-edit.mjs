import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();

// 启用控制台日志
page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));
page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

// 先清除 localStorage，确保加载新的 mock 数据
await page.goto('http://localhost:5173/');
await page.evaluate(() => {
  // 清除旧的 mock 数据
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('skillhub_mock_')) {
      localStorage.removeItem(key);
    }
  }
  // 设置登录状态
  localStorage.setItem('auth-store', JSON.stringify({
    user: {
      id: 'mock-user-001',
      name: '开发者小明',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4'
    },
    isLoggedIn: true
  }));
});

// 访问我的发布页面
await page.goto('http://localhost:5173/my-skills');
await new Promise(r => setTimeout(r, 2000));

console.log('Current URL:', page.url());

// 获取页面文本内容
const text = await page.evaluate(() => document.body.innerText);
console.log('Page text preview:', text.substring(0, 800));

// 截图
await page.screenshot({ path: '/tmp/my-skills.png', fullPage: true });
console.log('Screenshot saved to /tmp/my-skills.png');

// 查找编辑按钮
const editBtn = await page.$('.action-btn.edit');
console.log('Edit button found:', !!editBtn);

if (editBtn) {
  console.log('Clicking edit button...');
  await editBtn.click();
  await new Promise(r => setTimeout(r, 2000));
  console.log('After click URL:', page.url());
  
  // 检查是否跳转到了编辑页面
  const isEditPage = page.url().includes('/edit/');
  console.log('Is edit page:', isEditPage);
  
  await page.screenshot({ path: '/tmp/after-edit-click.png', fullPage: true });
  console.log('Screenshot saved to /tmp/after-edit-click.png');
  
  if (isEditPage) {
    console.log('✅ SUCCESS: Edit button works correctly!');
  } else {
    console.log('❌ FAILED: Did not navigate to edit page');
  }
}

await browser.close();
