# TUAT-Autofill-Extension

https://img.shields.io/chrome-web-store/v/nnnckhaffpfnflhcgdhikjbkfdhnmode
https://img.shields.io/chrome-web-store/users/nnnckhaffpfnflhcgdhikjbkfdhnmode
https://img.shields.io/chrome-web-store/rating/nnnckhaffpfnflhcgdhikjbkfdhnmode

東京農工大学の二段階認証を自動入力するchrome拡張機能です．
本拡張機能は[このリンク](https://chrome.google.com/webstore/detail/tuat-autofill-extension/nnnckhaffpfnflhcgdhikjbkfdhnmode/)からChrome Web Storeで導入できます．

## Overview
https://github.com/tuat-yate/TUAT-Autofill-Extension/assets/56665094/da4b2a94-ded6-4f18-8dff-6657a7219443

## Usage

### ① 拡張機能をインストールする
本リポジトリもしくはChrome Web Storeから拡張機能をインストールしてください．
本リポジトリからダウンロードする場合は，`TUAT-Autofill-Extension.zip`を利用してください．

### ② シークレットキーの確認
本拡張機能は東京農工大学統合認証システムで各個人に発行されるシークレットキーが必要です．
シークレットキーは二段階アプリ認証の登録画面で確認することができます．
既にアプリ認証を登録済みの方は一旦解除する必要があります．
解除後，後述する方法で再登録を行ってください．

![スクリーンショット 2023-09-14 18 26 55](https://github.com/tuat-yate/TUAT-Autofill-Extension/assets/56665094/9fd135f8-d571-453c-9dc6-3791b3ac7a39)

### ③ 各種設定を入力する．
chrome画面の拡張機能アイコン(パズルマーク)→TUAT Autofill Extension横の3点ボタン→オプション　をクリックしてください．
<img src="https://github.com/tuat-yate/TUAT-Autofill-Extension/assets/56665094/53fa75c7-2acf-4bcb-b2d8-b85d78f70840" width="320px">

その後，設定画面で各種情報を入力してください．

保存を行うと，現時刻でのワンタイムパスワードが表示されます．ここで表示されたパスワードを②の「トークン」と表示されているところに入力して認証を行ってください．
ここでトークンを認証サイトに入力しない場合，入力されたシークレットキーが無効となるため注意してください．

アプリ認証を併用する場合は，②の画面で表示されているQRコードをアプリで読み込んでください．その後，拡張機能の設定画面に表示されているワンタイムパスワードとアプリ上の数字が一致していることを確認してから②のトークンに入力を行ってください．

〜注意〜  
- 拡張機能画面に表示されるワンタイムパスワードは「保存」ボタンを押される度に更新されます．パスワードが弾かれた場合は時間経過でパスワードが変わっている可能性があるので，「保存」ボタンを押して再度お試しください．
- 通常のパスワードと二段階認証のパスワードを両方登録することは極力避けるようにしてください．通常，拡張機能に登録されたデータは本来のサイト(農工大認証サイト)でしか確認できませんが，外部からの攻撃にあった場合に保存されているデータが読み取られる可能性があります．そのため，通常のパスワードは手入力するかchromeの自動入力機能を利用し，ワンタイムパスワードのみ本拡張機能で入力することをお勧めします．

### ④ 利用する
chrome画面の拡張機能アイコン(パズルマーク)→TUAT Autofill Extension横の3点ボタン→サイトデータの読み込みと変更を行います→tuat.ex-tic.com　となっている場合，認証時にデータは自動で入力されます．
ただし，パスワードを自動入力している場合には「次へ」ボタンは押されないようになっています．そのため，「次へ」ボタンは手で押下してください．

## その他/免責事項
本拡張機能は個人によって製作されたものであり，東京農工大学の公式の機能ではありません．
本拡張機能の利用によって，利用者及び第三者に生じた損害においては，責任を負わないものとします．

拡張機能のアップデート及びバグ修正は積極的に行なって行くので，何かあれば連絡をお願いします．
