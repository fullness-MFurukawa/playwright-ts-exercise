import { test, expect } from '@playwright/test';

/**
 * 演習 4-1 メニューからログイン画面を表示する
 */
test('メニューからログイン画面へ遷移できることを検証する', async ({ page }) => {
    // サイトのトップへ移動する
    await page.goto('http://74.226.194.15/front');

    // [ログイン]リンクをクリックする
    // 類似したボタンがあるためexact: trueで確実に特定する
    await page.getByRole('link', { name: 'ログイン', exact: true }).click();

    // URLがログイン画面のものになっているか検証
    // 完全一致、または末尾のパスのみの指定（正規表現）が可能
    await expect(page).toHaveURL('http://74.226.194.15/front/login');
});