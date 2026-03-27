# 🛍️ ShopHub - E-Commerce App

小規模なE-コマースアプリケーション。React＋TypeScript＋Supabaseで実装した、ユーザーと管理者の両方のロールを持つショッピングプラットフォーム

## デモ
**環境:** https://ecommerce-app-vert-eight.vercel.app/
※あくまでデモ環境のため金銭のやり取りは発生しません

## 🧪 テストアカウント

### 一般ユーザー
e-mail: abcde01@example.com
password: 0000000

### 管理者ユーザー
example@test.com
1234567

もしアカウントを作成する場合、フロント側では使用できるキャリアでないと追加できないため
個人情報がわかってしまうものは控えてください。

## ✨ 主な機能

### 👥 ユーザー向け機能

- 🔐 **ユーザー認証**
  - 新規登録・ログイン・ログアウト
  - メールアドレスとパスワード管理

- 🛍️ **商品閲覧**
  - 商品一覧表示
  - 商品詳細ページ
  - 商品検索機能

- 🛒 **ショッピングカート**
  - 商品の追加・削除
  - 数量変更
  - リアルタイム価格計算

- 💳 **チェックアウト（3ステップ）**
  - ステップ1: 配送先情報入力
  - ステップ2: 支払い方法選択
  - ステップ3: 注文確認

- 📦 **注文機能**
  - 注文確定
  - 注文完了ページ
  - 注文履歴（Supabase に保存）

### 👨‍💼 管理者向け機能

 📊 **ダッシュボード**
  - 総注文数の表示
  - 売上合計の表示
  - 顧客数の表示
  - 最新注文一覧
  
- 📦 **商品管理**
  - 商品一覧表示
  - 新規商品追加
  - 商品編集
  - 商品削除
  - 在庫管理
  
- 📋 **注文管理**
  - 注文詳細表示
  - ステータス変更（確認待ち → 発送済み → 完了）
  - 顧客情報表示
  - 配送先情報表示

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UI ライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **React Router** - ルーティング
- **Zustand** - 状態管理（カート）
- **Context API** - 状態管理（認証）

### バックエンド・データベース
- **Supabase** - PostgreSQL + 認証
- **PostgreSQL** - リレーショナルデータベース
- **Row Level Security (RLS)** - セキュリティ

### デプロイ
- **Vercel** - ホスティング・自動デプロイ
- **GitHub** - バージョン管理

## 📁 プロジェクト構成
```
ecommerce-app/ 
├─ docs/ # プロジェクトドキュメント 
│   ├── 01-requirements.md # 要件定義 
│   ├── 02-database-design.md # データベース設計 
│   ├── 03-api-sepecification.md # API仕様書 
│   ├── 04-screen-design.md # 画面デザイン 
│   └── 05-user-flows.md # ユーザーフロー（拡張用）
├─ src/ 
│  ├── components/ # 再利用可能なReactコンポーネント 
│ 	├── Navbar.tsx # ナビゲーションバー 
│  │       ├── ProductCard.tsx # 商品カードコンポーネント 
│  │       ├── ProductGrid.tsx # 商品グリッド（スケルトン） 
│  │       └── ProtectedRoute.tsx # 認証保護ルート 
│  ├── context/ # React Context API 
│ 	│       └── AuthContext.tsx # 認証コンテキスト 
│  ├── hooks/ # カスタムReactフック 
│  │       ├── useAuth.ts # 認証カスタムフック 
│  │       └── useProducts.ts # 商品取得カスタムフック 
│  ├── lib/ # ユーティリティライブラリ 
│  │       ├── auth.ts # 認証関連のロジック 
│  │       └── supabase.ts # Supabaseクライアント設定 
│  ├── pages/ # ページコンポーネント 
│  │       ├── AdminDashboard.tsx # 管理者ダッシュボード 
│  │       ├── AdminOrderDetail.tsx # 注文詳細管理画面 
│  │       ├── AdminProducts.tsx # 商品管理画面 
│  │       ├── CartPage.tsx # ショッピングカートページ 
│  │       ├── CheckoutPage.tsx # チェックアウトページ 
│  │       ├── HomePage.tsx # ホームページ 
│  │       ├── LoginPage.tsx # ログインページ 
│  │       ├── OrderCompletePage.tsx # 注文完了ページ 
│  │       ├── ProductDetail.tsx # 商品詳細ページ
│  │       └── SignupPage.tsx # サインアップページ 
│  ├── store/ # グローバル状態管理 
│  │       └── cartStore.ts # ショッピングカート状態管理 
│  ├── utils/ # ユーティリティ関数 
│  │       └── validation.ts # バリデーション関数 
│  ├── App.tsx # メインアプリケーションコンポーネント 
│  ├── App.css # アプリケーション共通スタイル 
│  ├── index.css # グローバルスタイル（Tailwind等）
│  └── main.tsx # アプリケーションエントリーポイント
├── .env # 環境変数（ローカル開発用） 
├── .gitignore # Git除外ファイル設定 
├── eslint.config.js # ESLint設定（コード品質）
├── postcss.config.js # PostCSS設定 
├── tailwind.config.js # Tailwind CSS設定 
├── tsconfig.json # TypeScript設定（共通）
├── tsconfig.app.json # TypeScript設定（アプリケーション用）
├── tsconfig.node.json # TypeScript設定（Node.js環境用）
├── vite.config.ts # Vite バンドラー設定 
├── package.json # プロジェクト依存パッケージ 
├── package-lock.json # 依存パッケージ固定化ファイル 
├── README.md # プロジェクト説明書 
└── index.html # HTMLテンプレート
```

### ディレクトリ・ファイル詳細説明
#### **src/components/**
UI部品・再利用コンポーネント
- **Navbar.tsx**: ナビゲーションバー（ロゴ、メニュー、ユーザーメニュー）
- **ProductCard.tsx**: 商品一覧表示用のカードコンポーネント
- **ProductGrid.tsx**: 商品をグリッドレイアウトで表示（スケルトン）
- **ProtectedRoute.tsx**: 認証が必要なルートを保護するコンポーネント

#### **src/context/**
React Context APIによる状態管理
- **AuthContext.tsx**: ユーザー認証情報を管理するコンテキスト

#### **src/hooks/**
再利用可能なカスタムフック
- **useAuth.ts**: 認証情報とロジックを提供するフック
- **useProducts.ts**: 商品データ取得・管理ロジックを提供するフック

#### **src/lib/**
外部ライブラリとの統合、ユーティリティライブラリ
- **auth.ts**: Supabase認証の関数（ログイン、登録、ログアウト）
- **supabase.ts**: Supabaseクライアント初期化

#### **src/pages/**
各ページのコンポーネント（ルート対応）
- **HomePage.tsx**: ホームページ（商品一覧表示）
- **ProductDetail.tsx**: 商品詳細ページ
- **CartPage.tsx**: ショッピングカート表示・管理
- **CheckoutPage.tsx**: チェックアウト処理（配送先、決済情報入力）
- **OrderCompletePage.tsx**: 注文完了確認ページ
- **LoginPage.tsx**: ログインフォーム
- **SignupPage.tsx**: 新規ユーザー登録フォーム
- **AdminDashboard.tsx**: 管理者ダッシュボード（売上、注文数等）
- **AdminProducts.tsx**: 商品管理画面
- **AdminOrderDetail.tsx**: 注文詳細管理画面

#### **src/store/**
グローバル状態管理（Zustand等）
- **cartStore.ts**: ショッピングカート状態、アクション（追加、削除、更新）

#### **src/utils/**
汎用ユーティリティ関数
- **validation.ts**: フォーム検証（メール、パスワード、住所等）

#### **設定ファイル**
- **.env**: API_URL、Supabase API KEY等の環境変数
- **tailwind.config.js**: Tailwind CSS設定（カラー、スペーシング、拡張設定）
- **tsconfig.app.json**: アプリケーション用TypeScript設定
- **tsconfig.node.json**: Vite等ビルドツール用TypeScript設定
- **vite.config.ts**: Viteバンドラー設定（ホットリロード、ビルド設定）

#### **ドキュメント**
- **docs/01-requirements.md**: 機能要件とユーザーストーリー
- **docs/02-database-design.md**: データベーステーブル設計
- **docs/03-api-sepecification.md**: APIエンドポイント仕様
- **docs/04-screen-design.md**: UI/画面デザインモックアップ
- **docs/05-user-flows.md**: ユーザー操作フロー（拡張予定）

## 🚀 セットアップ・実行

### 必要な環境
- Node.js 16 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/kiyo022/ecommerce-app.git
cd ecommerce-app

# 依存関係をインストール
npm install
```

### 環境変数設定
```
VITE_SUPABASE_URL=https://your-project.supabase.co(各々の環境)
VITE_SUPABASE_ANON_KEY=your-anon-key(各々の環境)
```

###開発サーバー起動
```
npm run dev
```
ブラウザで http://localhost:5173 にアクセス

## データベース設計
[テーブル設計ドキュメント](https://github.com/kiyo022/ecommerce-app/blob/main/docs/02-database-design.md)

## 🔐 セキュリティ機能
✅ Supabase Auth による認証
✅ Row Level Security (RLS) によるデータ保護
✅ フォームバリデーション
郵便番号フォーマット（XXX-XXXX）
電話番号フォーマット
メールアドレス形式
パスワード長（6文字以上）
✅ エラーハンドリング - 安全なエラーメッセージ
✅ 管理者ロール分離 - 管理者のみが管理画面にアクセス可能

## 📱 レスポンシブデザイン
すべてのページが以下のデバイスに対応：

💻 デスクトップ（1280px以上）
📱 タブレット（768px～1279px）
📲 スマートフォン（767px以下）

### 1️⃣ マルチロール認証システム
ユーザーと管理者の 2 つのロールを実装：

ProtectedRoute コンポーネントで保護
requireAdmin プロップで管理者判定
Navbar で動的にボタン表示

### 2️⃣ 状態管理の組み合わせ
Zustand でカート状態を管理：
```const { items, addItem, removeItem } = useCartStore()```
Context API で認証状態を管理：
```const { user, loading } = useAuth()```

###3️⃣ リアルタイムバリデーション
フォーム入力時に即座にバリデーション実施：
```
const validateField = (field: keyof ShippingInfo, value: string) => {
  // バリデーションロジック
}
```

### 4️⃣ 3ステップチェックアウト
ユーザーフレンドリーなチェックアウト体験：

配送先情報入力
支払い方法選択
注文確認

#### 5️⃣ ダッシュボード統計
管理者向けの直感的な統計表示：

総注文数
売上合計
顧客数
最新注文一覧

### 🔄 デプロイメントフロー
```
GitHub Push
    ↓
Vercel 自動デプロイ
    ↓
Build & Test
    ↓
本番環境へ自動デプロイ
    ↓
URL で即座にアクセス可能
```

### 📈 パフォーマンス最適化
 ⚡ Vite による高速ビルド
 🎯 React 18 の自動最適化
 📦 Tailwind CSS の最小化
 🔄 Vercel による自動キャッシング
### 🤝 コントリビューション
 改善提案やバグ報告は Issue を作成してください。

### 📝 ライセンス
MIT License - 詳細は LICENSE ファイルを参照

### 👨‍💻 作成者
GitHub: [@kiyo022](https://github.com/kiyo022)
