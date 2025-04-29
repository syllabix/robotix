use actix_web::{web, HttpResponse, Responder};
use crate::robot::models::{CraneState, CraneDimensions, CraneLimits};

pub async fn get_crane_state() -> impl Responder {
    let state = CraneState::default();
    HttpResponse::Ok().json(state)
}

pub async fn get_crane_state_by_id(path: web::Path<i32>) -> impl Responder {
    let _id = path.into_inner();
    let state = CraneState::default();
    HttpResponse::Ok().json(state)
}

pub async fn get_dimensions() -> impl Responder {
    let dimensions = CraneDimensions::default();
    HttpResponse::Ok().json(dimensions)
}

pub async fn get_crane_limits() -> impl Responder {
    let limits = CraneLimits::default();
    HttpResponse::Ok().json(limits)
} 