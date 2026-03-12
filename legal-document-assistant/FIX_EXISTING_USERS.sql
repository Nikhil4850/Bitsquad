-- Fix Existing Users Without Profiles
-- Run this if you have users in auth.users but not in public.users

-- Step 1: Check which users are missing profiles
SELECT 
  a.id,
  a.email,
  a.created_at as auth_created,
  CASE 
    WHEN u.id IS NULL THEN '❌ MISSING PROFILE'
    ELSE '✅ HAS PROFILE'
  END as status
FROM auth.users a
LEFT JOIN public.users u ON a.id = u.id
ORDER BY a.created_at DESC;

-- Step 2: Create profiles for all users that don't have one
INSERT INTO public.users (id, email, name, plan, documents_analyzed, join_date, created_at, updated_at)
SELECT 
  a.id,
  a.email,
  COALESCE(
    a.raw_user_meta_data->>'name',
    split_part(a.email, '@', 1),
    'User'
  ) as name,
  'free' as plan,
  0 as documents_analyzed,
  a.created_at as join_date,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users a
LEFT JOIN public.users u ON a.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = COALESCE(public.users.name, EXCLUDED.name),
  updated_at = NOW();

-- Step 3: Verify all users now have profiles
SELECT 
  COUNT(*) as total_auth_users,
  COUNT(u.id) as users_with_profiles,
  COUNT(*) - COUNT(u.id) as users_missing_profiles
FROM auth.users a
LEFT JOIN public.users u ON a.id = u.id;

-- Expected result: users_missing_profiles should be 0

-- Step 4: Show all users with their profile status
SELECT 
  a.email,
  u.name,
  u.plan,
  u.documents_analyzed,
  a.created_at as registered_at,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ Complete'
    ELSE '❌ Missing'
  END as profile_status
FROM auth.users a
LEFT JOIN public.users u ON a.id = u.id
ORDER BY a.created_at DESC
LIMIT 20;
