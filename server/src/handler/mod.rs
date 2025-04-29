//! # handler
//!
//! the handler module contains http
//! handlers

pub mod middleware;

mod health_check;
pub use self::health_check::health_check;