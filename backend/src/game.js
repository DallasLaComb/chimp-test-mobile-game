import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    const { httpMethod, pathParameters, body } = event;
    const path = event.path || event.rawPath;
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };
    
    if (httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    try {
        const requestBody = body ? JSON.parse(body) : {};
        
        // Auth routes
        if (path.includes('/auth/register')) {
            const { email, password } = requestBody;
            const { data, error } = await supabase.auth.signUp({ email, password });
            
            if (error) throw error;
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ user: data.user, session: data.session })
            };
        }
        
        if (path.includes('/auth/login')) {
            console.log('Login attempt for:', requestBody.email);
            const { email, password } = requestBody;
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            console.log('Supabase login result:', { data: !!data, error: error?.message });
            if (error) {
                console.log('Login error:', error);
                throw error;
            }
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ user: data.user, session: data.session })
            };
        }
        
        // Notes routes
        if (path.includes('/notes')) {
            const token = event.headers.Authorization?.replace('Bearer ', '');
            if (!token) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' })
                };
            }
            
            const { data: { user } } = await supabase.auth.getUser(token);
            if (!user) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Invalid token' })
                };
            }
            
            if (httpMethod === 'GET') {
                const { data, error } = await supabase
                    .from('notes')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                    
                if (error) throw error;
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(data)
                };
            }
            
            if (httpMethod === 'POST') {
                const { content } = requestBody;
                const { data, error } = await supabase
                    .from('notes')
                    .insert([{ content, user_id: user.id }])
                    .select();
                    
                if (error) throw error;
                return {
                    statusCode: 201,
                    headers,
                    body: JSON.stringify(data[0])
                };
            }
            
            if (httpMethod === 'DELETE') {
                const noteId = pathParameters?.id;
                const { error } = await supabase
                    .from('notes')
                    .delete()
                    .eq('id', noteId)
                    .eq('user_id', user.id);
                    
                if (error) throw error;
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };
            }
        }
        
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Not found' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};