CREATE TABLE IF NOT EXISTS jobs (
    name TEXT NOT NULL, -- job name
    version TEXT NOT NULL, -- job version
    "key" TEXT NOT NULL, -- input key
    result TEXT, -- optional stored result
    "date" TEXT DEFAULT current_timestamp, -- date job was run
    PRIMARY KEY (name, version, "key")
);
