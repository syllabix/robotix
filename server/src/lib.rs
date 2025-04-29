use actix_web::{middleware::Logger, web, App, HttpServer};
use anyhow::{Context, Error};
use handler::{health_check, middleware::cors_config, robot_crane};

pub mod config;
mod telemetry;

mod handler;
mod robot;

pub async fn start(config: config::Settings) -> Result<(), Error> {
    telemetry::setup(&config.log_level);
    tracing::info!("starting up robotix server...");

    HttpServer::new(move || {
        let logger = Logger::default();

        App::new()
            .wrap(cors_config(&config.cors_allow_origin))
            .wrap(logger)
            .route("/healthz", web::get().to(health_check))
            .service(web::scope("/v1/robot").route(
                "/{id}/dimensions",
                web::get().to(robot_crane::get_dimensions),
            ))
    })
    .bind((config.host, config.port))?
    .run()
    .await
    .context("failed to start up the robotix web server")?;

    Ok(())
}
