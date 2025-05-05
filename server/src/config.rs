use clap::{command, Parser, Subcommand};

pub const LOGO: &str = r#"
    ▌   ▗ ▘  
▛▘▛▌▛▌▛▌▜▘▌▚▘
▌ ▙▌▙▌▙▌▐▖▌▞▖             
"#;

#[derive(Parser)]
#[command(name = "server")]
#[command(version = env!("CARGO_PKG_VERSION"))]
pub struct Arguments {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    #[command(
        about = "start the robotix server",
        long_about = "

Start:

Starts the robotix server with configuration from environment
variables or command line flags.
Use --help to view available configuration options."
    )]
    Start(Settings),
}

#[derive(Parser, Debug)]
pub struct Settings {
    #[arg(long, env = "HOST")]
    pub host: String,
    #[arg(long, env = "PORT")]
    pub port: u16,
    #[arg(long, env = "RUST_LOG", default_value = "info")]
    pub log_level: String,
    #[arg(
        short,
        long,
        env = "CORS_ALLOW_ORIGIN",
        default_value = "http://localhost:3000"
    )]
    pub cors_allow_origin: String,
    #[arg(
        long,
        env = "ROBOT_CONFIG_DIR",
        default_value = "config"
    )]
    pub robot_config_dir: String,
}
