mod server;

use std::{env, fmt};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};


#[derive(PartialEq, Debug)]
enum AppEnv {
    Dev,
    Prod,
}

impl fmt::Display for AppEnv {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let printable = match *self {
            AppEnv::Dev => "dev",
            AppEnv::Prod => "prod",
        };
        write!(f, "{printable}")
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,nails=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app_env = match env::var("APP_ENV") {
        Ok(v) if v == "prod" => AppEnv::Prod,
        _ => AppEnv::Dev,
    };
    tracing::info!("Running in {app_env} mode");

    if app_env == AppEnv::Dev {
        match dotenvy::dotenv() {
            Ok(path) => tracing::debug!(".env read successfully from {}", path.display()),
            Err(e) => tracing::debug!("Could not load .env file: {e}"),
        };
    }



    let (_,_) = tokio::join!(server::start_app_server(), metrics::start_metrics_server());
}
