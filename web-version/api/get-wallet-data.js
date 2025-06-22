const { ethers } = require('ethers');

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

const TOKENS = [
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD' },
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin' },
    { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai Stablecoin' },
    { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Wrapped Ether' },
    { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', name: 'Uniswap' },
    { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', name: 'Chainlink' },
    { symbol: 'AAVE', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', name: 'Aave' },
    { symbol: 'COMP', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', name: 'Compound' }
];

module.exports = async (request, response) => {
    // 1. Check for API Key (Environment Variable)
    if (!process.env.ETHEREUM_RPC_URL) {
        console.error("SERVER_ERROR: ETHEREUM_RPC_URL environment variable is not set.");
        return response.status(500).json({ error: 'Server Error: The application is not configured correctly. Missing API Key.' });
    }
    
    const { address } = request.query;

    // 2. Validate Wallet Address
    if (!address || !ethers.utils.isAddress(address)) {
        return response.status(400).json({ error: 'Client Error: Invalid or missing Ethereum wallet address.' });
    }

    // 3. Connect to the blockchain
    let provider;
    try {
        provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    } catch (e) {
        console.error("SERVER_ERROR: Failed to create ethers provider.", e);
        return response.status(500).json({ error: 'Server Error: Could not connect to the blockchain provider.' });
    }

    // 4. Fetch data
    try {
        const [ethBalance, tokenBalances] = await Promise.all([
            provider.getBalance(address),
            Promise.all(TOKENS.map(async (token) => {
                try {
                    const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
                    const balance = await contract.balanceOf(address);
                    if (balance.isZero()) return null;
                    const decimals = await contract.decimals();
                    const balanceFloat = parseFloat(ethers.utils.formatUnits(balance, decimals));
                    return {
                        symbol: token.symbol,
                        name: token.name,
                        balance: balanceFloat.toFixed(6),
                        contract_address: token.address
                    };
                } catch (error) {
                    console.warn(`Token Fetch Error for ${token.symbol}:`, error.message);
                    return null;
                }
            }))
        ]);
        
        const walletData = {
            address: address,
            eth_balance: parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(6),
            token_balances: tokenBalances.filter(b => b !== null)
        };
        
        response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        return response.status(200).json(walletData);

    } catch (error) {
        console.error(`PROVIDER_ERROR for address ${address}:`, error);
        return response.status(500).json({ error: 'Provider Error: Failed to fetch data. The API key may be invalid or the service may be down.' });
    }
}; 