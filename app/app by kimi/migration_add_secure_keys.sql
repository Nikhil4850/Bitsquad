-- Migration: Add Secure Document Keys
-- Run this in your Supabase SQL Editor to update existing database

-- Add secure key columns to documents table
ALTER TABLE documents 
  ADD COLUMN IF NOT EXISTS upload_key TEXT,
  ADD COLUMN IF NOT EXISTS document_id TEXT,
  ADD COLUMN IF NOT EXISTS access_key TEXT,
  ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Change user_id from UUID to TEXT to store email
ALTER TABLE documents 
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Update existing documents with generated keys
UPDATE documents 
SET 
  upload_key = substr(md5(random()::text), 1, 32),
  document_id = substr(md5(random()::text), 33, 32),
  access_key = md5(random()::text),
  storage_path = user_id || '/' || substr(md5(random()::text), 1, 32) || '/doc_' || extract(epoch from now())::text || '.jpg'
WHERE upload_key IS NULL;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_documents_upload_key ON documents(upload_key);
CREATE INDEX IF NOT EXISTS idx_documents_document_id ON documents(document_id);

-- Update RLS policies to use email instead of UUID
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
DROP POLICY IF EXISTS "Users can update own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON documents;

CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.email() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.email() = user_id);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.email() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.email() = user_id);

-- Create a simple users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.email() = email);

-- Grant necessary permissions
GRANT ALL ON documents TO authenticated;
GRANT ALL ON users TO authenticated;
