/**
 * 注：此脚本执行时间由页面 https://ant-design.gitee.io/components/icon-cn/ 加载时间决定
 * 通常执行时间较长
 */

const fs = require('fs');
const puppeteer = require('puppeteer');
const ora = require('ora');

const spinner = ora('now try to go page, please wait...');
puppeteer.launch().then(async (browser) => {
  const page = await browser.newPage();

  spinner.start();
  await page.goto('https://ant-design.gitee.io/components/icon-cn/', {
    timeout: 0,
    waitUntil: 'domcontentloaded',
  });
  spinner.text = 'domcontent has loaded';
  const iconsList = await page.evaluate(() => {
    const $iconsList = document.body.querySelectorAll('.anticons-list');
    return Array.prototype.slice.call($iconsList).map(($ul) => {
      const $title = $ul.previousSibling;
      const $antBadges = $ul.querySelectorAll('.ant-badge');
      return {
        title: $title.innerText,
        icons: Array.prototype.slice
          .call($antBadges)
          .map(($badge) => $badge.innerText),
      };
    });
  });
  fs.writeFileSync(
    __dirname + `/icons-list.json`,
    JSON.stringify(iconsList, null, 2),
    'utf-8',
  );
  spinner.color = 'green';
  spinner.text = 'succuss';
  spinner.stop();
  await browser.close();
});
