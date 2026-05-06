import { test, expect } from '@playwright/test';

/**
 * 演習 5-1 未入力検索のエラー表示をテストする
 */
test('未入力で検索ボタンを押すと、エラーメッセージが表示されることを検証する', async ({ page }) => {
    // 事前準備：ログイン処理を実行する
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  
    // トップメニューから「商品キーワード検索」画面へ遷移する
    await page.getByRole('link', { name: '検索画面へ' }).click();
  
    // 検索画面に遷移したことを確認する
    await expect(page).toHaveURL('http://74.226.194.15/front/products/search');

    // キーワードを未入力のまま[検索]ボタンをクリックする
    const searchButton = page.getByRole('button', { name: '検索', exact: true });
    await searchButton.click();

    // エラーメッセージが表示されることを検証する
    const errorMessage = page.getByText('検索キーワードを入力してください。');
    await expect(errorMessage).toBeVisible();
});

/**
 * 演習5-2 検索結果無しの表示をテストする
 */
test('存在しないキーワードで検索すると、0件のメッセージが表示されることを検証する', async ({ page }) => {
    //  事前準備：ログイン処理を実行して検索画面へ遷移する
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  
    await page.getByRole('link', { name: '検索画面へ' }).click();
    await expect(page).toHaveURL('http://74.226.194.15/front/products/search');

    // 存在しないキーワードを入力して検索する
    await page.getByPlaceholder('商品名を入力...').fill('存在しない商品XYZ');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    // 検索結果0件のメッセージが表示されることを検証
    const emptyMessage = page.getByText('商品が見つかりません。検索ボタンを押してください。');
    await expect(emptyMessage).toBeVisible();
});

test('水性ボールペンで検索し、3色の結果が正しく表示されることを検証する', async ({ page }) => {
    // 事前準備：ログインして検索画面へ遷移する
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
    await page.getByRole('link', { name: '検索画面へ' }).click();

    // 「水性ボールペン」で検索する
    await page.getByPlaceholder('商品名を入力...').fill('水性ボールペン');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    // テーブルの行を取得し、件数を確認する(ヘッダー1 + データ3 = 4)
    const rows = page.getByRole('row');
    await expect(rows).toHaveCount(4);

    // 各行の内容を順番に検証する
    // 1行目：黒
    await expect(rows.nth(1)).toContainText('水性ボールペン(黒)');
    await expect(rows.nth(1)).toContainText('￥120');
    await expect(rows.nth(1)).toContainText('文房具');
    await expect(rows.nth(1)).toContainText('100 個');

    // 2行目：赤
    await expect(rows.nth(2)).toContainText('水性ボールペン(赤)');
    await expect(rows.nth(2)).toContainText('￥120');
    await expect(rows.nth(2)).toContainText('文房具');
    await expect(rows.nth(2)).toContainText('100 個');

    // 3行目：青
    await expect(rows.nth(3)).toContainText('水性ボールペン(青)');
    await expect(rows.nth(3)).toContainText('￥120');
    await expect(rows.nth(3)).toContainText('文房具');
    await expect(rows.nth(3)).toContainText('100 個');
});