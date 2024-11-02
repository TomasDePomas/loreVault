pub mod chest_file {
    use tauri::{Manager, AppHandle};
    use std::path::{Path, PathBuf};
    use std::fs::{DirBuilder, remove_dir_all, rename as rename_dirent};
    use zip_extensions::*;

    pub async fn open(app: &AppHandle, path: String) -> Result<String, String> {
        let cache_path = match prepare_cache_directory(app) {
            Result::Ok(path) => path,
            Result::Err(error) => return Err(format!("Unable to prepare cache directory: {error}").into())
        };

        let chest_file = PathBuf::from(&path);

        if let Err(error) = zip_extract(&chest_file, &cache_path) {
            return Err(format!("Unable to extract chest into cache: {error}").into());
        }
        Ok("OK".into())
    }

    pub async fn save(app: &AppHandle, target_path: String) -> Result<String, String> {
        if let Err(error) = assure_derivative_directory(app, &target_path) {
            return Err(format!("Unable to create the derivative directory: {error}").into());
        }
        let mut cache_path = app.path_resolver().app_cache_dir().unwrap();
        cache_path.push("openedChest");

        if !cache_path.exists() {
            return Err(format!("No chest found to save at {:?}", cache_path).into());
        }
        let chest_file = PathBuf::from(&target_path);

        if let Err(error) = zip_create_from_directory(&chest_file, &cache_path) {
            return Err(format!("Unable to save chest cache into chest file: {error}").into());
        }

        Ok("OK".into())
    }

    pub async fn close(app: &AppHandle) -> Result<String, String> {
        let mut cache_path = app.path_resolver().app_cache_dir().unwrap();
        cache_path.push("openedChest");

        if cache_path.exists() {
            if let Err(_err) = remove_dir_all(cache_path.as_path()) {
                dbg!(_err);
                return Err("Unable clear openedChest cache".into());
            }
        }
        Ok("OK".into())
    }


    fn prepare_cache_directory(app: &AppHandle) -> Result<PathBuf, Box<dyn std::error::Error>> {
        let mut cache_path = app.path_resolver().app_cache_dir().unwrap();
        cache_path.push("openedChest");

        if cache_path.exists() {
            if let Err(_err) = remove_dir_all(cache_path.as_path()) {
                dbg!(_err);
                return Err("Unable clear openedChest cache".into());
            }
        }

        let mut builder = DirBuilder::new();
        builder.recursive(true);
        builder.create(cache_path.as_path()).unwrap();

        if !cache_path.exists() {
            return Err("Unable to create openedChest cache folder".into());
        }
        return Ok(cache_path);
    }
}
