use actix_web::{middleware::Logger, web, App, HttpServer};
use anyhow::{Context, Error};
use handler::{
    health_check,
    middleware::cors_config,
};

pub mod config;
mod telemetry;

mod handler;

pub async fn start(config: config::Settings) -> Result<(), Error> {
    telemetry::setup(&config.log_level);
    tracing::info!("starting up robotix server...");

    HttpServer::new(move || {
        let logger = Logger::default();

        App::new()
            .wrap(cors_config(&config.cors_allow_origin))
            .wrap(logger)
            .route("/healthz", web::get().to(health_check))
    })
    .bind((config.host, config.port))?
    .run()
    .await
    .context("failed to start up the robotix web server")?;

    Ok(())
}
