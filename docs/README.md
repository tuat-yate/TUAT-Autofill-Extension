# ストア公開用ドキュメント・素材

各ブラウザの拡張機能ストアに公開する際に使う画像・スクリーンショットなどを置く場所です。
素材はブラウザ共通で、この `docs/` 直下にまとめて置きます。

## Microsoft Edge アドオン ストアの画像要件

Partner Center の「ストア掲載情報」で必要になる画像。仕様は変わることがあるので、登録時に公式の最新仕様も確認してください。

| 用途 | サイズ | 形式 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| ストアロゴ | 300 × 300 px | PNG | 必須 | 一覧・詳細ページのアイコン |
| スクリーンショット | 1280 × 800 px（または 640 × 480 px） | PNG / JPG | 1 枚以上必須 | 最大 10 枚 |
| 小さい宣伝用タイル | 440 × 280 px | PNG / JPG | 任意 | |
| 大きい宣伝用タイル（マーキー） | 1400 × 560 px | PNG / JPG | 任意 | 特集掲載に使われる場合あり |

> 拡張機能本体のアイコン（128×128）はパッケージ内の `icon128.png` を使用します。ストアロゴ（300×300）はそれとは別に用意が必要です。

## 公開時に画像以外で必要なもの（Edge）

- 説明文（短い説明・詳しい説明）
- プライバシーポリシーの URL もしくはプライバシー方針の記載
- カテゴリ・対応言語
- サポート連絡先

## Store description（説明文・英語）

ストア掲載情報の説明欄に記載するテキスト。

**Short description（短い説明 / 一覧表示用・1〜2文）**

> Automatically fills in your credentials and generates the one-time password (TOTP) for Tokyo University of Agriculture and Technology's two-factor authentication.

**Detailed description（詳しい説明）**

> TUAT Autofill Extension streamlines signing in to the Tokyo University of Agriculture and Technology (TUAT) authentication system (tuat.ex-tic.com).
>
> Once you save your user ID, password, and TOTP secret on the options page, the extension automatically:
> - fills in your user ID and password on the login screen, and
> - generates a time-based one-time password (TOTP) from your saved secret and enters it on the two-factor authentication screen.
>
> All information is stored only in your browser's local storage and is never sent to any external server.
>
> Notes:
> - The one-time password shown on the options page refreshes each time you press "Save". If a code is rejected, press "Save" and try again, as it may have expired.
> - If codes never match, check that your computer's clock is synchronized, since TOTP depends on the correct time.
> - For security, consider entering your regular password manually (or via the browser's autofill) and using this extension only for the one-time password.
>
> This is an unofficial, individually developed extension and is not an official service of Tokyo University of Agriculture and Technology. The developer assumes no liability for any damage arising from its use.

## Notes for certification（審査担当者向けメモ）

ストア審査の「Notes for certification / Notes to reviewer」欄に記載するテキスト。

**English**

> Please note that this extension only works on the authentication site of Tokyo University of Agriculture and Technology (https://tuat.ex-tic.com/), which is accessible only to the university's enrolled students with a valid account. Reviewers outside the university cannot sign in to this site, so the auto-fill behavior may not be fully reproducible without a valid student account and a TOTP secret issued by the university.
>
> All extension logic (credential auto-fill and TOTP generation) runs only on this single domain, and all credentials are stored solely in the browser's local storage and are never sent externally.

**日本語**

> 本拡張機能は東京農工大学の認証サイト（https://tuat.ex-tic.com/）でのみ動作します。このサイトは有効なアカウントを持つ同大学の在学生のみがアクセスでき、学外の審査担当者はログインできません。そのため、大学が発行する有効な学生アカウントとTOTPシークレットがない環境では、自動入力の動作を完全には再現できない可能性があります。
>
> 拡張機能のすべての処理（認証情報の自動入力とTOTP生成）はこの単一ドメイン上でのみ実行され、認証情報はブラウザのローカルストレージにのみ保存され、外部に送信されることはありません。

## Single purpose description（単一用途の説明）

ストア審査で必須の「単一用途」欄に記載するテキスト。

**日本語**

> 東京農工大学の統合認証システム（tuat.ex-tic.com）のログインを自動化することだけを目的とした拡張機能です。あらかじめ保存したユーザーID・パスワードをログイン画面に自動入力し、二段階認証画面では保存したシークレットからワンタイムパスワード（TOTP）を生成して自動入力します。

**English**

> This extension has a single purpose: to automate sign-in to Tokyo University of Agriculture and Technology's authentication system (tuat.ex-tic.com). It fills in the saved user ID and password on the login page, and on the two-factor authentication page it generates a one-time password (TOTP) from the saved secret and enters it automatically.

## Permission justification（権限の正当性）

ストア審査で各権限ごとに記入を求められる「この権限が必要な理由」のテキスト。

### `storage`

**日本語**

> ユーザーが設定画面で入力したユーザーID・パスワード・TOTPシークレットを、端末内のローカルストレージ（chrome.storage.local）に保存するために使用します。保存した情報はログイン画面への自動入力にのみ利用し、外部サーバーへの送信や第三者との共有は一切行いません。

**English**

> Used to store the user ID, password, and TOTP secret that the user enters on the options page in the browser's local storage (chrome.storage.local). The stored data is used solely to auto-fill the sign-in form and is never transmitted to any external server or shared with third parties.

### ホスト権限 `https://tuat.ex-tic.com/*`（Host permission）

**日本語**

> 東京農工大学の認証サイト（tuat.ex-tic.com）のログイン画面および二段階認証画面でのみ、保存済みの認証情報の自動入力とワンタイムパスワードの自動生成・入力を行うために使用します。このドメイン以外のページでは一切動作しません。

**English**

> Used only on the login and two-factor authentication pages of the university authentication site (tuat.ex-tic.com) to auto-fill the saved credentials and to generate and enter the one-time password. The extension does not run on any other domain.

## Remote code use（リモートコードの使用）

ストア審査の「リモートコードを使用していますか？」への回答。

**回答：いいえ（No, I am not using remote code）**

**日本語**

> この拡張機能はリモートコードを使用していません。すべての実行コード（jsrsasign、content.js、libs.js、options.js など）は拡張機能パッケージに同梱されており、外部サーバーからスクリプトを読み込んだり `eval` で動的にコードを実行したりすることはありません。寄付ボタンで外部URLの画像を1点表示しますが、これは画像であり実行可能なコードではありません。

**English**

> This extension does not use remote code. All executable code (jsrsasign, content.js, libs.js, options.js, etc.) is bundled in the extension package. It does not load scripts from any external server or execute code dynamically via `eval`. The donation button displays a single image from an external URL, but that is an image, not executable code.

## アップロードするパッケージ

`npm run build:chrome` で生成される `dist/package_chrome.zip` をアップロードします
（Edge と Chrome は同一の Manifest V3 パッケージなので共通）。