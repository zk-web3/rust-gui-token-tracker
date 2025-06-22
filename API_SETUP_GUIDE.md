# 🔑 API Setup Guide - Ethereum Token Tracker

## API Key ki Zaroorat Kyon Hai?

Ethereum blockchain se real-time data fetch karne ke liye aapko ek RPC endpoint chahiye. Ye aapko Ethereum network se connect karta hai.

## 🆓 Free API Keys (Recommended)

### Option 1: Infura (Free)
1. **Website**: https://infura.io/
2. **Sign up** karein
3. **New Project** create karein
4. **Project ID** copy karein
5. **URL**: `https://mainnet.infura.io/v3/YOUR-PROJECT-ID`

### Option 2: Alchemy (Free)
1. **Website**: https://alchemy.com/
2. **Sign up** karein
3. **New App** create karein
4. **API Key** copy karein
5. **URL**: `https://eth-mainnet.alchemyapi.io/v2/YOUR-API-KEY`

## 📝 Setup Steps

### Step 1: Environment File Create Karein
```bash
cp env.example .env
```

### Step 2: .env File Edit Karein
```env
# Infura ke liye
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR-PROJECT-ID

# Ya Alchemy ke liye
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR-API-KEY
```

### Step 3: Application Run Karein
```bash
.\build.ps1 -Dev
```

## 🚫 API Key Bina Kya Hoga?

**Without API Key:**
- ❌ Application start nahi hogi
- ❌ "Failed to create provider" error
- ❌ Koi data fetch nahi hoga

**With API Key:**
- ✅ Real-time ETH balance
- ✅ ERC-20 token balances
- ✅ Live blockchain data

## 💰 Cost

**Free Tier Limits:**
- **Infura**: 100,000 requests/day
- **Alchemy**: 300M compute units/month

**Paid Plans:**
- **Infura Pro**: $50/month
- **Alchemy Growth**: $49/month

## 🔒 Security

- ✅ API keys sirf read-only access dete hain
- ✅ Private keys ki zaroorat nahi
- ✅ Sirf public wallet addresses use hote hain
- ✅ Koi sensitive data store nahi hota

## 🆘 Help

Agar aapko API key setup mein problem aa rahi hai:

1. **Infura/Alchemy** ke documentation check karein
2. **Free tier** se start karein
3. **Project ID/API Key** sahi copy karein
4. **.env file** mein sahi format use karein

## 📞 Support

Agar koi aur help chahiye to:
- GitHub issues create karein
- Documentation check karein
- Community forums use karein 