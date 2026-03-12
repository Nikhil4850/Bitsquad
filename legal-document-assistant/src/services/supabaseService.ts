import { supabase } from '../lib/supabase';
import { User, LegalDocument, ChatMessage } from '../types';

export const authService = {
  async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        // Wait a moment for auth to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: name,
            email: email,
            plan: 'free',
            documents_analyzed: 0,
            join_date: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw error, profile might already exist
        }
      }

      return { 
        user: data.user ? { 
          id: data.user.id, 
          email: data.user.email || email, 
          name: name 
        } : null, 
        error: null 
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get user profile
      let userProfile = null;
      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          userProfile = {
            id: profile.id,
            name: profile.name,
            email: profile.email
          };
        }
      }

      return { 
        user: data.user ? { 
          id: data.user.id, 
          email: data.user.email || email, 
          name: userProfile?.name || data.user.user_metadata?.name || 'User' 
        } : null, 
        error: null 
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { user: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        return { 
          user: { 
            id: user.id, 
            email: user.email || '', 
            name: profile?.name || user.user_metadata?.name || 'User' 
          }, 
          error: null 
        };
      }
      
      return { user: null, error };
    } catch (error) {
      return { user: null, error };
    }
  },

  async getUserProfile(userId: string): Promise<{ user: User | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, return null without throwing
        if (error.code === 'PGRST116') {
          console.log('Profile not found for user:', userId);
          return { user: null, error: null };
        }
        throw error;
      }

      if (data) {
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          plan: data.plan || 'free',
          documentsAnalyzed: data.documents_analyzed || 0,
          joinDate: new Date(data.join_date)
        };
        return { user, error: null };
      }

      return { user: null, error: null };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { user: null, error };
    }
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          email: updates.email,
        })
        .eq('id', userId);

      if (error) throw error;
      return { data: updates, error: null };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { data: null, error };
    }
  }
};

export const documentService = {
  async uploadDocument(userId: string, document: Omit<LegalDocument, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          name: document.name,
          type: document.type,
          size: document.size,
          upload_date: document.uploadDate.toISOString(),
          content: document.content,
          status: document.status,
        })
        .select()
        .single();

      if (error) throw error;

      const newDocument: LegalDocument = {
        id: data.id,
        name: data.name,
        type: data.type,
        size: data.size,
        uploadDate: new Date(data.upload_date),
        content: data.content,
        status: data.status
      };

      return { document: newDocument, error: null };
    } catch (error) {
      console.error('Upload document error:', error);
      return { document: null, error };
    }
  },

  async getUserDocuments(userId: string): Promise<{ documents: LegalDocument[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false });

      if (error) throw error;

      const documents: LegalDocument[] = data.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        uploadDate: new Date(doc.upload_date),
        content: doc.content,
        status: doc.status
      }));

      return { documents, error: null };
    } catch (error) {
      console.error('Get user documents error:', error);
      return { documents: null, error };
    }
  },

  async updateDocumentStatus(documentId: string, status: LegalDocument['status'], analysisData?: any) {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          status,
          analysis_data: analysisData,
        })
        .eq('id', documentId);

      if (error) throw error;
      return { data: { status, analysisData }, error: null };
    } catch (error) {
      console.error('Update document status error:', error);
      return { data: null, error };
    }
  },

  async deleteDocument(documentId: string) {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete document error:', error);
      return { error };
    }
  }
};

export const chatService = {
  async saveMessage(userId: string, message: Omit<ChatMessage, 'id'>, documentId?: string) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          document_id: documentId || null,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage: ChatMessage = {
        id: data.id,
        role: data.role,
        content: data.content,
        timestamp: new Date(data.timestamp)
      };

      return { message: newMessage, error: null };
    } catch (error) {
      console.error('Save message error:', error);
      return { message: null, error };
    }
  },

  async getChatHistory(userId: string, documentId?: string): Promise<{ messages: ChatMessage[] | null; error: any }> {
    try {
      let query = supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

      if (documentId) {
        query = query.eq('document_id', documentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const messages: ChatMessage[] = data.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));

      return { messages, error: null };
    } catch (error) {
      console.error('Get chat history error:', error);
      return { messages: null, error };
    }
  }
};

export const statsService = {
  async incrementDocumentCount(userId: string) {
    try {
      const { data: currentData } = await supabase
        .from('users')
        .select('documents_analyzed')
        .eq('id', userId)
        .single();

      if (currentData) {
        const { error } = await supabase
          .from('users')
          .update({
            documents_analyzed: (currentData.documents_analyzed || 0) + 1
          })
          .eq('id', userId);

        if (error) throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Increment document count error:', error);
      return { error };
    }
  },

  async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('documents_analyzed, plan, join_date')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        data: {
          documentsAnalyzed: data.documents_analyzed || 0,
          plan: data.plan || 'free',
          joinDate: new Date(data.join_date)
        },
        error: null
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return { data: null, error };
    }
  }
};
