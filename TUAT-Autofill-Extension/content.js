function totp(key) {
    // 共有シークレット Google AuthenticatorはBase32文字列、SlinkPassはBase64文字列。
    // ワンタイムパスワードの時間間隔 Google Authenticatorは30秒、SlinkPassは60秒。
    // ワンタイムパスワードの桁数     Google Authenticatorは6桁、 SlinkPassは8桁。
    // 現在のエポック時刻を基にカウンタ計算
    var secret = base32tohex(key);  
    var digits = 6;
    var period = 30;
    var epoch  = new Date().getTime() / 1000;
    // カウンタとシークレットを十六進に変換、8バイトとのカウンター値を取得
    var count = parseInt(epoch / period);
    var arrCnt = new Array(8);
    for (i = arrCnt.length - 1; i >= 0; i--) {
        arrCnt[i] = dec2hex(count & 0xff);
        count >>= 8;
    }
    var hexCnt = CryptoJS.enc.Hex.parse(arrCnt.join(''));
    var hexSrt = CryptoJS.enc.Hex.parse(secret);
    // HMAC-SHA1でハッシュ値を生成
    var hexHmac = CryptoJS.HmacSHA1(hexCnt, hexSrt).toString(CryptoJS.enc.Hex);
    // ハッシュ値の20バイト目の下位4ビットを取り出しオフセット値とする
    var arrHmac = new Array();
    for (i = 0; i < hexHmac.length; i = i + 2) {
        arrHmac.push(hex2dec(hexHmac.substr(i, 2)));
    }
    var offset = arrHmac[arrHmac.length - 1] & 0xf;
    // オフセット値をハッシュ値のバイト列に当てはめ、そこから31ビット取り出す
    var truncate = hex2dec(hexHmac.substr(offset * 2, 8)) & 0x7fffffff;
    // 出力する桁数に合わせて切り詰める
    var otp = truncate % Math.pow(10, digits);
    // 桁数足りなかったら、前頭に0を補足してさい。
    while (otp.toString().length < digits) {
        otp = '0' + otp;
    }
    return otp;
}
// ライブラリ
function hex2dec(h) { return parseInt(h, 16); }
function dec2hex(d) { return ('0' + (Number(d).toString(16))).slice(-2); }
function leftpad(str, len, pad) {
    if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
}
function base32tohex(base32) {
    var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    var hex = "";
    for (var i = 0; i < base32.length; i++) {
        var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, '0');
    }
    for (var i = 0; i+4 <= bits.length; i+=4) {
        var chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16) ;
    }
    return hex;
}

document.getElementByXPath = function(sValue) { var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); if (a.snapshotLength > 0) { return a.snapshotItem(0); } };

(function () {
    chrome.storage.local.get(['id','pass','key'], function (items) {
        const ID = items.id;
        const PASS = items.pass;
        const KEY = items.key;

        var uri = new URL(window.location.href);
        if(uri.pathname == '/auth/session'){
            // 未設定の項目は上書きしない（ブラウザのパスワード自動入力を活かす）
            if(ID){
                document.getElementById('identifier').value = ID;
            }
            if(PASS){
                document.getElementById('password').value = PASS;
            }
            // 両方揃っているときだけ自動送信する（空のまま送信してログイン失敗を繰り返さないように）
            if(ID && PASS){
                document.getElementByXPath('//*[@id="login"]/button').click();
            }
        }
        if(uri.pathname == '/auth/session/second_factor'){
            document.getElementById('totp-form-selector').click();
            if(KEY){
                document.getElementById('totp').value = totp(KEY);
                document.getElementByXPath('//*[@id="totp-form"]/button').click();
            }
            else{
                document.getElementById('totp').value = '';
            }
        }
    });
})();

function showDonationButton() {
    const donationContainer = document.createElement('div');
    donationContainer.style.position = 'fixed';
    donationContainer.style.bottom = '0';
    donationContainer.style.left = '0';
    donationContainer.style.width = '100%';
    donationContainer.style.textAlign = 'center';
    donationContainer.style.backgroundColor = '#f8f9fa';
    donationContainer.style.padding = '10px';
    donationContainer.style.borderTop = '1px solid #dee2e6';
    donationContainer.style.zIndex = '9999';

    const donationText = document.createElement('p');
    donationText.innerText = 'この拡張機能が役に立ったら、寄付を検討していただけると嬉しいです！';
    donationText.style.margin = '0 0 10px 0';
    donationText.style.fontSize = '14px';

    const donationLink = document.createElement('a');
    donationLink.href = 'https://www.buymeacoffee.com/yate';
    donationLink.target = '_blank';

    const donationImage = document.createElement('img');
    donationImage.src = 'https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png';
    donationImage.alt = 'Buy Me A Coffee';
    donationImage.style.height = '41px';
    donationImage.style.width = '174px';

    donationLink.appendChild(donationImage);
    donationContainer.appendChild(donationText);
    donationContainer.appendChild(donationLink);

    document.body.appendChild(donationContainer);
    return donationContainer;
}

// === インライン設定パネル（Android版Edgeなどオプションページを開けない環境向け） ===
function settingsFieldHtml(id, label, secret) {
    return [
        '<div class="mb-3">',
        '  <label for="' + id + '" class="form-label">' + label + '</label>',
        '  <div class="input-group">',
        '    <input type="' + (secret ? 'password' : 'text') + '" id="' + id + '" class="form-control" autocomplete="off" autocapitalize="off" spellcheck="false" data-1p-ignore data-lpignore="true" data-form-type="other">',
        secret ? '    <button type="button" class="btn btn-outline-secondary" data-toggle-for="' + id + '"><i class="bi bi-eye"></i></button>' : '',
        '  </div>',
        '</div>',
    ].join('\n');
}

function showSettingsButton(bottomOffset) {
    // Shadow DOM 内の @font-face は読み込まれないため、アイコンフォントはページ側にも読み込む
    var iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = chrome.runtime.getURL('lib/bootstrap-icons.min.css');
    document.head.appendChild(iconLink);

    // 入力値（パスワード・シークレットキー）をページ側のスクリプトから読めないよう、closed な Shadow DOM 内に構築する
    var host = document.createElement('div');
    host.style.cssText = 'all: initial;';
    var root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = [
        '<link rel="stylesheet" href="' + chrome.runtime.getURL('lib/bootstrap.min.css') + '">',
        '<link rel="stylesheet" href="' + iconLink.href + '">',
        // Shadow DOM 内では :root にマッチしないため、data-bs-theme で Bootstrap の CSS 変数を有効にする
        '<div data-bs-theme="light" class="position-fixed end-0 me-3 d-flex flex-column align-items-end gap-2 fs-6 lh-base text-start" style="bottom:' + (bottomOffset + 16) + 'px; z-index:99999; font-family:var(--bs-body-font-family);">',
        '  <div id="panel" class="card shadow d-none" style="width:min(320px, calc(100vw - 32px)); max-height:calc(100vh - ' + (bottomOffset + 96) + 'px); overflow-y:auto;">',
        '    <div class="card-header text-bg-primary d-flex justify-content-between align-items-center">',
        '      <span class="fw-bold">TUAT Autofill Extension 設定</span>',
        '      <button id="close" type="button" class="btn-close btn-close-white" aria-label="閉じる"></button>',
        '    </div>',
        '    <div class="card-body">',
        settingsFieldHtml('id', 'ID', false),
        settingsFieldHtml('pass', 'Password（任意・非推奨）', true),
        settingsFieldHtml('key', 'シークレットキー', true),
        '      <button id="save" type="button" class="btn btn-primary w-100">Save</button>',
        '      <div id="token" class="mt-3 d-none">',
        '        <div class="d-flex justify-content-between align-items-center">',
        '          <span class="small text-body-secondary">トークン</span>',
        '          <span id="totp" class="fs-4 fw-bold font-monospace"></span>',
        '          <span id="remaining" class="small text-body-secondary"></span>',
        '        </div>',
        '        <div class="progress"><div id="timer" class="progress-bar"></div></div>',
        '      </div>',
        '      <div id="status" class="small text-success text-center mt-2 invisible">保存しました</div>',
        '    </div>',
        '  </div>',
        '  <button id="gear" type="button" class="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center" title="TUAT Autofill Extension 設定" style="width:48px; height:48px;"><i class="bi bi-gear-fill fs-4"></i></button>',
        '</div>',
    ].join('\n');
    document.body.appendChild(host);

    var panel = root.getElementById('panel');
    var idInput = root.getElementById('id');
    var passInput = root.getElementById('pass');
    var keyInput = root.getElementById('key');
    var statusEl = root.getElementById('status');
    var tokenTimer = null;
    var savedKey = '';

    // 毎秒現在時刻から再計算する（タブが裏に回ってタイマーが間引かれても古いトークンが残らないように）
    function updateToken() {
        var remaining = 30 - (Math.floor(Date.now() / 1000) % 30);
        root.getElementById('totp').textContent = totp(savedKey);
        root.getElementById('remaining').textContent = '残り' + remaining + '秒';
        root.getElementById('timer').style.width = (remaining / 30 * 100) + '%';
        root.getElementById('timer').classList.toggle('bg-danger', remaining <= 5);
    }

    function showToken(key) {
        savedKey = key;
        clearInterval(tokenTimer);
        root.getElementById('token').classList.toggle('d-none', !key);
        if (key) {
            updateToken();
            tokenTimer = setInterval(updateToken, 1000);
        }
    }

    function closePanel() {
        panel.classList.add('d-none');
        clearInterval(tokenTimer);
    }

    function save() {
        var key = keyInput.value;
        chrome.storage.local.set({ 'id': idInput.value, 'pass': passInput.value, 'key': key }, function () {
            showToken(key);
            // 保存時にトークンをクリップボードへコピー
            var copied = key && navigator.clipboard
                ? navigator.clipboard.writeText(totp(key)).then(function () { return true; }, function () { return false; })
                : Promise.resolve(false);
            copied.then(function (ok) {
                statusEl.textContent = ok ? '保存しました（トークンをコピー済み）' : '保存しました';
                statusEl.classList.remove('invisible');
                setTimeout(function () { statusEl.classList.add('invisible'); }, 3000);
            });
        });
    }

    root.getElementById('gear').addEventListener('click', function () {
        if (!panel.classList.contains('d-none')) {
            closePanel();
            return;
        }
        panel.classList.remove('d-none');
        chrome.storage.local.get(['id', 'pass', 'key'], function (items) {
            idInput.value = items.id || '';
            passInput.value = items.pass || '';
            keyInput.value = items.key || '';
            showToken(items.key || '');
        });
    });
    root.getElementById('close').addEventListener('click', closePanel);
    root.getElementById('save').addEventListener('click', save);

    // 入力欄でEnterキー押下時も保存
    panel.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.preventDefault();
            save();
        }
    });

    // パスワード・シークレットキーの表示切替
    panel.querySelectorAll('[data-toggle-for]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var input = root.getElementById(btn.dataset.toggleFor);
            var masked = input.type === 'password';
            input.type = masked ? 'text' : 'password';
            btn.firstElementChild.className = masked ? 'bi bi-eye-slash' : 'bi bi-eye';
        });
    });
}

function showExtensionUI() {
    // 寄付バナーに重ならないよう、設定ボタンとパネルはバナーの上に配置する
    showSettingsButton(showDonationButton().offsetHeight);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showExtensionUI);
} else {
    showExtensionUI();
}
