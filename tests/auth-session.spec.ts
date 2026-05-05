import { test, expect } from '@playwright/test';

/**
 * 演習4-2 ログインを成功させ、Cookieを検証する
 */
test('正しいユーザー情報でログインし、CookieにTokenが保存されること検証する', async ({ page }) => {
  // ログイン画面へアクセスする
  await page.goto('http://74.226.194.15/front/login');

  // フォームに入力してログインを実行する
  await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 }); 
  await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
  await page.getByRole('button', { name: 'ログイン', exact: true }).click();

  // トップ画面への遷移を検証する
  await expect(page).toHaveURL('http://74.226.194.15/front');

  // BrowserContextからCookieを取得する
  const cookies = await page.context().cookies();
  
  // NextAuthの3つのCookieを検索する
  const sessionToken = cookies.find(c => c.name === 'next-auth.session-token');
  const csrfToken = cookies.find(c => c.name === 'next-auth.csrf-token');
  const callbackUrl = cookies.find(c => c.name === 'next-auth.callback-url');

  // 全てのTokenが存在することを検証する
  expect(sessionToken).toBeDefined();
  expect(csrfToken).toBeDefined();
  expect(callbackUrl).toBeDefined();
});