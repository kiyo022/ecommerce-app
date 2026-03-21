# E-コマース API 仕様書

## 📌 概要

Supabase REST API と PostgreSQL を使用した E-コマース API 仕様書

**ベース URL:** `https://your-project.supabase.co/rest/v1`

**認証:** Supabase Auth + JWT Token

---

## 🔑 認証関連 API

### 1. ユーザー登録

**エンドポイント:**

```
POST /auth/v1/signup
```

**リクエスト:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "user_metadata": {
    "username": "john_doe",
    "full_name": "John Doe"
  }
}
```

**レスポンス (201 Created):**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "user_metadata": {
    "username": "john_doe",
    "full_name": "John Doe"
  },
  "created_at": "2024-03-21T10:00:00Z"
}
```

**エラーレスポンス (400):**

```json
{
  "error": "User already exists",
  "status": 400
}
```

---

### 2. ログイン

**エンドポイント:**

```
POST /auth/v1/token?grant_type=password
```

**リクエスト:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**レスポンス (200 OK):**

```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 3600,
  "token_type": "bearer"
}
```

---

### 3. ログアウト

**エンドポイント:**

```
POST /auth/v1/logout
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**レスポンス (204 No Content)**

---

## 👤 ユーザー関連 API

### 1. ユーザー情報取得

**エンドポイント:**

```
GET /users/{user_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**レスポンス (200 OK):**

```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "full_name": "John Doe",
  "address": "123 Main St",
  "phone": "09012345678",
  "created_at": "2024-03-21T10:00:00Z",
  "updated_at": "2024-03-21T10:00:00Z"
}
```

---

### 2. ユーザー情報更新

**エンドポイント:**

```
PUT /users/{user_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "username": "john_doe_updated",
  "full_name": "John Doe Updated",
  "address": "456 Oak Ave",
  "phone": "09087654321"
}
```

**レスポンス (200 OK):**

```json
{
  "user_id": "uuid",
  "username": "john_doe_updated",
  "full_name": "John Doe Updated",
  "address": "456 Oak Ave",
  "phone": "09087654321",
  "updated_at": "2024-03-21T11:00:00Z"
}
```

---

## 📦 商品関連 API

### 1. 商品一覧取得

**エンドポイント:**

```
GET /products
```

**クエリパラメータ:**

```
?page=1&limit=20&category=electronics&sort=name&order=asc
```

**レスポンス (200 OK):**

```json
{
  "data": [
    {
      "product_id": "uuid",
      "name": "Product Name",
      "description": "Product Description",
      "price": 10000,
      "stock": 50,
      "category": "electronics",
      "created_at": "2024-03-21T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

---

### 2. 商品詳細取得

**エンドポイント:**

```
GET /products/{product_id}
```

**レスポンス (200 OK):**

```json
{
  "product_id": "uuid",
  "name": "Product Name",
  "description": "Product Description",
  "price": 10000,
  "stock": 50,
  "category": "electronics",
  "images": [
    {
      "image_id": "uuid",
      "image_url": "https://...",
      "alt_text": "Product Image",
      "display_order": 1
    }
  ],
  "reviews": [
    {
      "review_id": "uuid",
      "user_id": "uuid",
      "rating": 5,
      "comment": "Great product!",
      "created_at": "2024-03-21T10:00:00Z"
    }
  ],
  "created_at": "2024-03-21T10:00:00Z"
}
```

---

### 3. 商品検索

**エンドポイント:**

```
GET /products/search
```

**クエリパラメータ:**

```
?q=search_term&category=electronics
```

**レスポンス (200 OK):**

```json
{
  "data": [
    {
      "product_id": "uuid",
      "name": "Product Name",
      "price": 10000,
      "category": "electronics"
    }
  ],
  "total": 25
}
```

---

### 4. 商品作成（管理者）

**エンドポイント:**

```
POST /products
```

**ヘッダー:**

```
Authorization: Bearer {admin_access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "name": "New Product",
  "description": "Product Description",
  "price": 10000,
  "stock": 100,
  "category": "electronics"
}
```

**レスポンス (201 Created):**

```json
{
  "product_id": "uuid",
  "name": "New Product",
  "description": "Product Description",
  "price": 10000,
  "stock": 100,
  "category": "electronics",
  "created_at": "2024-03-21T10:00:00Z"
}
```

---

### 5. 商品更新（管理者）

**エンドポイント:**

```
PUT /products/{product_id}
```

**ヘッダー:**

```
Authorization: Bearer {admin_access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "name": "Updated Product",
  "price": 12000,
  "stock": 80
}
```

**レスポンス (200 OK)**

---

### 6. 商品削除（管理者）

**エンドポイント:**

```
DELETE /products/{product_id}
```

**ヘッダー:**

```
Authorization: Bearer {admin_access_token}
```

**レスポンス (204 No Content)**

---

## 🛒 カート関連 API

### 1. カート取得

**エンドポイント:**

```
GET /carts/{user_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**レスポンス (200 OK):**

```json
{
  "cart_id": "uuid",
  "user_id": "uuid",
  "items": [
    {
      "cart_item_id": "uuid",
      "product_id": "uuid",
      "product_name": "Product Name",
      "price": 10000,
      "quantity": 2,
      "subtotal": 20000
    }
  ],
  "total": 20000,
  "created_at": "2024-03-21T10:00:00Z"
}
```

---

### 2. カートにアイテム追加

**エンドポイント:**

```
POST /carts/{user_id}/items
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "product_id": "uuid",
  "quantity": 2
}
```

**レスポンス (201 Created):**

```json
{
  "cart_item_id": "uuid",
  "product_id": "uuid",
  "quantity": 2,
  "added_at": "2024-03-21T10:00:00Z"
}
```

---

### 3. カートのアイテム数量変更

**エンドポイント:**

```
PUT /carts/{user_id}/items/{cart_item_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "quantity": 5
}
```

**レスポンス (200 OK)**

---

### 4. カートからアイテム削除

**エンドポイント:**

```
DELETE /carts/{user_id}/items/{cart_item_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**レスポンス (204 No Content)**

---

### 5. カートをクリア

**エンドポイント:**

```
DELETE /carts/{user_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**レスポンス (204 No Content)**

---

## 📋 注文関連 API

### 1. 注文一覧取得

**エンドポイント:**

```
GET /orders
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**クエリパラメータ:**

```
?user_id=uuid&status=pending&page=1&limit=10
```

**レスポンス (200 OK):**

```json
{
  "data": [
    {
      "order_id": "uuid",
      "user_id": "uuid",
      "total_amount": 20000,
      "status": "pending",
      "shipping_address": "123 Main St",
      "items": [
        {
          "order_item_id": "uuid",
          "product_id": "uuid",
          "product_name": "Product Name",
          "quantity": 2,
          "unit_price": 10000,
          "subtotal": 20000
        }
      ],
      "created_at": "2024-03-21T10:00:00Z"
    }
  ],
  "total": 50
}
```

---

### 2. 注文詳細取得

**エンドポイント:**

```
GET /orders/{order_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**レスポンス (200 OK):**

```json
{
  "order_id": "uuid",
  "user_id": "uuid",
  "total_amount": 20000,
  "status": "completed",
  "shipping_address": "123 Main St",
  "items": [...],
  "payment": {
    "payment_id": "uuid",
    "status": "succeeded",
    "amount": 20000
  },
  "created_at": "2024-03-21T10:00:00Z"
}
```

---

### 3. 注文作成

**エンドポイント:**

```
POST /orders
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "user_id": "uuid",
  "shipping_address": "123 Main St",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 10000
    }
  ]
}
```

**レスポンス (201 Created):**

```json
{
  "order_id": "uuid",
  "user_id": "uuid",
  "total_amount": 20000,
  "status": "pending",
  "shipping_address": "123 Main St",
  "created_at": "2024-03-21T10:00:00Z"
}
```

---

### 4. 注文ステータス更新（管理者）

**エンドポイント:**

```
PUT /orders/{order_id}/status
```

**ヘッダー:**

```
Authorization: Bearer {admin_access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "status": "completed"
}
```

**レスポンス (200 OK)**

---

## 💳 決済関連 API

### 1. 決済インテント作成

**エンドポイント:**

```
POST /payments/create-intent
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "order_id": "uuid",
  "amount": 20000,
  "currency": "jpy"
}
```

**レスポンス (200 OK):**

```json
{
  "client_secret": "pi_1234567890_secret_abcdef",
  "payment_intent_id": "pi_1234567890"
}
```

---

### 2. 決済確認

**エンドポイント:**

```
POST /payments/confirm
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "payment_intent_id": "pi_1234567890"
}
```

**レスポンス (200 OK):**

```json
{
  "payment_id": "uuid",
  "order_id": "uuid",
  "status": "succeeded",
  "amount": 20000,
  "created_at": "2024-03-21T10:00:00Z"
}
```

---

### 3. 決済情報取得

**エンドポイント:**

```
GET /payments/{payment_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**レスポンス (200 OK):**

```json
{
  "payment_id": "uuid",
  "order_id": "uuid",
  "stripe_payment_intent_id": "pi_1234567890",
  "amount": 20000,
  "currency": "jpy",
  "status": "succeeded",
  "created_at": "2024-03-21T10:00:00Z"
}
```

---

## ⭐ レビュー関連 API

### 1. レビュー一覧取得

**エンドポイント:**

```
GET /products/{product_id}/reviews
```

**クエリパラメータ:**

```
?page=1&limit=10&sort=created_at&order=desc
```

**レスポンス (200 OK):**

```json
{
  "data": [
    {
      "review_id": "uuid",
      "product_id": "uuid",
      "user_id": "uuid",
      "username": "john_doe",
      "rating": 5,
      "comment": "Great product!",
      "created_at": "2024-03-21T10:00:00Z"
    }
  ],
  "total": 25,
  "average_rating": 4.5
}
```

---

### 2. レビュー作成

**エンドポイント:**

```
POST /products/{product_id}/reviews
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "rating": 5,
  "comment": "Excellent quality!"
}
```

**レスポンス (201 Created):**

```json
{
  "review_id": "uuid",
  "product_id": "uuid",
  "user_id": "uuid",
  "rating": 5,
  "comment": "Excellent quality!",
  "created_at": "2024-03-21T10:00:00Z"
}
```

---

### 3. レビュー更新

**エンドポイント:**

```
PUT /reviews/{review_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**リクエスト:**

```json
{
  "rating": 4,
  "comment": "Good, but could be better"
}
```

**レスポンス (200 OK)**

---

### 4. レビュー削除

**エンドポイント:**

```
DELETE /reviews/{review_id}
```

**ヘッダー:**

```
Authorization: Bearer {access_token}
```

**レスポンス (204 No Content)**

---

## 📝 エラーレスポンス

### 400 Bad Request

```json
{
  "error": "Invalid request parameters",
  "status": 400
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required",
  "status": 401
}
```

### 403 Forbidden

```json
{
  "error": "Access denied",
  "status": 403
}
```

### 404 Not Found

```json
{
  "error": "Resource not found",
  "status": 404
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "status": 500
}
```

---

## 🔐 セキュリティ

- すべてのエンドポイントは **HTTPS** で提供
- **JWT トークン** によるユーザー認証
- **RLS (Row Level Security)** でデータアクセスを制限
- 管理者操作には **特別な権限** が必要

---

## 📊 レート制限

```
通常ユーザー: 100 リクエスト/分
管理者: 500 リクエスト/分
```

---

## 🔄 バージョニング

現在のバージョン: **v1**

将来のバージョンは `/rest/v2` など でサポート予定
