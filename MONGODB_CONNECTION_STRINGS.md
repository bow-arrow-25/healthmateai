# 🔗 MongoDB Connection String Options

## Your Current Connection String

```
mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority&appName=Cluster0
```

---

## Alternative Connection Strings to Try

### Option 1: Without appName (Recommended)
```
mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority
```

### Option 2: With authSource
```
mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority&authSource=admin
```

### Option 3: Minimal (Test Connection)
```
mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate
```

### Option 4: With All Options
```
mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority&authSource=admin&ssl=true
```

---

## How to Test Each Option

### In Render:

1. Go to Environment tab
2. Edit `MONGODB_URI`
3. Try each option above (one at a time)
4. Save and wait for redeploy
5. Check logs for "✅ MongoDB Connected"

---

## Get Connection String from MongoDB Atlas

### Step 1: Go to MongoDB Atlas
👉 https://cloud.mongodb.com

### Step 2: Click "Connect" on Cluster0

### Step 3: Choose Connection Method
- Select **"Drivers"**
- Driver: **Node.js**
- Version: **5.5 or later**

### Step 4: Copy and Modify
You'll see:
```
mongodb+srv://2410030087_db_user:<password>@cluster0.rchvzyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Modify to:**
```
mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority&appName=Cluster0
```

**Changes made:**
1. Replace `<password>` with `poPUH975zejJkazB`
2. Add `/healthmate` before the `?`

---

## Password Special Characters Issue

If your password has special characters, they need to be URL encoded.

Your password: `poPUH975zejJkazB`
- ✅ No special characters, should work fine

**If you had special characters:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

---

## Verify Database User

### In MongoDB Atlas:

1. Click **"Database Access"** (left sidebar)
2. Find user: `2410030087_db_user`
3. Check:
   - ✅ Status: Active
   - ✅ Authentication: Password
   - ✅ Database User Privileges: "Read and write to any database"

### If user doesn't exist or has issues:

**Create new user:**
1. Click "+ ADD NEW DATABASE USER"
2. Authentication Method: **Password**
3. Username: `healthmate_user`
4. Password: Click "Autogenerate Secure Password" (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

**Then update connection string:**
```
mongodb+srv://healthmate_user:NEW_PASSWORD@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority
```

---

## Test Connection Locally (Optional)

If you want to test the connection before deploying:

### Create test file: `test-mongo.js`
```javascript
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});
```

### Run test:
```bash
cd backend
node test-mongo.js
```

---

## Recommended Connection String for Render

**Use this one:**
```
mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority
```

**Why:**
- Includes database name (`healthmate`)
- Has retry logic (`retryWrites=true`)
- Sets write concern (`w=majority`)
- No unnecessary parameters
- Clean and simple

---

## Update in Render

### Copy this exact string:
```
mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority
```

### Paste in Render:
1. Dashboard → Your Service → Environment
2. Find `MONGODB_URI`
3. Click Edit
4. Paste the string above
5. Save Changes

---

## What to Check in Render Logs

### Success:
```
✅ MongoDB Connected
```

### Failure - Authentication:
```
❌ MongoDB Connection Error: Authentication failed
```
**Fix:** Check username/password

### Failure - Network:
```
❌ MongoDB Connection Error: Server selection timeout
```
**Fix:** Whitelist 0.0.0.0/0 in Network Access

### Failure - DNS:
```
❌ MongoDB Connection Error: getaddrinfo ENOTFOUND
```
**Fix:** Check cluster URL is correct

---

## Final Checklist

- [ ] MongoDB Atlas cluster is running (green status)
- [ ] Network Access has `0.0.0.0/0` whitelisted
- [ ] Database user exists and is active
- [ ] Password is correct (no typos)
- [ ] Connection string has `/healthmate` before `?`
- [ ] MONGODB_URI is set in Render environment
- [ ] Waited 2 minutes after Network Access change
- [ ] Render service has redeployed

---

**Try the recommended connection string above and whitelist 0.0.0.0/0 - this should fix it!**
