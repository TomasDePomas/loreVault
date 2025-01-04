pub mod database_migrations {
    use tauri_plugin_sql::{Migration, MigrationKind};


    pub fn get_migrations() -> Vec<Migration> {
        return vec![
            Migration {
                version: 1,
                description: "create_initial_tables",
                sql: "\
                CREATE TABLE records (identifier TEXT PRIMARY KEY);\
                CREATE TABLE categories (categoryName TEXT PRIMARY KEY);\
                CREATE TABLE record_categories (recordIdentifier TEXT NOT NULL, categoryName TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY (recordIdentifier, categoryName));\
                ",
                kind: MigrationKind::Up,
            }
        ];
    }
}
