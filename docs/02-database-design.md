# E-コマース データベース設計

## 概要

Supabase(PostgreSQL)を使用したE-コマースアプリのデータベース

---

## テーブル一覧

### users(ユーザー情報)

ユーザーの基本情報を管理

| カラム名   | 型           | 制約            | 説明                        |
| ---------- | ------------ | --------------- | --------------------------- |
| user_id    | uuid         | PK              | ユーザーID（Supabase Auth） |
| email      | varchar(255) | UNIQUE NOT NULL | メールアドレス              |
| username   | varchar(100) | NOT NULL        | ユーザー名                  |
| full_name  | varchar(255) |                 | フルネーム                  |
| address    | text         |                 | 住所                        |
| phone      | varchar(20)  |                 | 電話番号                    |
| created_at | timestamp    | DEFAULT now()   | 作成日時                    |
| updated_at | timestamp    |                 | 更新日時                    |

**インデックス:**

- `email` (UNIQUE)

---

### 2️⃣ products（商品情報）

商品の基本情報を管理

| カラム名    | 型            | 制約          | 説明     |
| ----------- | ------------- | ------------- | -------- |
| product_id  | uuid          | PK            | 商品ID   |
| name        | varchar(255)  | NOT NULL      | 商品名   |
| description | text          |               | 商品説明 |
| price       | decimal(10,2) | NOT NULL      | 価格     |
| stock       | integer       | DEFAULT 0     | 在庫数   |
| category    | varchar(100)  |               | カテゴリ |
| created_at  | timestamp     | DEFAULT now() | 作成日時 |
| updated_at  | timestamp     |               | 更新日時 |

**インデックス:**

- `category`
- `name`

---

### product_images (商品画像)

商品画像を管理(複数画像対応)

| カラム名      | 型           | 制約          | 説明         |
| ------------- | ------------ | ------------- | ------------ |
| image_id      | uuid         | PK            | 画像ID       |
| product_id    | uuid         | FK→products   | 商品ID       |
| image_url     | varchar(500) | NOT NULL      | 画像URL      |
| alt_text      | varchar(255) |               | 代替テキスト |
| display_order | integer      |               | 表示順序     |
| created_at    | timestamp    | DEFAULT now() | 作成日時     |

**リレーション:**

- `product_id` → `products.product_id` (ON DELETE CASCADE)

### product_reviews (商品レビュー)

商品のレビューを管理

| カラム名   | 型        | 制約          | 説明        |
| ---------- | --------- | ------------- | ----------- |
| review_id  | uuid      | PK            | レビューID  |
| product_id | uuid      | FK→products   | 商品ID      |
| user_id    | uuid      | FK→users      | ユーザーID  |
| rating     | integer   | CHECK (1-5)   | 評価（1-5） |
| comment    | text      |               | コメント    |
| created_at | timestamp | DEFAULT now() | 作成日時    |
| updated_at | timestamp |               | 更新日時    |

**リレーション:**

- `product_id` → `products.product_id` (ON DELETE CASCADE)
- `user_id` → `users.user_id` (ON DELETE CASCADE)

---

### carts(ショッピングカート)

| カラム名   | 型        | 制約          | 説明       |
| ---------- | --------- | ------------- | ---------- |
| cart_id    | uuid      | PK            | カートID   |
| user_id    | uuid      | FK→users      | ユーザーID |
| created_at | timestamp | DEFAULT now() | 作成日時   |
| updated_at | timestamp |               | 更新日時   |

**リレーション:**

- `user_id` → `users.user_id` (ON DELETE CASCADE)

---

### cart_items(カートアイテム)

カート内のアイテム

| カラム名     | 型        | 制約          | 説明             |
| ------------ | --------- | ------------- | ---------------- |
| cart_item_id | uuid      | PK            | カートアイテムID |
| cart_id      | uuid      | FK→carts      | カートID         |
| product_id   | uuid      | FK→products   | 商品ID           |
| quantity     | integer   | NOT NULL      | 数量             |
| created_at   | timestamp | DEFAULT now() | 作成日時         |

**リレーション:**

- `cart_id` → `carts.cart_id` (ON DELETE CASCADE)
- `product_id` → `products.product_id` (ON DELETE CASCADE)

---

### orders(注文情報)

注文の基本情報

| カラム名         | 型            | 制約              | 説明                                      |
| ---------------- | ------------- | ----------------- | ----------------------------------------- |
| order_id         | uuid          | PK                | 注文ID                                    |
| user_id          | uuid          | FK→users          | ユーザーID                                |
| total_amount     | decimal(10,2) | NOT NULL          | 合計金額                                  |
| status           | varchar(50)   | DEFAULT 'pending' | ステータス（pending/completed/cancelled） |
| shipping_address | text          | NOT NULL          | 配送先住所                                |
| created_at       | timestamp     | DEFAULT now()     | 作成日時                                  |
| updated_at       | timestamp     |                   | 更新日時                                  |

**リレーション:**

- `user_id` → `users.user_id` (ON DELETE CASCADE)

**インデックス:**

- `status`
- `created_at`

---

### order_items(注文アイテム)

注文に含まれるアイテム

| カラム名      | 型            | 制約          | 説明           |
| ------------- | ------------- | ------------- | -------------- |
| order_item_id | uuid          | PK            | 注文アイテムID |
| order_id      | uuid          | FK→orders     | 注文ID         |
| product_id    | uuid          | FK→products   | 商品ID         |
| quantity      | integer       | NOT NULL      | 数量           |
| unit_price    | decimal(10,2) | NOT NULL      | 単価           |
| created_at    | timestamp     | DEFAULT now() | 作成日時       |

**リレーション:**

- `order_id` → `orders.order_id` (ON DELETE CASCADE)
- `product_id` → `products.product_id`

---

### payments(決済情報)

Stripeでの決済情報を管理

| カラム名                 | 型            | 制約              | 説明                                   |
| ------------------------ | ------------- | ----------------- | -------------------------------------- |
| payment_id               | uuid          | PK                | 決済ID                                 |
| order_id                 | uuid          | FK→orders         | 注文ID                                 |
| stripe_payment_intent_id | varchar(255)  | UNIQUE            | Stripe Payment Intent ID               |
| amount                   | decimal(10,2) | NOT NULL          | 決済金額                               |
| currency                 | varchar(3)    | DEFAULT 'JPY'     | 通貨                                   |
| status                   | varchar(50)   | DEFAULT 'pending' | ステータス（pending/succeeded/failed） |
| created_at               | timestamp     | DEFAULT now()     | 作成日時                               |
| updated_at               | timestamp     |                   | 更新日時                               |

**リレーション:**

- `order_id` → `orders.order_id` (ON DELETE CASCADE)

## ER図(エンティティ・リレーションシップ図)

```
users
  ├── carts (1対多)
  ├── orders (1対多)
  └── product_reviews (1対多)

products
  ├── product_images (1対多)
  ├── product_reviews (1対多)
  ├── cart_items (1対多)
  └── order_items (1対多)

carts
  └── cart_items (1対多)


orders
  ├── order_items (1対多)
  └── payments (1対1)
```

---

## セキュリティ・RLS(Row Level Security)

SupabaseのRLSを設定する際の考慮事項

```
user:
    - 自分のデータのみ読み取り・更新可能
    - 他のユーザーのデータは読みとり不可

products:
    - 誰でも読み取り可能
    - 管理者のみ作成・更新・削除可能

carts, cart_items:
    - ユーザーは自分のカートのみ操作可能

orders, order_items:
    - ユーザーは自分の注文のみ参照可能
    - 管理者は全注文を参照可能
```

---

### 初期化SQL

```sql
-- users(ユーザー情報) テーブル
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  full_name VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- products(商品情報) テーブル
CREATE TABLE products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- products_images(商品画像) テーブル
CREATE TABLE product_images (
    image_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(product_id),
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
);

-- product_reviews(商品レビュー) テーブル
CREATE TABLE product_reviews (
    review_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(product_id),
    user_id uuid REFERENCES users(user_id),
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- carts(ショッピングカート)テーブル
CREATE TABLE carts (
    cart_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- cart_items(カートアイテム)テーブル
CREATE TABLE cart_items (
    cart_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id uuid REFERENCES carts(cart_id),
    product_id uuid REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
);

-- orders(注文情報)テーブル
CREATE TABLE orders (
    order_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(user_id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- order_items(注文アイテム)テーブル
CREATE TABLE order_items (
    order_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(order_id),
    product_id uuid REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
);

-- payments(決済情報)テーブル
CREATE TABLE payments (
    payment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(order_id),
    stripe_payment_intent_id VARCHAR(255) UNIQUE KEY,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'JPY',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

## 設計上の注意点

1️⃣ **画像管理**

- `product_images` テーブルで複数画像を管理
- `display_order` で表示順序を制御（カルーセル用）

2️⃣ **在庫管理**

- `products.stock` で在庫数を管理
- 注文時に在庫チェック・減少処理を実装

3️⃣ **決済管理**

- `payments` テーブルで Stripe のデータを保持
- `stripe_payment_intent_id` で照合可能

4️⃣ **パフォーマンス**

- 検索用に `name`、`category` にインデックス
- 注文ステータス検索用に `status` にインデックス
