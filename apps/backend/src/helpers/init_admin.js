require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function initAdmin() {
  console.log('Creating admins table and inserting default admin...');
  
  // 1. Create Table (using RPC or just trying to insert)
  // Note: Standard Supabase JS client doesn't support CREATE TABLE directly easily without a custom function.
  // We will try to insert a record, which assumes the table exists.
  
  const { error: insertError } = await supabase
    .from('admins')
    .upsert([
      { username: 'admin', password: 'admin123', full_name: 'Super Admin' }
    ], { onConflict: 'username' });

  if (insertError) {
    if (insertError.code === 'PGRST116' || insertError.message.includes('does not exist')) {
      console.error('ERROR: Table "admins" does not exist in Supabase.');
      console.log('Please run this SQL in your Supabase Dashboard SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO admins (username, password, full_name)
VALUES ('admin', 'admin123', 'Super Admin')
ON CONFLICT (username) DO NOTHING;
      `);
    } else {
      console.error('Error inserting admin:', insertError.message);
    }
  } else {
    console.log('Successfully initialized admin data!');
  }
}

initAdmin();
