#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use ethers::{
    contract::Contract,
    core::types::{Address, U256},
    providers::{Http, Provider},
    prelude::*,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

// ERC-20 ABI for balanceOf function
abigen!(
    ERC20,
    r#"[
        function balanceOf(address owner) view returns (uint256)
        function decimals() view returns (uint8)
        function symbol() view returns (string)
        function name() view returns (string)
    ]"#
);

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenBalance {
    symbol: String,
    name: String,
    balance: String,
    decimals: u8,
    contract_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletData {
    address: String,
    eth_balance: String,
    token_balances: Vec<TokenBalance>,
}

// Common ERC-20 token addresses on Ethereum mainnet
const TOKENS: &[(&str, &str, &str)] = &[
    ("USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7", "Tether USD"),
    ("USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "USD Coin"),
    ("DAI", "0x6B175474E89094C44Da98b954EedeAC495271d0F", "Dai Stablecoin"),
    ("WETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "Wrapped Ether"),
    ("UNI", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "Uniswap"),
    ("LINK", "0x514910771AF9Ca656af840dff83E8264EcF986CA", "Chainlink"),
    ("AAVE", "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", "Aave"),
    ("COMP", "0xc00e94Cb662C3520282E6f5717214004A7f26888", "Compound"),
];

struct AppState {
    provider: Arc<Provider<Http>>,
}

#[tauri::command]
async fn get_wallet_data(
    address: String,
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
) -> Result<WalletData, String> {
    let state = state.lock().await;
    let provider = &state.provider;

    // Validate address
    let wallet_address: Address = address
        .parse()
        .map_err(|_| "Invalid Ethereum address".to_string())?;

    // Get ETH balance
    let eth_balance = provider
        .get_balance(wallet_address, None)
        .await
        .map_err(|e| format!("Failed to get ETH balance: {}", e))?;

    let mut token_balances = Vec::new();

    // Get token balances
    for (symbol, contract_addr, name) in TOKENS {
        let contract_address: Address = contract_addr
            .parse()
            .map_err(|_| format!("Invalid contract address for {}", symbol))?;

        let contract = Contract::new(contract_address, ERC20::ABI.clone(), provider.clone());

        // Get token balance
        let balance: U256 = contract
            .method("balanceOf", wallet_address)
            .map_err(|e| format!("Failed to call balanceOf for {}: {}", symbol, e))?
            .call()
            .await
            .map_err(|e| format!("Failed to get balance for {}: {}", symbol, e))?;

        // Get token decimals
        let decimals: u8 = contract
            .method("decimals", ())
            .map_err(|e| format!("Failed to call decimals for {}: {}", symbol, e))?
            .call()
            .await
            .map_err(|e| format!("Failed to get decimals for {}: {}", symbol, e))?;

        // Format balance with proper decimals
        let balance_float = balance.as_u128() as f64 / 10_f64.powi(decimals as i32);
        let formatted_balance = if balance_float == 0.0 {
            "0".to_string()
        } else {
            format!("{:.6}", balance_float)
        };

        // Only add tokens with non-zero balance
        if balance > U256::zero() {
            token_balances.push(TokenBalance {
                symbol: symbol.to_string(),
                name: name.to_string(),
                balance: formatted_balance,
                decimals,
                contract_address: contract_addr.to_string(),
            });
        }
    }

    Ok(WalletData {
        address: address.clone(),
        eth_balance: format!("{:.6}", ethers::utils::format_ether(eth_balance)),
        token_balances,
    })
}

fn main() {
    // Load environment variables
    dotenv::dotenv().ok();
    env_logger::init();

    // Get RPC URL from environment
    let rpc_url = std::env::var("ETHEREUM_RPC_URL")
        .unwrap_or_else(|_| "https://mainnet.infura.io/v3/your-project-id".to_string());

    // Create provider
    let provider = Provider::<Http>::try_from(rpc_url)
        .expect("Failed to create provider");

    let app_state = Arc::new(Mutex::new(AppState {
        provider: Arc::new(provider),
    }));

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![get_wallet_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
} 