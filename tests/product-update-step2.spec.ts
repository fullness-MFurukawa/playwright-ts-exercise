import { test, expect } from '@playwright/test';

/**
 * 課題-2-1 模範解答
 */
test('価格にマイナス値を入力して保存すると、バリデーションエラーが表示されることを検証する', async ({ page }) => {
    // 1. 事前準備：ログイン処理
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  
    // 2.トップメニューから「商品変更」画面へ遷移する
    await page.getByRole('link', { name: '変更画面へ進む' }).click();

    // 3. 検索フェーズ（Step 1）
    const targetUuid = '84b3a93b-354f-4b10-a679-012c515a723d';
    await page.getByLabel('検索：商品UUID').fill(targetUuid);
    await page.getByRole('button', { name: '商品を検索' }).click();

    // プレビューが表示されたら「この内容を変更する」ボタンをクリックして編集フェーズへ
    const editButton = page.getByRole('button', { name: 'この内容を変更する' });
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 4. 編集フェーズ（Step 2）
    // 画面が編集フォームに切り替わったことを待機・検証する（見出し下の説明文で判定）
    await expect(page.getByText('新しい情報を入力して保存してください。')).toBeVisible();

    // 価格の入力欄を特定
    const priceInput = page.getByLabel('価格');
    
    // すでに入っている元の価格をクリアしてから、マイナス値を入力する
    await priceInput.clear();
    await priceInput.fill('-100');

    // 変更を保存ボタンをクリック
    await page.getByRole('button', { name: '変更を保存' }).click();

    // 5. 結果の検証（アサーション）
    // 期待されるエラーメッセージが共通エラー領域に表示されることを検証する
    await expect(page.getByText('単価は0以上の整数を指定してください。')).toBeVisible();

    // 成功時のモーダルが表示されていないことも検証する
    await expect(page.getByText('更新完了')).not.toBeVisible();
});

/**
 * 課題-2-2 模範解答
 */
test('適切な値を入力して保存すると、更新完了モーダルが表示されることを検証する', async ({ page }) => {

   // 1. 事前準備：ログイン処理
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  
    // 2.トップメニューから「商品変更」画面へ遷移する
    await page.getByRole('link', { name: '変更画面へ進む' }).click();

    // 3. 検索フェーズ（Step 1）
    const targetUuid = '84b3a93b-354f-4b10-a679-012c515a723d';
    await page.getByLabel('検索：商品UUID').fill(targetUuid);
    await page.getByRole('button', { name: '商品を検索' }).click();

    // プレビューが表示されたら「この内容を変更する」ボタンをクリックして編集フェーズへ
    const editButton = page.getByRole('button', { name: 'この内容を変更する' });
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 4. 編集フェーズ（Step 2）
    await expect(page.getByText('新しい情報を入力して保存してください。')).toBeVisible();
    // 価格の変更
    const priceInput = page.getByLabel('価格');
    await priceInput.clear();
    await priceInput.fill('500');
    // 在庫数の変更
    const stockInput = page.getByLabel('在庫数');
    await stockInput.clear();
    await stockInput.fill('70');

    // 5. 保存とモーダルの検証
    await page.getByRole('button', { name: '変更を保存' }).click();

    // 更新完了モーダルの出現を検証
    await expect(page.getByText('更新完了')).toBeVisible();
    await expect(page.getByText('商品情報の更新が正常に終了しました。')).toBeVisible();

    // 「商品検索へ戻る」ボタンをクリックして、画面が初期状態（Step1）に戻ることを検証
    await page.getByRole('button', { name: '商品検索へ戻る' }).click();
    await expect(page.getByText('変更対象の商品をIDで特定してください。')).toBeVisible();
    await expect(page.getByLabel('検索：商品UUID')).toHaveValue('');
});