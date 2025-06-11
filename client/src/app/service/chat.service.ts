import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Message {
  role: string;
  content: string;
}

interface ChatResponse {
  choices: {
    message: Message;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) { }

  sendMessage(messages: Message[]): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { messages });
  }
}
