use chrono::{DateTime, Utc};
use actix_web::HttpResponse;
use serde::Serialize;

#[derive(Serialize)]
pub struct Response {
    pub status: String,
    pub version: String,
    pub timestamp: DateTime<Utc>,
}

pub async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(Response {
        status: String::from("Ok"),
        version: env!("CARGO_PKG_VERSION").to_string(),
        timestamp: Utc::now(),
    })
}
