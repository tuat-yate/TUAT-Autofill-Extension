# TUAT-Autofill-Extension
東京農工大学の二段階認証を自動入力するchrome拡張機能です．
本拡張機能はChrome Web Storeで公開予定です．

## Overview
https://github.com/tuat-yate/TUAT-Autofill-Extension/assets/56665094/da4b2a94-ded6-4f18-8dff-6657a7219443

## Usage

### ① 事前準備
本拡張機能は東京農工大学統合認証システムで各個人に発行されるシークレットキーが必要です．
シークレットキーは二段階アプリ認証の登録画面で確認することができます．
<img src="[https://github.com/tuat-yate/TUAT-Autofill-Extension/assets/56665094/53fa75c7-2acf-4bcb-b2d8-b85d78f70840](https://github.com/tuat-yate/TUAT-Autofill-Extension/assets/56665094/74215800-13d0-4743-91ca-6a1ecd4f582b)" width="320px">

〜注意〜  
・既にアプリにキーを登録している場合は一旦キー削除した後に再登録する必要があります．その場合元のキーでは認証ができなくなるため，必ずアプリの方でもキーの再登録を行なってください．  
・アプリと拡張機能を併用したい場合は，拡張機能で利用するキーとアプリで利用するキーを揃えてください．具体的には，新規登録時にシークレットキーを控え，認証アプリではQRコードを読み込んでください．

### ② 拡張機能をインストールする
本リポジトリもしくはChrome Web Storeから拡張機能をインストールしてください．

### ③ 各種設定を入力する．
chrome画面の拡張機能アイコン(パズルマーク)→TUAT Autofill Extension横の3点ボタン→オプション　をクリックしてください．
<img src="https://github.com/tuat-yate/TUAT-Autofill-Extension/assets/56665094/53fa75c7-2acf-4bcb-b2d8-b85d78f70840" width="320px">

その後，設定画面で各種情報を入力してください．

〜注意〜  
・設定画面では「保存」ボタンを押しても特にアクションは起こりません．保存されているか確認したい場合は，一旦設定画面を閉じ，再度開いた時に元の情報が入力されていれば大丈夫です．  
・通常のパスワードと二段階認証のパスワードを両方登録することは極力避けるようにしてください．通常，拡張機能に登録されたデータは本来のサイトでしか確認できませんが，外部からの攻撃にあった場合に保存されているデータが読み取られる可能性があります．そのため，通常のパスワードは手入力するかchromeの自動入力機能を利用し，ワンタイムパスワードのみ本拡張機能で入力することをお勧めします．

### ④ 利用する
chrome画面の拡張機能アイコン(パズルマーク)→TUAT Autofill Extension横の3点ボタン→サイトデータの読み込みと変更を行います→tuat.ex-tic.com　となっている場合，認証時にデータは自動で入力されます．
ただし，パスワードを自動入力している場合には「次へ」ボタンは押されないようになっています．そのため，「次へ」ボタンは手で押下してください．

## その他/免責事項
本拡張機能は個人によって製作されたものであり，東京農工大学の公式の機能ではありません．
本拡張機能の利用によって，利用者及び第三者に生じた損害においては，責任を負わないものとします．

拡張機能のアップデート及びバグ修正は積極的に行なって行くので，何かあれば連絡をお願いします．
