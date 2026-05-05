import { test, expect } from '@playwright/test';

/**
 * 演習 4-4 ログアウトとセッション破棄を検証する
 */
test('ログアウトを実行するとボタンが非表示になり、セッションCookieが破棄されること検証する', async ({ page }) => {
  // 事前準備：ログイン処理
  await page.goto('http://74.226.194.15/front/login');
  await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
  await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
  // メインコンテンツ(main要素)の中にある[ログアウト]ボタンを厳密に指定する
  await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  await expect(page).toHaveURL('http://74.226.194.15/front');

 
  // 2. 検証する要素（Locator）を変数に定義しておく
  const logoutButton = page.getByRole('main').getByRole('button', { name: 'ログアウト' });
  const loginLink = page.getByRole('link', { name: 'ログイン画面へ' });

  // ログアウト操作を実行
  await logoutButton.click();

  //【UIの検証】ログアウトボタンが画面から非表示になったことを確認する
  await expect(page).toHaveURL('http://74.226.194.15/front'); // URLは変わらない
  await expect(logoutButton).toBeHidden(); // [ログアウト]ボタンが消える
  await expect(loginLink).toBeVisible();   // にログイン画面へのリンクが表示される

  // 【内部状態の検証】全Cookieを取得する
  const cookies = await page.context().cookies();
  
  // NextAuthのセッショントークンを検索する
  const sessionToken = cookies.find(c => c.name === 'next-auth.session-token');

  // トークンがクリアされたことを検証する
  expect(sessionToken).toBeUndefined();
});