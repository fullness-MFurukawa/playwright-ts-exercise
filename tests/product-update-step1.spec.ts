import { test, expect } from '@playwright/test';

/**
 * 課題-1-1 模範解答
 */
test('存在する商品IDを入力して検索すると、該当商品の詳細が表示されることを検証する', async ({ page }) => {
    // 1.事前準備：ログイン処理
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  
    // 2.トップメニューから「商品変更」画面へ遷移する
    await page.getByRole('link', { name: '変更画面へ進む' }).click();
    
    // 画面遷移が完了したことを、見出しの出現で待機・検証する
    await expect(page.getByRole('heading', { name: '商品情報の変更' })).toBeVisible();

    // 3.検索の実行
    const targetUuid = '84b3a93b-354f-4b10-a679-012c515a723d';
    // ラベル名から入力欄を特定してUUIDを入力
    await page.getByLabel('検索：商品UUID').fill(targetUuid);
    // 検索ボタンをクリック
    await page.getByRole('button', { name: '商品を検索' }).click();

    // 4.結果の検証（アサーション）
    // 検索結果プレビューのヘッダーが表示されたことを確認
    await expect(page.getByText('現在の登録内容')).toBeVisible();

    // 取得したデータ（商品名・価格・在庫数）が画面上に正しく表示されているかを検証
    await expect(page.getByText('自動テスト商品_ABCD')).toBeVisible();
    await expect(page.getByText('400円')).toBeVisible();
    
    // ※30という数字はUUIDや他の箇所と被る可能性があるため、exact: true（完全一致）で探すのが安全
    await expect(page.getByText('30', { exact: true })).toBeVisible(); 

    // 次のステップへ進むためのボタンが活性化していることを検証
    await expect(page.getByRole('button', { name: 'この内容を変更する' })).toBeVisible();
});


/**
 * 課題-1-2 模範解答
 */
test('存在しない商品IDを入力して検索すると、エラーメッセージが表示されることを検証する', async ({ page }) => {
    // 1. 事前準備：ログイン処理
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  
    // 2. 商品変更画面へ遷移
    // トップメニューから「商品変更」画面へ遷移する
    await page.getByRole('link', { name: '変更画面へ進む' }).click();

    // 3. 検索の実行（存在しないUUID）
    const invalidUuid = '84b3a93b-354f-4b10-a679-012c515a723a';
    await page.getByLabel('検索：商品UUID').fill(invalidUuid);
    await page.getByRole('button', { name: '商品を検索' }).click();

    // 4. 結果の検証（アサーション）
    // 指定されたエラーメッセージが画面上に表示されることを確認する
    const expectedErrorMessage = `商品Id:${invalidUuid}の商品は存在しません。`;
    await expect(page.getByText(expectedErrorMessage)).toBeVisible();

    // 検索に失敗したため、プレビューや編集へ進むボタンが「表示されていないこと」を検証する
    await expect(page.getByText('現在の登録内容')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'この内容を変更する' })).not.toBeVisible();
});