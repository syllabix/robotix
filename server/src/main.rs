use std::error::Error;

use clap::Parser;
use dotenvy::dotenv;
use server::config::{Arguments, Commands, LOGO};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let _ = dotenv();

    print!("{LOGO}");
    println!("v{}", env!("CARGO_PKG_VERSION"));

    let args = Arguments::parse();

    match args.command {
        Commands::Start(config) => server::start(config).await?,
    }
    Ok(())
}
