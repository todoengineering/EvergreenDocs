#!/bin/bash

echo "Enter your migration name:"
read migration_name

# Get current date and time in ISO 8601 format
date_string=$(date -Iseconds)

# Replace colons with hyphens to create a valid file name
filename="${date_string/:/-}-$migration_name.ts"

# Create the migrations folder if it doesn't exist
mkdir -p migrations

# Create the TypeScript file with the migration code
cat <<EOF > "migrations/$filename"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
EOF

echo "Created file: migrations/$filename"