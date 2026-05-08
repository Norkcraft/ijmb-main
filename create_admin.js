
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laynlxrhwpfhgexinlgg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxheW5seHJod3BmaGdleGlubGdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzOTgzMiwiZXhwIjoyMDg4OTE1ODMyfQ.Ci3MsVGqJ-EDGdq9EyZTJ0tFZg_N0O27rwS1QTCyVP8';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createAdmin() {
  const email = 'support@ijmb.info';
  const password = 'AdminPassword123!';
  
  console.log(`Updating user: ${email}...`);

  // 1. Get the user ID since they already exist
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
      console.error('User not found despite "already registered" error. Please check Supabase dashboard.');
      return;
  }
  
  const userId = user.id;
  console.log(`Found User ID: ${userId}`);

  // 2. Assign admin role in profiles table
  console.log('Assigning admin role...');
  
  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
  
  if (profile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'super_admin' })
        .eq('id', userId);
        
      if (updateError) console.error('Error updating role:', updateError);
      else console.log('Success! Role updated to admin.');
  } else {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ 
            id: userId, 
            role: 'super_admin',
            full_name: 'System Admin',
            phone: '+2348000000000'
        });
        
      if (insertError) console.error('Error inserting profile:', insertError);
      else console.log('Success! Admin profile created.');
  }
}

createAdmin();
