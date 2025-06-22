// Import Tauri API
const { invoke } = window.__TAURI__.tauri;

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
    
    showLoading();
    
    try {
        const walletData = await invoke('get_wallet_data', { address });
        showResults(walletData);
    } catch (error) {
        console.error('Error fetching wallet data:', error);
        showError(error.toString());
    }
});

walletAddressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isSearching) {
        searchBtn.click();
    }
});

// Auto-focus on input when page loads
document.addEventListener('DOMContentLoaded', () => {
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
    welcomeDiv.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        welcomeDiv.style.opacity = '1';
        welcomeDiv.style.transform = 'translateY(0)';
    }, 100);
});

// Add error handling for network issues
window.addEventListener('online', () => {
    if (errorDiv.textContent.includes('network') || errorDiv.textContent.includes('connection')) {
        hideElement(errorDiv);
        showElement(welcomeDiv);
    }
});

window.addEventListener('offline', () => {
    if (!isSearching) {
        showError('No internet connection. Please check your network and try again.');
    }
}); 