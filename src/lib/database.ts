import { supabase } from './supabase'

export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  display_name?: string
  avatar_url?: string
  language_preference: string
  created_at: string
  updated_at: string
}

// Conversations
export const createConversation = async (title: string = 'New Chat') => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: new Error('No authenticated user') }
  }
  
  const { data, error } = await supabase
    .from('conversations')
    .insert({ title, user_id: user.id })
    .select()
    .single()
  
  return { data, error }
}

export const getConversations = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: new Error('No authenticated user') }
  }
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
  
  return { data, error }
}

export const getConversation = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: new Error('No authenticated user') }
  }
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  
  return { data, error }
}

export const updateConversation = async (id: string, updates: Partial<Conversation>) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: new Error('No authenticated user') }
  }
  
  const { data, error } = await supabase
    .from('conversations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
  
  return { data, error }
}

export const deleteConversation = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: new Error('No authenticated user') }
  }
  
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  return { error }
}

// Messages
export const createMessage = async (conversationId: string, role: 'user' | 'assistant', content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single()
  
  return { data, error }
}

export const getMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

// User Profiles
export const createUserProfile = async (userId: string, displayName?: string, avatarUrl?: string, languagePreference: string = 'en') => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({ 
      user_id: userId, 
      display_name: displayName, 
      avatar_url: avatarUrl, 
      language_preference: languagePreference 
    })
    .select()
    .single()
  
  return { data, error }
}

export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: new Error('No authenticated user') }
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: new Error('No authenticated user') }
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single()
  
  return { data, error }
}