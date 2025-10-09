# 🔐 Keycloak TypeScript WebApp

A **minimal TypeScript single-page application (SPA)** demonstrating **Keycloak authentication (OIDC + PKCE)** with no framework required — built entirely using **esbuild**.

This repo is ideal for learning or bootstrapping simple Keycloak-enabled front-ends.

---

## ✨ Features

- 🔑 Secure login/logout with Keycloak (OIDC + PKCE)
- ⚙️ Works with existing Keycloak SSO sessions
- 🧩 Written in plain TypeScript — no React/Vite
- ⚡ Bundled and served using [esbuild](https://esbuild.github.io/)
- 🧠 Minimal config — under 30 lines of TypeScript

---

## 🐳 Running Keycloak Locally with Docker

This section explains how to set up a local Keycloak instance for testing the application.

### 1. Start Keycloak with Docker

```bash
# Run Keycloak on port 8080
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

**Access Keycloak Admin Console:**
- URL: http://localhost:8080/admin
- Username: `admin`
- Password: `admin`

### 2. Create a Realm

1. Open the Keycloak Admin Console
2. Click **"Create Realm"** (top-left dropdown)
3. Enter realm name: `JBM`
4. Click **"Create"**

### 3. Create a Client

1. In your new realm, go to **"Clients"** in the left sidebar
2. Click **"Create"**
3. Fill in the client details:
   - **Client ID**: `test-web-app`
   - **Client Protocol**: `openid-connect`
   - Click **"Save"**

4. Configure the client settings:
   - **Access Type**: `public`
   - **Standard Flow Enabled**: `ON`
   - **Direct Access Grants Enabled**: `ON`
   - **Valid Redirect URIs**: 
     - `http://localhost:3000/*`
     - `http://localhost:3000`
   - **Web Origins**: 
     - `http://localhost:3000`
     - `+` (to allow all origins for development)
   - Click **"Save"**

### 4. Create a Test User

1. Go to **"Users"** in the left sidebar
2. Click **"Create new user"**
3. Fill in user details:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **First Name**: `Test`
   - **Last Name**: `User`
   - **Email Verified**: `ON`
   - Click **"Create"**

4. Set the user password:
   - Go to the **"Credentials"** tab
   - Click **"Set password"**
   - Enter password: `password123`
   - **Temporary**: `OFF` (so user doesn't need to change password)
   - Click **"Save"**

### 5. Application Configuration

The application is pre-configured to work with the above setup:

```typescript
const kc = new Keycloak({
  url: "http://localhost:8080",           // Keycloak server URL
  realm: "JBM",                          // Realm name
  clientId: "test-web-app",              // Client ID
});
```

### 6. Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

**Access the application:**
- URL: http://localhost:3000
- The app will automatically redirect to Keycloak for authentication
- Use the test user credentials: `testuser` / `password123`

### 7. Key URLs Summary

| Service | URL | Purpose |
|---------|-----|---------|
| Keycloak Admin | http://localhost:8080/admin | Admin console |
| Keycloak Auth | http://localhost:8080/realms/JBM | Authentication endpoint |
| Application | http://localhost:3000 | Your TypeScript webapp |

### 8. Troubleshooting

**Common Issues:**

1. **CORS errors**: Ensure `Web Origins` includes `http://localhost:3000`
2. **Redirect URI mismatch**: Verify redirect URIs in client settings
3. **Realm not found**: Check realm name matches exactly: `JBM`
4. **Client not found**: Verify client ID is exactly: `test-web-app`

**Reset Keycloak:**
```bash
# Stop and remove the container
docker stop $(docker ps -q --filter ancestor=quay.io/keycloak/keycloak:latest)
docker rm $(docker ps -aq --filter ancestor=quay.io/keycloak/keycloak:latest)

# Start fresh
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

---