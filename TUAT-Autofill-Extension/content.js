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
            var id = document.getElementById('identifier');
            var pass = document.getElementById('password');
            if(typeof ID === "undefined"){
                ID = '';
            }
            if(typeof PASS === "undefined"){
                PASS = '';
            }
            id.value = ID;
            pass.value = PASS;
            document.getElementByXPath('//*[@id="login"]/button').click();
        }
        if(uri.pathname == '/auth/session/second_factor'){
            document.getElementById('totp-form-selector').click();
            if(typeof KEY === "undefined"){
                document.getElementById('totp').value = '';
            }
            else{
                document.getElementById('totp').value = totp(KEY);
                document.getElementByXPath('//*[@id="totp-form"]/button').click();
            }
        }
    });
})();



// Material Symbols フォント読み込み
(function loadMaterialSymbols() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block';
    document.head.appendChild(link);

    var style = document.createElement('style');
    style.textContent = '.tuat-ms{font-family:"Material Symbols Outlined";font-style:normal;font-size:20px;display:inline-block;line-height:1;letter-spacing:normal;text-transform:none;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24}';
    document.head.appendChild(style);
})();

function showSettingsButton() {
    var btn = document.createElement('div');
    btn.title = 'TUAT Autofill Extension 設定';
    btn.style.cssText = [
        'position: fixed',
        'bottom: 20px',
        'right: 16px',
        'width: 48px',
        'height: 48px',
        'border-radius: 50%',
        'background: #4d84b4',
        'box-shadow: 0 2px 6px rgba(0,0,0,0.3)',
        'cursor: pointer',
        'z-index: 99999',
        'user-select: none',
        '-webkit-tap-highlight-color: transparent',
        'display: flex',
        'align-items: center',
        'justify-content: center',
    ].join(';');

    var icon = document.createElement('span');
    icon.className = 'tuat-ms notranslate';
    icon.setAttribute('translate', 'no');
    icon.textContent = 'settings';
    icon.style.cssText = 'font-size:28px; color:#ffffff; pointer-events:none;';

    btn.appendChild(icon);
    btn.addEventListener('click', function () {
        toggleSettingsPanel();
    });

    document.body.appendChild(btn);
}

// === インライン設定パネル ===
var settingsPanel = null;
var totpTimerInterval = null;

function toggleSettingsPanel() {
    if (settingsPanel) {
        var isHidden = settingsPanel.style.display === 'none';
        settingsPanel.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            loadSettingsToPanel();
            startTotpTimer();
        } else {
            stopTotpTimer();
        }
        return;
    }
    createSettingsPanel();
}

function createSettingsPanel() {
    settingsPanel = document.createElement('div');
    settingsPanel.style.cssText = [
        'position: fixed',
        'bottom: 76px',
        'right: 12px',
        'width: min(320px, calc(100vw - 24px))',
        'background: #FFFFFF',
        'border: 2px solid #4d84b4',
        'border-radius: 15px',
        'box-shadow: 0 10px 30px rgba(0,0,0,0.2)',
        'z-index: 99999',
        'font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif',
        'overflow: hidden',
        'color: #1C1B1F',
    ].join(';');

    // ヘッダー
    var headerHtml = [
        '<div style="padding:14px 16px; background:#4d84b4; display:flex; justify-content:space-between; align-items:center;">',
        '  <span style="font-size:15px; font-weight:700; color:#fff;">TUAT Autofill Extension 設定</span>',
        '  <span id="tuat-panel-close" class="tuat-ms notranslate" translate="no" style="color:#fff; cursor:pointer; font-size:22px;">close</span>',
        '</div>',
    ].join('');

    // フォーム本体
    var bodyHtml = [
        '<div style="padding:20px 16px 16px;">',
        '  <div id="tuat-key-container" style="position:relative; margin-bottom:8px;">',
        '    <input type="text" id="tuat-cfg-key" placeholder="シークレットキーを入力してください"',
        '      autocomplete="off" data-1p-ignore data-lpignore="true" data-form-type="other"',
        '      style="display:block; width:100%; padding:12px 44px 12px 12px; border:1px solid #CAC4D0; border-radius:4px; font-size:14px; box-sizing:border-box; outline:none; background:#fff; color:#1C1B1F; transition:border-color 0.2s; -webkit-text-security:disc;">',
        '    <span id="tuat-toggle-key" class="tuat-ms notranslate" translate="no" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); cursor:pointer; color:#49454F; user-select:none;">visibility</span>',
        '  </div>',
        // Saveボタン（シークレットキー入力欄の直下、横長）
        '  <div style="margin-bottom:14px;">',
        '    <button id="tuat-save-btn" style="width:100%; padding:8px 24px; background:#4d84b4; color:#fff; border:none; border-radius:20px; font-size:13px; font-weight:600; cursor:pointer; letter-spacing:0.3px; transition:background 0.2s;">Save</button>',
        '  </div>',
        // トークンラベル（左端） + TOTPプレビュー（中央） + 円形タイマー（右端）
        '  <div style="position:relative; display:flex; align-items:center; justify-content:center; min-height:40px; margin:0 0 0;">',
        '    <span style="position:absolute; left:0; font-size:12px; font-weight:500; color:#79747E;">トークン</span>',
        '    <div id="tuat-totp-display" style="font-size:24px; font-weight:700; color:#1C1B1F; letter-spacing:4px; font-family:monospace;"></div>',
        '    <div id="tuat-timer-area" style="position:absolute; right:0; top:50%; transform:translateY(-50%); visibility:hidden;">',
        '      <svg id="tuat-timer-svg" width="40" height="40" viewBox="0 0 40 40" style="display:block;">',
        '        <circle cx="20" cy="20" r="16" fill="none" stroke="#E0E0E0" stroke-width="3"/>',
        '        <circle id="tuat-timer-arc" cx="20" cy="20" r="16" fill="none" stroke="#4d84b4" stroke-width="3" stroke-linecap="round" stroke-dasharray="100.53" stroke-dashoffset="0" transform="rotate(-90 20 20)"/>',
        '        <text id="tuat-timer-text" x="20" y="20" text-anchor="middle" dominant-baseline="central" fill="#49454F" font-size="11" font-weight="500">30</text>',
        '      </svg>',
        '    </div>',
        '  </div>',
        // ステータス表示（生成キーの下に固定スペース確保）
        '  <div style="text-align:center; height:20px; line-height:20px; margin:0;">',
        '    <span id="tuat-save-status" style="color:#198754; font-size:12px; font-weight:500; visibility:hidden;"></span>',
        '  </div>',
        '</div>',
    ].join('\n');

    // Buy Me a Coffee フッター
    var footerHtml = [
        '<div style="border-top:1px solid #E0E0E0; padding:12px 16px; text-align:center;">',
        '  <p style="font-size:12px; color:#79747E; margin:0 0 8px;">この拡張機能が役に立ったら、寄付を検討していただけると嬉しいです！</p>',
        '  <a href="https://www.buymeacoffee.com/yate" target="_blank">',
        '    <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height:36px; width:auto;">',
        '  </a>',
        '</div>',
    ].join('\n');

    settingsPanel.innerHTML = headerHtml + bodyHtml + footerHtml;
    document.body.appendChild(settingsPanel);

    // --- イベントリスナー ---

    // 閉じるボタン
    document.getElementById('tuat-panel-close').addEventListener('click', function () {
        settingsPanel.style.display = 'none';
        stopTotpTimer();
    });

    // 入力フィールドのフォーカススタイル
    var keyInput = document.getElementById('tuat-cfg-key');
    keyInput.addEventListener('focus', function () {
        this.style.borderColor = '#4d84b4';
        this.style.borderWidth = '2px';
        this.style.padding = '11px 43px 11px 11px';
    });
    keyInput.addEventListener('blur', function () {
        this.style.borderColor = '#CAC4D0';
        this.style.borderWidth = '1px';
        this.style.padding = '12px 44px 12px 12px';
    });

    // シークレットキー表示切替（Material Symbols）
    var keyMasked = true;
    document.getElementById('tuat-toggle-key').addEventListener('click', function () {
        var inp = document.getElementById('tuat-cfg-key');
        if (keyMasked) {
            inp.style.webkitTextSecurity = 'none';
            this.textContent = 'visibility_off';
        } else {
            inp.style.webkitTextSecurity = 'disc';
            this.textContent = 'visibility';
        }
        keyMasked = !keyMasked;
    });

    // 保存処理（共通関数）
    function doSave() {
        var key = document.getElementById('tuat-cfg-key').value;

        chrome.storage.local.set({ 'key': key }, function () {
            var statusEl = document.getElementById('tuat-save-status');

            if (key && key.length > 0) {
                var totpValue = totp(key);
                document.getElementById('tuat-totp-display').textContent = totpValue;
                startTotpTimer();

                // クリップボードにTOTPをコピー
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(totpValue).then(function () {
                        statusEl.textContent = 'コピー済み';
                        statusEl.style.visibility = 'visible';
                        setTimeout(function () { statusEl.style.visibility = 'hidden'; statusEl.textContent = ''; }, 3000);
                    }).catch(function () {
                        statusEl.textContent = '保存済み';
                        statusEl.style.visibility = 'visible';
                        setTimeout(function () { statusEl.style.visibility = 'hidden'; statusEl.textContent = ''; }, 3000);
                    });
                } else {
                    statusEl.textContent = '保存済み';
                    statusEl.style.visibility = 'visible';
                    setTimeout(function () { statusEl.style.visibility = 'hidden'; statusEl.textContent = ''; }, 3000);
                }
            } else {
                document.getElementById('tuat-totp-display').textContent = '';
                stopTotpTimer();
                statusEl.textContent = '保存済み';
                statusEl.style.visibility = 'visible';
                setTimeout(function () { statusEl.style.visibility = 'hidden'; statusEl.textContent = ''; }, 3000);
            }
        });
    }

    // 保存ボタン
    document.getElementById('tuat-save-btn').addEventListener('click', doSave);

    // シークレットキー入力欄でEnterキー押下時も保存
    keyInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSave();
        }
    });

    // 既存データを読み込み
    loadSettingsToPanel();
}

function loadSettingsToPanel() {
    chrome.storage.local.get(['key'], function (items) {
        document.getElementById('tuat-cfg-key').value = items.key || '';
        if (items.key && items.key.length > 0) {
            document.getElementById('tuat-totp-display').textContent = totp(items.key);
            startTotpTimer();
        } else {
            document.getElementById('tuat-totp-display').textContent = '';
            stopTotpTimer();
        }
    });
}

// === TOTPタイマー（円形） ===
var TUAT_TIMER_CIRCUMFERENCE = 2 * Math.PI * 16; // r=16 → ≈100.53

function getTotpRemaining() {
    return 30 - (Math.floor(Date.now() / 1000) % 30);
}

function startTotpTimer() {
    stopTotpTimer();
    var timerArea = document.getElementById('tuat-timer-area');
    if (!timerArea) return;
    timerArea.style.visibility = 'visible';
    updateTotpTimer(true);
    totpTimerInterval = setInterval(updateTotpTimer, 1000);
}

function stopTotpTimer() {
    if (totpTimerInterval) {
        clearInterval(totpTimerInterval);
        totpTimerInterval = null;
    }
    var timerArea = document.getElementById('tuat-timer-area');
    if (timerArea) timerArea.style.visibility = 'hidden';
}

function updateTotpTimer(skipTransition) {
    var remaining = getTotpRemaining();
    var arc = document.getElementById('tuat-timer-arc');
    var text = document.getElementById('tuat-timer-text');
    if (!arc || !text) return;

    text.textContent = remaining;
    // 円弧の残量を計算（負の値で時計回りに減少）
    var offset = -(TUAT_TIMER_CIRCUMFERENCE * (1 - remaining / 30));

    // 初回表示・リセット時はアニメーションを省略
    if (skipTransition || remaining === 30) {
        arc.style.transition = 'none';
        arc.setAttribute('stroke-dashoffset', offset);
        // 強制リフローでtransition:noneを即座に適用
        arc.getBoundingClientRect();
        arc.style.transition = 'stroke-dashoffset 1s linear';
    } else {
        arc.style.transition = 'stroke-dashoffset 1s linear';
        arc.setAttribute('stroke-dashoffset', offset);
    }

    // 残り5秒以下で警告色
    if (remaining <= 5) {
        arc.setAttribute('stroke', '#d32f2f');
        text.setAttribute('fill', '#d32f2f');
    } else {
        arc.setAttribute('stroke', '#4d84b4');
        text.setAttribute('fill', '#49454F');
    }

    // 残り0秒でTOTP再生成
    if (remaining === 30) {
        chrome.storage.local.get(['key'], function (items) {
            if (items.key && items.key.length > 0) {
                document.getElementById('tuat-totp-display').textContent = totp(items.key);
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showSettingsButton);
} else {
    showSettingsButton();
}
//(yulanitの内部管理的にはTUAT-AE-for-Android-0.3.10-openだったもの)