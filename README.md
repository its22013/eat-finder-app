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
## フロントエンド
- **フレームワーク:** [Next.js](https://nextjs.org/)
- **アイコン:** [React Icons](https://react-icons.github.io/react-icons/) 
- **地図:** [Leaflet](https://leafletjs.com/)
- **その他ライブラリ:** [React Router](https://reactrouter.com/)

## バックエンド (Backend)
- **BaaS:** [Firebase](https://firebase.google.com/) - 認証、データベース、ホスティングを含むバックエンドサービス
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
| <img src="https://github.com/user-attachments/assets/b36ef7a9-23f7-4c91-8b33-bb15159e772e" width="400"> |<img src="https://github.com/user-attachments/assets/aaacf85d-ee48-43ca-bc87-ad743dca634c" width="400"> |
| トップ画面は人目でもわかるように真ん中にユーザーの</br>位置から近くの飲食店の情報を提示してます。 | メールアドレスとパスワーとGoogleでの認証機能を</br>実装しました。 |

| トップ画面 | ログイン画面 |
|------------|----------------|
| <img src="https://github.com/user-attachments/assets/26066075-1be1-4f75-996e-d85459509aaa" width=400> | <img src="https://github.com/user-attachments/assets/26066075-1be1-4f75-996e-d85459509aaa" width=400> |
|
