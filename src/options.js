const last4Input = document.getElementById('last4');
const customNameInput = document.getElementById('customName');
const saveBtn = document.getElementById('saveBtn');
const cardList = document.getElementById('cardList');

// 保存されている設定を読み込んで画面に表示する
function restoreOptions() {
  chrome.storage.sync.get({ cardMap: {} }, (items) => {
    cardList.innerHTML = '';
    for (const [last4, customName] of Object.entries(items.cardMap)) {
      const li = document.createElement('li');
      li.textContent = `末尾 ${last4} : ${customName}`;
      
      const delBtn = document.createElement('button');
      delBtn.textContent = '削除';
      delBtn.className = 'delete-btn';
      delBtn.onclick = () => deleteCard(last4);
      
      li.appendChild(delBtn);
      cardList.appendChild(li);
    }
  });
}

// 新しい設定を保存する
function saveOption() {
  const last4 = last4Input.value.trim();
  const customName = customNameInput.value.trim();
  
  if (!last4 || !customName) {
    alert("下4桁と表示名の両方を入力してください。");
    return;
  }

  chrome.storage.sync.get({ cardMap: {} }, (items) => {
    const map = items.cardMap;
    map[last4] = customName;
    chrome.storage.sync.set({ cardMap: map }, () => {
      last4Input.value = '';
      customNameInput.value = '';
      restoreOptions();
    });
  });
}

// 設定を削除する
function deleteCard(last4) {
  chrome.storage.sync.get({ cardMap: {} }, (items) => {
    const map = items.cardMap;
    delete map[last4];
    chrome.storage.sync.set({ cardMap: map }, () => {
      restoreOptions();
    });
  });
}

// 画面読み込み時とボタンクリック時のイベント
document.addEventListener('DOMContentLoaded', restoreOptions);
saveBtn.addEventListener('click', saveOption);