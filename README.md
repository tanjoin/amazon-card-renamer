# Amazon Card Renamer

Amazon.co.jp のカード表示を、見分けやすい任意の名前に置き換える Chrome 拡張機能です。

カードの下4桁と表示名を登録しておくと、Amazon の支払い・クレジットカード一覧で、たとえば「1234」ではなく「楽天カード (末尾: 1234)」のように表示できます。

## 機能概要

- Amazon のカード番号表示を自分のわかりやすい名称に置換
- 各カードごとに「下4桁」と「表示名」を登録可能
- 拡張機能の設定画面から簡単に追加・削除
- ブラウザの同期保存に対応
- Amazon のモダン UI と従来 UI の両方に対応

## 画面イメージ

設定画面では、以下のようにカード情報を登録します。

- 下4桁: 9876
- 表示名: 楽天カード

保存後、Amazon 上では次のように表示されます。

- 楽天カード (末尾: 9876)

## インストール方法

1. このリポジトリをローカルにダウンロードまたは clone します。
2. Google Chrome または Chromium ベースのブラウザを開きます。
3. アドレスバーに `chrome://extensions` を入力して開きます。
4. 右上の「デベロッパーモード」を有効にします。
5. 「パッケージ化されていない拡張機能を読み込む」を選択します。
6. このプロジェクト内の `src` フォルダを選択して読み込みます。
7. 必要に応じて拡張機能のアイコンを用意します。

> `manifest.json` では `icon128.png` を参照しているため、読み込み前に `src/icon128.png` を作成しておくと安心です。

## 使い方

### 1. 設定画面を開く

拡張機能のオプション画面を開きます。

- Chrome の拡張機能一覧から「Amazon Card Renamer」を選択
- もしくは `manifest.json` の `options_page` に基づいて設定ページを開く

### 2. カードを登録する

- 下4桁欄にカード番号の末尾 4 桁を入力
- 表示名欄にわかりやすい名前を入力
- 「保存」を押す

### 3. Amazon を開く

Amazon.co.jp のクレジットカード表示が自動的に置き換わります。

### 4. 登録削除

登録済みカード一覧の「削除」ボタンで項目を削除できます。

## 対応ファイル

- `src/manifest.json` : 拡張機能の設定
- `src/content.js` : Amazon ページのカード表示を書き換える処理
- `src/options.html` : 設定画面の UI
- `src/options.js` : 保存・削除ロジック

## アイコン生成方法

`src/icon128.png` を作成したい場合は、ブラウザのデベロッパーコンソールで次のコードを実行します。

```js
const canvas = document.createElement('canvas');
canvas.width = 128;
canvas.height = 128;
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#FF9900';
ctx.fillRect(0, 0, 128, 128);

ctx.font = '64px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('💳️', 64, 64);

const link = document.createElement('a');
link.download = 'icon128.png';
link.href = canvas.toDataURL('image/png');
link.click();
```

保存した画像を `src/icon128.png` に配置してください。

## 補足

- 保存先は `chrome.storage.sync` を使用しているため、同じ Chrome アカウント環境では設定が同期されます。
- 利用する Amazon のページ構造が変わった場合、`content.js` のセレクタ調整が必要になることがあります。
- 本拡張機能は、Amazon 表示の見た目をわかりやすくする用途に特化しています。

## ライセンス

本プロジェクトの利用条件は [LICENSE](LICENSE) に定めています。

- 個人利用・非商用利用・動作確認目的に限定
- 再配布・改変版の公開・第三者への提供は禁止
- Amazon 利用規約や法令に違反する利用は禁止
- 免責事項を明記

利用前に [LICENSE](LICENSE) を必ず確認してください。
