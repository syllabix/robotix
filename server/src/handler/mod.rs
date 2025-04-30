//! # handler
//!
//! the handler module contains http
//! handlers

pub mod middleware;
pub mod robot_crane;

mod errors;
mod health_check;
pub use self::health_check::health_check;