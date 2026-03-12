-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table with secure key columns
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  classification TEXT NOT NULL,
  image_url TEXT,
  user_id TEXT NOT NULL, -- Changed from UUID to TEXT to store email
  upload_key TEXT NOT NULL,
  document_id TEXT NOT NULL,
  access_key TEXT NOT NULL,
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_documents_upload_key ON documents(upload_key);
CREATE INDEX idx_documents_document_id ON documents(document_id);

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for security
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.email() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.email() = user_id);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.email() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.email() = user_id);

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Migration for existing documents (if any)
-- Add columns to existing documents table
ALTER TABLE documents 
  ADD COLUMN IF NOT EXISTS upload_key TEXT,
  ADD COLUMN IF NOT EXISTS document_id TEXT,
  ADD COLUMN IF NOT EXISTS access_key TEXT,
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Update existing documents with generated keys
UPDATE documents 
SET 
  upload_key = substr(md5(random()::text), 1, 32),
  document_id = substr(md5(random()::text), 33, 32),
  access_key = md5(random()::text),
  storage_path = user_id || '/' || substr(md5(random()::text), 1, 32) || '/doc_' || extract(epoch from now())::text || '.jpg'
WHERE upload_key IS NULL;
