let cardMap = {};

function replaceTextInNode(node) {
  // 登録データが空なら何もしない
  if (Object.keys(cardMap).length === 0) return;

  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentElement && (node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE')) {
      return;
    }
    
    let text = node.nodeValue;
    for (const [last4, customName] of Object.entries(cardMap)) {
      const regex = new RegExp(`(?:[A-Za-z]+\\s*)?(?:[•*・]+|下4桁)\\s*${last4}`, 'gi');
      text = text.replace(regex, `${customName} (末尾: ${last4})`);
    }
    
    if (text !== node.nodeValue) {
      node.nodeValue = text;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceTextInNode(child);
    }
  }
}

// ストレージから設定を読み込んでから置換処理を実行する
chrome.storage.sync.get({ cardMap: {} }, (items) => {
  cardMap = items.cardMap;
  
  // 1. 初回実行
  replaceTextInNode(document.body);

  // 2. 画面の動的変化を監視
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      for (let addedNode of mutation.addedNodes) {
        replaceTextInNode(addedNode);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});