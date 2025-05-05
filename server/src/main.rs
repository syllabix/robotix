use std::error::Error;

use clap::Parser;
use dotenvy::dotenv;
use server::config::{Arguments, Commands, LOGO};

use anyhow::Result;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    print!("{LOGO}");
    println!("v{}", env!("CARGO_PKG_VERSION"));
    
    let _ = dotenv();
    let args = Arguments::parse();

    match args.command {
        Commands::Start(config) => server::start(config).await?,
    }
    Ok(())
}
