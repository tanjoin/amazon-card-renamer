let cardMap = {};

function processAmazonUI(rootNode) {
  if (Object.keys(cardMap).length === 0) return;

  if (rootNode.nodeType === Node.ELEMENT_NODE) {
    // --- パターン1: モダンUI (data-testidのspan分割型) ---
    const wrapperSelector = '[data-testid$="-text-wrapper"]';
    let wrappers = [];
    if (rootNode.matches && rootNode.matches(wrapperSelector)) {
      wrappers = [rootNode];
    } else if (rootNode.querySelectorAll) {
      wrappers = Array.from(rootNode.querySelectorAll(wrapperSelector));
    }

    wrappers.forEach(wrapper => {
      if (wrapper.dataset.renamed) return;

      const numSpan = wrapper.querySelector('[data-testid$="-number"]');
      if (numSpan) {
        const last4 = numSpan.textContent.trim();
        if (cardMap[last4]) {
          numSpan.textContent = `${cardMap[last4]} (末尾: ${last4})`;
          
          const nameSpan = wrapper.querySelector('[data-testid$="-name"]');
          const prefixSpan = wrapper.querySelector('[data-testid$="-prefix"]');
          if (nameSpan) nameSpan.style.display = 'none';
          if (prefixSpan) prefixSpan.style.display = 'none';
          
          wrapper.dataset.renamed = "true";
        }
      }
    });

    // --- パターン2: 従来型UI (今回ご提示いただいた pmts-cc-number 等) ---
    const legacySelector = '.pmts-cc-number, [data-number]';
    let legacyNodes = [];
    if (rootNode.matches && rootNode.matches(legacySelector)) {
      legacyNodes = [rootNode];
    } else if (rootNode.querySelectorAll) {
      legacyNodes = Array.from(rootNode.querySelectorAll(legacySelector));
    }

    legacyNodes.forEach(node => {
      if (node.dataset.renamed) return;
      
      for (const [last4, customName] of Object.entries(cardMap)) {
        // 要素内のテキストに下4桁が含まれていれば、要素ごと書き換える
        if (node.textContent.includes(last4)) {
          node.textContent = `${customName} (末尾: ${last4})`;
          node.dataset.renamed = "true";
          break;
        }
      }
    });
  }

  // --- パターン3: どの属性にも属さない純粋なテキストのフォールバック ---
  replaceTextNodes(rootNode);
}

function replaceTextNodes(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement;
    if (parent) {
      if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
      // パターン1, 2で既に書き換え済みの要素の中身は無視する
      if (parent.closest && parent.closest('[data-testid$="-text-wrapper"], .pmts-cc-number, [data-number]')) return;
    }
    
    let text = node.nodeValue;
    let modified = false;

    for (const [last4, customName] of Object.entries(cardMap)) {
      // 正規表現に「末尾」を追加
      const regex = new RegExp(`(?:[A-Za-z]+\\s*)?(?:[•*・]+|下4桁|末尾)\\s*${last4}`, 'gi');
      if (regex.test(text)) {
        text = text.replace(regex, `${customName} (末尾: ${last4})`);
        modified = true;
      }
      // 4桁の数字だけが独立している場合
      else if (text.trim() === last4) {
        if (parent) {
          const pText = parent.textContent;
          // 親のテキストに「末尾」が含まれている場合も対象にする
          if (pText.includes('•') || pText.includes('*') || pText.includes('末尾') || pText.includes('下4桁')) {
             text = `${customName} (末尾: ${last4})`;
             modified = true;
          }
        }
      }
    }
    
    if (modified) {
      node.nodeValue = text;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceTextNodes(child);
    }
  }
}

chrome.storage.sync.get({ cardMap: {} }, (items) => {
  cardMap = items.cardMap;
  
  processAmazonUI(document.body);

  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      for (let addedNode of mutation.addedNodes) {
        processAmazonUI(addedNode);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});