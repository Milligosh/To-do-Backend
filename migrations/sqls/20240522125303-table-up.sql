/* Replace with your SQL commands */
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    userId SERIAL REFERENCES users(id) ON DELETE CASCADE,
    task varchar,
    priority INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
)