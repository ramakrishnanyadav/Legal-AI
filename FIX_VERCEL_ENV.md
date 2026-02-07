# 🔧 Fix Vercel Environment Variable

## Problem
Your deployed site is calling the WRONG backend URL:
- ❌ Calling: `https://legal-ai-1-odwy.onrender.com` (doesn't exist - 404)
- ✅ Should call: `https://legal-ai-roc4.onrender.com` (your actual backend)

## Solution

### Step 1: Go to Vercel Dashboard
https://vercel.com/dashboard

### Step 2: Select Your Project
Click: **legal-ai-fbtp**

### Step 3: Go to Settings
Click **Settings** in the top menu

### Step 4: Environment Variables
Click **Environment Variables** in the left sidebar

### Step 5: Find VITE_API_URL
Look for a variable named `VITE_API_URL`

### Step 6A: If it EXISTS with wrong value
1. Click the **"..."** menu next to it
2. Click **"Edit"**
3. Change value to: `https://legal-ai-roc4.onrender.com`
4. Make sure it's set for **"Production"**
5. Click **"Save"**

### Step 6B: If it DOESN'T EXIST
1. Click **"Add New"**
2. Name: `VITE_API_URL`
3. Value: `https://legal-ai-roc4.onrender.com`
4. Select: **Production** (check the box)
5. Click **"Save"**

### Step 7: Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **"..."** menu → **"Redeploy"**
4. Wait 2-3 minutes

### Step 8: Test
1. Go to: https://legal-ai-fbtp.vercel.app/
2. Try analyzing a case
3. Should work now! ✅

## Quick Checklist
- [ ] Updated `VITE_API_URL` to `https://legal-ai-roc4.onrender.com`
- [ ] Set for "Production" environment
- [ ] Saved changes
- [ ] Redeployed site
- [ ] Tested - it works!
