import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../service/chat.service';

interface Message {
  role: string;
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  messages: Message[] = [];
  userInput = '';
  shouldScroll = false;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    // Initialize with a welcome message
    this.messages.push({
      role: 'assistant',
      content: 'Hello! How can I assist you today?'
    });
    this.shouldScroll = true;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: this.userInput
    };
    this.messages.push(userMessage);
    this.userInput = '';
    this.shouldScroll = true;

    // Call the service
    this.chatService.sendMessage(this.messages).subscribe({
      next: (response: any) => {
        const assistantMessage = response.choices[0].message;
        this.messages.push(assistantMessage);
        this.shouldScroll = true;
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        });
        this.shouldScroll = true;
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error while scrolling:', err);
    }
  }
}
