![Screenshot from 2025-01-14 16-00-25](https://github.com/user-attachments/assets/b00b16b2-17ca-49ed-b90c-863ae34c8d20)
## サービスのURL
Vercelでデプロイしたのでぜひ使ってくみてださい！  
https://eat-finder-app.vercel.app/

## 概要
このアプリは、外食先を選ぶ際に「どこに行こうか」と悩むユーザーをサポートするために開発されました。  
ホットペッパーグルメAPIを利用して近隣の飲食店情報を取得し、ルーレット形式でランダムに1店舗を提案する機能を備えています。  
さらに、お気に入りの飲食店だけでルーレットをしてランダムで飲食店をきめる機能もあります。  
また、スマートフォンでも快適に利用できるよう、操作性やデザインにも配慮しています。

# 使用技術
本アプリケーションでは、以下の技術を使用しています。
## フロントエンド (Frontend)
- **フレームワーク:** [Next.js](https://nextjs.org/)
- **アイコン:** [React Icons](https://react-icons.github.io/react-icons/) 
- **地図:** [Leaflet](https://leafletjs.com/)
- **その他ライブラリ:** [React Router](https://reactrouter.com/)

## バックエンド (Backend)
- **BaaS:** [Firebase](https://firebase.google.com/) - 認証、データベースを含むバックエンドサービス
  - **認証:** Firebase Authentication - Googleサインイン機能
  - **データベース:** Firestore - ユーザーデータとお気に入りした飲食店や閲覧した飲食店のデータの管理

## その他 (Others)
- **バージョン管理:** [Git](https://git-scm.com/) / [GitHub](https://github.com/) 
- **地図データAPI:** [Leaflet](https://leafletjs.com/)
- **ホットペッパーグルメAPI:** [ホットペッパーグルメAPI](https://webservice.recruit.co.jp/doc/hotpepper/reference.html)
- **デプロイツール:** [Vercel](https://vercel.com/) 

## 開発環境
|  | バージョン |
|--|--|
| node | 20.13.1 |
| npm | 10.7.0 |
| next | 14.2.15 |
| firebase | 11.0.1|

## 機能一覧
| トップ画面 | ログイン画面 |
|------------|----------------|
| <img src="https://github.com/user-attachments/assets/b36ef7a9-23f7-4c91-8b33-bb15159e772e" width="500"> |<img src="https://github.com/user-attachments/assets/aaacf85d-ee48-43ca-bc87-ad743dca634c" width="500"> |
| トップ画面は人目でもわかるように真ん中にユーザーの位置から近くの飲食店の情報を提示してます。 | メールアドレスとパスワードとGoogleでの認証機能を実装しました。 |

| オプション画面 | ルーレット画面 |
|------------|----------------|
| <img src="https://github.com/user-attachments/assets/26066075-1be1-4f75-996e-d85459509aaa" width=500> | <img src="https://github.com/user-attachments/assets/b7629931-9e34-4f1b-b858-e0e07c7c1982" width=500> |
|現在地、都道府県ではカテゴリや範囲(km,m)、件数を選択機能を実装しました。<br>お気に入りではルーレットをしたい飲食店を選択してグループを作成します。| スライド機能に加えてルーレットを交えた機能を実装しました。<br>また、Firebaseを使用してお気に入り機能を実装しました。 |

| お気に入り画面 | マイページ画面 |
|------------|----------------|
|<img src="https://github.com/user-attachments/assets/06a77df3-4b0d-49ef-8197-39be5f23a433" width=500>|<img src="https://github.com/user-attachments/assets/2e3185ee-2c8b-464c-a5f1-ea8a0cd14250" width=500>|
|お気に入りした飲食店を表示してます。<br>また、飲食店をGoogleマップに遷移機能や飲食店の１週間の営業時間を見た目でわかる表を実装しました。| マイページは管理者にお問い合わせするフォームがあり困っていることを送信できます。<br>また、ユーザー名を変更することもできます。 |
