# 🌐 Ethereum Token Tracker - Web Version

A web-based Ethereum token tracker that can be deployed to Vercel or any static hosting platform.

## 🚀 Features

- ✅ Real-time ETH balance tracking
- ✅ ERC-20 token balance tracking
- ✅ Beautiful, responsive UI
- ✅ No backend required
- ✅ Works directly in browser

## 📋 Supported Tokens

- **USDT** (Tether USD)
- **USDC** (USD Coin)
- **DAI** (Dai Stablecoin)
- **WETH** (Wrapped Ether)
- **UNI** (Uniswap)
- **LINK** (Chainlink)
- **AAVE** (Aave)
- **COMP** (Compound)

## 🛠️ Local Development

To run this project locally, you'll need to create a `.env` file in the `web-version` directory with your Ethereum RPC URL.

1. Create a file named `.env.local` inside the `web-version` folder.
2. Add your API key to it:
   ```
   ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_API_KEY
   ```
3. Install Vercel CLI: `npm i -g vercel`
4. Run locally: `vercel dev` from the `web-version` directory.

## 🚀 Vercel Deployment

Deploying this application to Vercel is simple and secure.

### Step 1: Push to GitHub
Push the entire project, including the `web-version` folder, to a public or private GitHub repository.

### Step 2: Import Project on Vercel
1. Sign up or log in to [Vercel](https://vercel.com).
2. Click "Add New... > Project".
3. Import your GitHub repository.

### Step 3: Configure the Project
1. **Root Directory**: During import, set the **Root Directory** to `web-version`. This tells Vercel where your frontend and API code is.
2. **Environment Variable**: Go to your new project's **Settings > Environment Variables**.
3. Add a new variable:
    - **Name**: `ETHEREUM_RPC_URL`
    - **Value**: `https://mainnet.infura.io/v3/YOUR_API_KEY` (Replace with your actual Infura or Alchemy key)
4. **Deploy**: Click the "Deploy" button.

Vercel will automatically build your serverless function from the `api` folder and deploy your site. Your API key is now securely stored and not exposed to the public!

## 🔧 Configuration

The app uses your Infura API key directly in the JavaScript:
```javascript
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');
```

## 📱 Usage

1. Enter an Ethereum wallet address
2. Click "Search"
3. View ETH and token balances
4. Try example addresses provided

## 🎯 Example Addresses

- **Vitalik Buterin**: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
- **Binance Hot Wallet**: `0x28C6c06298d514Db089934071355E5743bf21d60`

## 🔒 Security

- ✅ No private keys required
- ✅ Read-only access only
- ✅ Public blockchain data
- ✅ No sensitive data stored

## 📄 License

MIT License - Feel free to use and modify! 