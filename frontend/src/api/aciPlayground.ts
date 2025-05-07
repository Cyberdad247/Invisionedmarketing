import { api } from './client';

interface Session {
  session_id: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SendMessageResponse {
  message: Message;
}

// Assuming the API client wraps the response in a 'data' property
interface ApiResponse<T> {
  data: T;
}

export const aciPlaygroundApi = {
  createSession: () => api.post<ApiResponse<Session>>('/api/aci/playground/sessions'),
  sendMessage: (sessionId: string, content: string) =>
    api.post<ApiResponse<SendMessageResponse>>(`/api/aci/playground/sessions/${sessionId}/messages`, { content }),
  getHistory: (sessionId: string) => api.get<ApiResponse<Message[]>>(`/api/aci/playground/sessions/${sessionId}/history`),
};