#[cfg_attr(mobile, tauri::mobile_entry_point)]
use tauri::Manager;
use std::env;
use crate::chest::chest_file;
use crate::database::database_migrations;
use tauri_plugin_sql::{Builder, Migration};


mod chest;
mod database;

pub fn run() {
    let args: Vec<String> = env::args().collect();
    let migrations: Vec<Migration> = database_migrations::get_migrations();

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            Builder::default()
                .add_migrations("sqlite:loreVault.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            new_chest,
            open_chest,
            save_chest,
            close_chest
        ])
        .setup(move |app| {
            let mut opened_chest: &str = "";
            if args.len() > 1 {
                opened_chest = &args[1];
            }

            let main_window = app.get_webview_window("main").unwrap();
            let _ = main_window.set_decorations(false);
            let _ = main_window.open_devtools();
            if let Err(err) = main_window.eval(&format!(
                "window.tauriContainer = {{ openedFile: '{}' }};",
                opened_chest
            )) {
                dbg!(err);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn new_chest(app: tauri::AppHandle) -> Result<String, String> {
    if let Err(err) = chest_file::new(&app).await {
        return Err(err.into());
    }
    Ok("OK".into())
}

#[tauri::command]
async fn open_chest(app: tauri::AppHandle, path: String) -> Result<String, String> {
    if let Err(err) = chest_file::open(&app, path).await {
        return Err(err.into());
    }
    Ok("OK".into())
}

#[tauri::command]
async fn save_chest(app: tauri::AppHandle, path: String) -> Result<String, String> {
    if let Err(err) = chest_file::save(&app, path).await {
        return Err(err.into());
    }
    Ok("OK".into())
}

#[tauri::command]
async fn close_chest(app: tauri::AppHandle) -> Result<String, String> {
    if let Err(err) = chest_file::close(&app).await {
        return Err(err.into());
    }
    Ok("OK".into())
}
