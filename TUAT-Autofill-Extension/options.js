// code from https://www.tackn.jp/post-3815.html
function Save() {
  var id = document.getElementById('id_text').value;
  var pass = document.getElementById('pass_text').value;
  var key = document.getElementById('key_text').value;
 
  chrome.storage.local.set({'id': id}, function () {});
  chrome.storage.local.set({'pass': pass}, function () {});
  chrome.storage.local.set({'key': key}, function () {});
}
 
function Load() {
  chrome.storage.local.get(['id','pass','key'], function (items) {
    document.getElementById('id_text').value = items.id;
    document.getElementById('pass_text').value = items.pass;
    document.getElementById('key_text').value = items.key;
    if(typeof items.id === 'undefined'){
      document.getElementById('id_text').value = '';  
    }
    if(typeof items.pass === 'undefined'){
      document.getElementById('pass_text').value = '';  
    }
    if(typeof items.key === 'undefined'){
      document.getElementById('key_text').value = '';  
    }
  });
}

// オプションページ（options.html）の読み込みと解析が完了したらLoad関数を実行
document.addEventListener('DOMContentLoaded', Load);

// 保存ボタン（save_button）がクリックされたらSave関数を実行
document.getElementById('save_button').addEventListener('click', Save);