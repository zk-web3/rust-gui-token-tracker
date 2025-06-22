// Check if ethers.js is loaded
if (typeof ethers === 'undefined') {
    console.error('Ethers.js not loaded!');
    document.body.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
            <h1>❌ Error: Ethers.js not loaded</h1>
            <p>Please check your internet connection and refresh the page.</p>
            <button onclick="location.reload()">Refresh Page</button>
        </div>
    `;
}

// Web3 provider setup
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/7ec33be3e39348b6b5f83d0ac83bc2f4');

// ERC-20 ABI for balanceOf function
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

// DOM elements
const walletAddressInput = document.getElementById('wallet-address');
const searchBtn = document.getElementById('search-btn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const resultsDiv = document.getElementById('results');
const welcomeDiv = document.getElementById('welcome');
const walletAddressDisplay = document.getElementById('wallet-address-display');
const ethBalance = document.getElementById('eth-balance');
const tokensGrid = document.getElementById('tokens-grid');
const noTokensDiv = document.getElementById('no-tokens');

// State
let isSearching = false;

// Common ERC-20 token addresses on Ethereum mainnet
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

// Utility functions
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function showLoading() {
    hideElement(welcomeDiv);
    hideElement(resultsDiv);
    hideElement(errorDiv);
    showElement(loadingDiv);
    isSearching = true;
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
}

function hideLoading() {
    hideElement(loadingDiv);
    isSearching = false;
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
}

function showError(message) {
    hideElement(loadingDiv);
    hideElement(resultsDiv);
    hideElement(welcomeDiv);
    errorMessage.textContent = message;
    showElement(errorDiv);
    isSearching = false;
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
}

function showResults(walletData) {
    hideElement(loadingDiv);
    hideElement(errorDiv);
    hideElement(welcomeDiv);
    
    // Update wallet address display
    walletAddressDisplay.textContent = walletData.address;
    
    // Update ETH balance
    ethBalance.textContent = walletData.eth_balance;
    
    // Update token balances
    if (walletData.token_balances.length === 0) {
        hideElement(tokensGrid);
        showElement(noTokensDiv);
    } else {
        hideElement(noTokensDiv);
        tokensGrid.innerHTML = '';
        
        walletData.token_balances.forEach(token => {
            const tokenCard = createTokenCard(token);
            tokensGrid.appendChild(tokenCard);
        });
        
        showElement(tokensGrid);
    }
    
    showElement(resultsDiv);
    isSearching = false;
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
}

function createTokenCard(token) {
    const card = document.createElement('div');
    card.className = 'token-card';
    
    // Get token icon based on symbol
    const tokenIcon = getTokenIcon(token.symbol);
    
    card.innerHTML = `
        <div class="balance-header">
            <div class="token-icon">
                <i class="${tokenIcon}"></i>
            </div>
            <div class="token-info">
                <h3>${token.name} (${token.symbol})</h3>
                <p>ERC-20 Token</p>
            </div>
        </div>
        <div class="balance-amount">
            <span>${token.balance}</span>
            <span class="currency">${token.symbol}</span>
        </div>
    `;
    
    return card;
}

function getTokenIcon(symbol) {
    const iconMap = {
        'USDT': 'fas fa-dollar-sign',
        'USDC': 'fas fa-dollar-sign',
        'DAI': 'fas fa-dollar-sign',
        'WETH': 'fab fa-ethereum',
        'UNI': 'fas fa-exchange-alt',
        'LINK': 'fas fa-link',
        'AAVE': 'fas fa-chart-line',
        'COMP': 'fas fa-chart-bar'
    };
    
    return iconMap[symbol] || 'fas fa-coins';
}

function validateAddress(address) {
    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
}

async function getWalletData(address) {
    try {
        const response = await fetch(`/api/get-wallet-data?address=${address}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        
        const walletData = await response.json();
        return walletData;
    } catch (error) {
        console.error('Error fetching wallet data from API:', error);
        // Pass a user-friendly error message to the UI
        throw new Error(`Failed to fetch wallet data. Please try again later.`);
    }
}

// Event listeners
searchBtn.addEventListener('click', async () => {
    if (isSearching) return;
    
    const address = walletAddressInput.value.trim();
    
    if (!address) {
        showError('Please enter a wallet address');
        return;
    }
    
    if (!validateAddress(address)) {
        showError('Please enter a valid Ethereum address (0x followed by 40 hex characters)');
        return;
    }
    
    console.log('Starting search for address:', address);
    showLoading();
    
    try {
        const walletData = await getWalletData(address);
        console.log('Wallet data received:', walletData);
        showResults(walletData);
    } catch (error) {
        console.error('Error fetching wallet data:', error);
        showError(error.message);
    }
});

walletAddressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isSearching) {
        searchBtn.click();
    }
});

// Auto-focus on input when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, ethers.js available:', typeof ethers !== 'undefined');
    walletAddressInput.focus();
});

// Add click handlers for example addresses
document.addEventListener('DOMContentLoaded', () => {
    const exampleAddresses = document.querySelectorAll('.example-addresses code');
    exampleAddresses.forEach(code => {
        code.style.cursor = 'pointer';
        code.addEventListener('click', () => {
            walletAddressInput.value = code.textContent;
            walletAddressInput.focus();
        });
        
        // Add hover effect
        code.addEventListener('mouseenter', () => {
            code.style.backgroundColor = '#dee2e6';
        });
        
        code.addEventListener('mouseleave', () => {
            code.style.backgroundColor = '#e9ecef';
        });
    });
});

// Add some nice animations
document.addEventListener('DOMContentLoaded', () => {
    // Fade in welcome screen
    welcomeDiv.style.opacity = '0';
    welcomeDiv.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        welcomeDiv.style.transition = 'all 0.6s ease-out';
        welcomeDiv.style.opacity = '1';
        welcomeDiv.style.transform = 'translateY(0)';
    }, 100);
}); 