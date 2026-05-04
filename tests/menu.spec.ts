import { test, expect } from '@playwright/test';
/**
 * 演習3-1 ヘッダーのタイトルや機能名を取得して評価する
 */
test('ヘッダーの各要素とメニューが正しく表示されることを検証する', async ({ page }) => {
    // トップページへアクセスする
    await page.goto('http://74.226.194.15/front');

    /**
     * タイトルとサブタイトルの検証
     * <a>タグで囲まれているため、Roleは'link'になる
     */
    await expect(page.getByRole('link', { name: '商品管理システム' })).toHaveAttribute('href', '/front');
    // <span>タグの純粋なテキストなので、getByText()で取得する
    await expect(page.getByText('Playwright E2Eテスト 演習ターゲット')).toBeVisible();

    /**
     * ログインメニューを検証する(Roleとhref属性をセットで確認)
     * 「ログイン」という文字列と完全に一致する要素だけを探すように、
     * オプション exact: true を追加
     */
    await expect(page.getByRole('link', { name: 'ログイン', exact: true })).toHaveAttribute('href', '/front/login');

    /**
     * 共通メニューを検証する(Roleとhref属性をセットで確認)
     * 文字列と完全に一致する要素だけを探すように、
     * オプション exact: true を追加
     */
    await expect(page.getByRole('link', { name: 'ユーザー登録' , exact: true })).toHaveAttribute('href', '/front/users/register');
    await expect(page.getByRole('link', { name: '商品キーワード検索' , exact: true })).toHaveAttribute('href', '/front/products/search');
    await expect(page.getByRole('link', { name: '商品登録' , exact: true })).toHaveAttribute('href', '/front/products/register');
    await expect(page.getByRole('link', { name: '商品変更' , exact: true})).toHaveAttribute('href', '/front/products/update');
});