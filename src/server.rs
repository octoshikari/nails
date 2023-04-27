use std::env;
use std::fmt::Error;
use std::net::SocketAddr;
use axum::response::IntoResponse;
use axum::{middleware, Router};
use axum::routing::get;
use http::StatusCode;

pub async fn start_app_server() -> Result<(), Error> {
    let port = env::var("PORT").unwrap_or("8080".to_string()).parse::<u16>().unwrap();
    let app = Router::new()
        .route("/", get(handler) )
        .fallback(handler_404)
        .route_layer(middleware::from_fn(metrics::track_metrics));
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .with_graceful_shutdown(shutdown::shutdown_signal())
        .await
        .unwrap();

    Ok(())
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "nothing to see here")
}

async fn handler() -> impl IntoResponse {
    (StatusCode::OK, "Hello there")
}