use soroban_sdk::{Address, Env};

/// Transfer tokens from one address to another
pub fn transfer(env: &Env, token: &Address, from: &Address, to: &Address, amount: &i128) {
    let token_client = soroban_sdk::token::Client::new(env, token);
    token_client.transfer(from, to, amount);
}
