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