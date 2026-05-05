import { test, expect } from '@playwright/test';

/**
 * 演習4-3 ログイン画面の入力制御と異常系のテストをする
 */
test('ログインの入力制御とエラーメッセージが正しく機能することを検証する', async ({ page }) => {
    // ログイン画面へアクセスする
    await page.goto('http://74.226.194.15/front/login');

    // 要素を変数に格納して再利用しやすくする
    const userInput = page.getByLabel('ユーザー名またはメールアドレス');
    const passwordInput = page.getByLabel('パスワード');
    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true });

    // 【フロントエンド制御】必須属性(required)のを検証する
    await expect(userInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');

    // 【フロントエンド制御】未入力状態ではボタンが押せないことを検証する
    await expect(loginButton).toBeDisabled();

    // 誤った情報を入力(WebKit対策としてpressSequentially()を使用）
    await userInput.pressSequentially('wronguser@example.com', { delay: 50 });
    await passwordInput.pressSequentially('wrongpassword', { delay: 50 });

    //【フロントエンド制御】入力完了後、ボタンが押せるようになることを検証する
    await expect(loginButton).toBeEnabled();

    // ログインを実行する
    await loginButton.click();

    // エラーメッセージが表示されることを検証する
    const errorMessage = page.getByText('ユーザー名またはパスワードが異なります。');
    await expect(errorMessage).toBeVisible();
});