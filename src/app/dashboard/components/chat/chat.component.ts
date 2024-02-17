// src/app/components/chat/chat.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { AuthenticatedUserInterface } from 'src/app/interfaces/authenticated-user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private socketService: SocketService) {}
  private messageService = inject(MessagesService);
  public user!: AuthenticatedUserInterface;
  private authService = inject(AuthService);


  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if(user) this.user = user;
    this.loadMessages();
    this.scrollToBottom();
    this.socketService.connect();
    this.socketService.onMessage().subscribe((message: any) => {
      console.log('here');
      this.messages.push(message);
    });
  }

  loadMessages() {
    this.messageService.getAll().subscribe({
      next: (res) => {
        if (res.data) this.messages = res.data;
        console.log(res.data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(): void {
    // Verifica si hay un mensaje para enviar
    if (!this.newMessage.trim()) {
      return; // No hacer nada si el mensaje está vacío o solo contiene espacios
    }
  
    this.socketService.sendMessage({
      message: this.newMessage.trim(),
      user: this.user.id, 
    });
  
    this.newMessage = ''; // Limpia el campo de entrada después de enviar
  
    // Coloca el desplazamiento hacia abajo en un timeout para dar tiempo a que el mensaje se agregue al DOM
    setTimeout(() => this.scrollToBottom(), 10);
  }
  

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
