use actix_web::{
    middleware::Logger,
    web::{self, Data},
    App, HttpServer,
};
use anyhow::{Context, Error};
use handler::{health_check, middleware::cors_config, robot_crane};
use robot::Registry;
use storage::Database;

pub mod config;
pub mod robot;
pub mod storage;
mod telemetry;

mod handler;

pub async fn start(config: config::Settings) -> Result<(), Error> {
    telemetry::setup(&config.log_level);
    tracing::info!("starting up robotix server...");

    // Load robots from storage
    let config_dir = &config.robot_config_dir;
    let crane_db = Database::setup(config_dir)?;

    let robot_registry = Data::new(Registry::new(crane_db));

    HttpServer::new(move || {
        let logger = Logger::default();

        App::new()
            .wrap(cors_config(&config.cors_allow_origin))
            .wrap(logger)
            .route("/healthz", web::get().to(health_check))
            .service(
                web::scope("/v1/robot")
                    .app_data(robot_registry.clone())
                    .route("", web::get().to(robot_crane::get_all))
                    .route("/{id}", web::get().to(robot_crane::get))
                    .route("/{id}/connect", web::get().to(robot_crane::connect)),
            )
    })
    .bind((config.host, config.port))?
    .run()
    .await
    .context("failed to start up the robotix web server")?;

    Ok(())
}
