import { test, expect } from '@playwright/test';

/**
 * 演習6-1 入力された商品の存在チェックをテストする
 */
test('既に登録されている商品名を入力すると、重複エラーが表示されること検証する', async ({ page }) => {
    // 事前準備：ログイン処理を実行する
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  
    // 商品新規登録画面へ遷移する
    await page.getByRole('link', { name: '登録画面へ進む', exact: true }).click();
  
    // 画面遷移が確実に完了したことを、見出し(<h1>)の出現で待機・検証する
    await expect(page.getByRole('heading', { name: '商品新規登録' })).toBeVisible();

    // 商品名入力欄の特定(プレースホルダーで取得)
    const productNameInput = page.getByPlaceholder('例：高性能ワイヤレスマウス');

    // すでに存在する商品名を入力
    await productNameInput.fill('水性ボールペン(黒)');

    // フォーカスを外して、onBlurイベントを発生させる
    await productNameInput.blur();

    // エラーメッセージが表示されることを検証する
    const errorMessage = page.getByText('商品名:水性ボールペン(黒)は既に存在します。');
    await expect(errorMessage).toBeVisible();
});

/**
 * 演習6-2 商品登録の正常系フローをテストする
 */
test('すべての必須項目を入力して登録すると、成功モーダルが表示されることを検証する', async ({ page , browserName }) => {

    // 受講者が自分の番号を設定する定数
    const STUDENT_NUMBER = '001'; // 受講者ごとの番号に変更する

    // 事前準備：ログインと直接遷移する
    await page.goto('http://74.226.194.15/front/login');
    await page.getByLabel('ユーザー名またはメールアドレス').pressSequentially('yamada', { delay: 50 });
    await page.getByLabel('パスワード').pressSequentially('passYamada', { delay: 50 });
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  
    // 商品新規登録画面へ遷移する
    await page.getByRole('link', { name: '登録画面へ進む', exact: true }).click();
    // 画面遷移が確実に完了したことを、見出し(<h1>)の出現で待機・検証する
    await expect(page.getByRole('heading', { name: '商品新規登録' })).toBeVisible();
  
    // 必須属性(required)を検証する
    const productNameInput = page.getByPlaceholder('例：高性能ワイヤレスマウス');
    await expect(productNameInput).toHaveAttribute('required', '');

    // データの入力(商品名は重複を避けるために受講者番号を付与)
    const shortTime = String(Date.now()).slice(-5);
    const uniqueProductName = `商品_${STUDENT_NUMBER}_${shortTime}_${browserName}`;
    await productNameInput.fill(uniqueProductName);
  
    // カテゴリの選択を選択する
    const categoryCombobox = page.getByRole('combobox', { name: 'カテゴリ' });
    await categoryCombobox.click();
    const optionBunbogu = page.getByRole('option', { name: '文房具', exact: true });
    await optionBunbogu.press('Enter');
    // 文房具が選択されたか検証する
    await expect(categoryCombobox).toHaveText(/文房具/);
    
    // 価格と在庫数を入力する
    await page.getByLabel('価格').fill('500');
    await page.getByLabel('在庫数').fill('100');

    // 登録の実行と完了モーダルの表示を検証する
    await page.getByRole('button', { name: '商品を登録する' }).click();
  
    // 正規表現を使った部分一致で成功メッセージを待機・検証する
    const successMessage = page.getByText(/商品の登録が完了しました/);
    await expect(successMessage).toBeVisible();

    // モーダルを閉じて入力項目がクリアされているかを検証する
    await page.getByRole('button', { name: '入力画面に戻る' }).click();
    // 入力欄がクリアされているか検証する
    await expect(productNameInput).toHaveValue(''); 
});