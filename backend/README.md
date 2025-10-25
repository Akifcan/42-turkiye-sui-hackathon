# 🚀 Enoki Sponsored Transactions Backend

Backend API servisi for Enoki sponsored transactions.

## 📋 Setup

### 1. Install Dependencies

```bash
cd backend
yarn install
```

### 2. Environment Variables

Create a `.env` file:

```bash
# Enoki Private API Key (from https://portal.enoki.mystenlabs.com/)
ENOKI_PRIVATE_API_KEY=enoki_private_your_private_key_here

# Server Port
PORT=3001
```

### 3. Get Enoki Private API Key

1. Go to https://portal.enoki.mystenlabs.com/
2. Login with your account
3. Go to **API Keys** section
4. Create a new **Private API Key** (not public!)
5. Copy the key and add it to `.env`

### 4. Start Server

```bash
yarn start
```

or for development with auto-reload:

```bash
yarn dev
```

## 🔌 API Endpoints

### POST `/api/sponsor-transaction`

Request sponsorship for a transaction.

**Request Body:**
```json
{
  "transactionBlockKindBytes": "base64_encoded_bytes",
  "sender": "0x...",
  "zkLoginJwt": "jwt_token"
}
```

**Response:**
```json
{
  "success": true,
  "digest": "transaction_digest",
  "bytes": "bytes_to_sign",
  "message": "Transaction sponsored. Please sign the transaction bytes on the frontend."
}
```

### POST `/api/execute-sponsored-transaction`

Execute a sponsored transaction after user signature.

**Request Body:**
```json
{
  "digest": "transaction_digest",
  "signature": "user_signature",
  "zkLoginJwt": "jwt_token"
}
```

**Response:**
```json
{
  "success": true,
  "digest": "final_transaction_digest"
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "enokiConfigured": true,
  "timestamp": "2025-10-25T..."
}
```

## 🔒 Security

- **NEVER** expose your private API key in frontend code
- Use CORS configuration for production
- Implement rate limiting for production use
- Add authentication/authorization if needed

## 📚 Documentation

- [Enoki Sponsored Transactions](https://docs.enoki.mystenlabs.com/ts-sdk/sponsored-transactions)
- [Enoki Portal](https://portal.enoki.mystenlabs.com/)

