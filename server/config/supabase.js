import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

export async function initializeSupabase() {
  try {
    // Create tables if they don't exist
    await createTables();
    logger.info('✅ Supabase initialized successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize Supabase:', error);
    throw error;
  }
}

async function createTables() {
  // Users table
  await supabase.rpc('create_users_table_if_not_exists');
  
  // Messages table
  await supabase.rpc('create_messages_table_if_not_exists');
  
  // Conversations table
  await supabase.rpc('create_conversations_table_if_not_exists');
  
  // AI Interactions table
  await supabase.rpc('create_ai_interactions_table_if_not_exists');
  
  // Analytics table
  await supabase.rpc('create_analytics_table_if_not_exists');
  
  // Settings table
  await supabase.rpc('create_settings_table_if_not_exists');
}