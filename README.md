# amazon-card-renamer

## アイコンの作成

ブラウザのデベロッパーコンソールで以下のコードを実行すると、128x128のアイコンが作成されます。背景はオレンジ色で、中央にショッピングカートの絵文字が配置されます。

```js
const canvas = document.createElement('canvas');
canvas.width = 128; 
canvas.height = 128;
const ctx = canvas.getContext('2d');

// 背景をオレンジに塗りつぶす
ctx.fillStyle = '#FF9900'; 
ctx.fillRect(0, 0, 128, 128);

// 中央に絵文字を配置
ctx.font = '64px sans-serif'; 
ctx.textAlign = 'center'; 
ctx.textBaseline = 'middle';
ctx.fillText('🛒', 64, 64);

// ダウンロードを実行
const link = document.createElement('a');
link.download = 'icon128.png'; 
link.href = canvas.toDataURL('image/png');
link.click();
```