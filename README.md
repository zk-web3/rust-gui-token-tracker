# Ethereum Token Tracker

A modern desktop application built with **Rust + Tauri** that allows users to track Ethereum wallet balances and ERC-20 token holdings in real-time.

## Features

- 🪙 **Live ETH Balance**: Real-time Ethereum balance tracking
- 🪙 **ERC-20 Token Support**: Track popular tokens like USDT, DAI, WETH, UNI, LINK, AAVE, COMP
- 🔄 **Real-time Data**: Fresh data with every wallet lookup
- 🎨 **Modern UI**: Clean, responsive design with smooth animations
- ⚡ **Fast Performance**: Built with Rust for optimal performance
- 🔒 **Secure**: No private keys required, read-only wallet tracking

## Screenshots

The application features a beautiful gradient background with glassmorphism UI elements, displaying:
- Wallet address input with validation
- Loading spinner during data fetching
- ETH balance card with gradient styling
- Grid layout for ERC-20 token balances
- Responsive design for all screen sizes

## Prerequisites

- **Rust** (latest stable version)
- **Node.js** (for Tauri CLI)
- **Ethereum RPC Endpoint** (Infura or Alchemy)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rust-gui-token-tracker
   ```

2. **Install Tauri CLI**
   ```bash
   npm install -g @tauri-apps/cli
   ```

3. **Install Rust dependencies**
   ```bash
   cargo build
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Ethereum RPC URL:
   ```env
   ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR-PROJECT-ID
   ```

## Getting an Ethereum RPC Endpoint

### Option 1: Infura (Free tier available)
1. Go to [Infura](https://infura.io/)
2. Create an account and new project
3. Copy your project ID
4. Use: `https://mainnet.infura.io/v3/YOUR-PROJECT-ID`

### Option 2: Alchemy (Free tier available)
1. Go to [Alchemy](https://alchemy.com/)
2. Create an account and new app
3. Copy your API key
4. Use: `https://eth-mainnet.alchemyapi.io/v2/YOUR-API-KEY`

## Usage

### Development Mode
```bash
cargo tauri dev
```

### Build for Production
```bash
cargo tauri build
```

The built application will be available in `src-tauri/target/release/`.

## Supported Tokens

The application currently tracks these popular ERC-20 tokens:

| Token | Symbol | Contract Address |
|-------|--------|------------------|
| Tether USD | USDT | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |
| USD Coin | USDC | `0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8` |
| Dai Stablecoin | DAI | `0x6B175474E89094C44Da98b954EedeAC495271d0F` |
| Wrapped Ether | WETH | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| Uniswap | UNI | `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` |
| Chainlink | LINK | `0x514910771AF9Ca656af840dff83E8264EcF986CA` |
| Aave | AAVE | `0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9` |
| Compound | COMP | `0xc00e94Cb662C3520282E6f5717214004A7f26888` |

## Example Addresses

Try these addresses to test the application:

- **Vitalik Buterin**: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
- **Binance Hot Wallet**: `0x28C6c06298d514Db089934071355E5743bf21d60`

## Technical Details

### Backend (Rust)
- **Tauri**: Desktop application framework
- **ethers-rs**: Ethereum library for Rust
- **tokio**: Async runtime
- **serde**: Serialization/deserialization

### Frontend (HTML/CSS/JavaScript)
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid & Flexbox**: Modern layout techniques
- **Font Awesome**: Icons
- **Inter Font**: Modern typography

### Architecture
- **Rust Backend**: Handles Ethereum blockchain interactions
- **Tauri Commands**: Secure communication between frontend and backend
- **Real-time Data**: Fresh blockchain data on every request
- **Error Handling**: Comprehensive error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

- This application is **read-only** and does not require private keys
- Only public wallet addresses are used for balance queries
- No sensitive data is stored locally
- All blockchain interactions are through secure RPC endpoints

## Troubleshooting

### Common Issues

1. **"Failed to create provider" error**
   - Check your `.env` file and ensure `ETHEREUM_RPC_URL` is set correctly
   - Verify your RPC endpoint is working

2. **"Invalid Ethereum address" error**
   - Ensure the address starts with `0x` and is 42 characters long
   - Check for typos in the address

3. **Build errors**
   - Ensure you have the latest Rust toolchain: `rustup update`
   - Clear cargo cache: `cargo clean`

### Performance Tips

- Use a reliable RPC endpoint for faster responses
- The application caches no data, ensuring fresh information
- Consider using Alchemy for better performance and rate limits

## Roadmap

- [ ] Add more ERC-20 tokens
- [ ] Historical balance tracking
- [ ] Price data integration
- [ ] Multiple wallet support
- [ ] Export functionality
- [ ] Dark mode theme
- [ ] Mobile responsive design 