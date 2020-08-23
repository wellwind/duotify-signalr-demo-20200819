import { Component } from '@angular/core';
import {
  DefaultHttpClient,
  HttpRequest,
  HttpResponse,
  HubConnectionBuilder,
  ILogger,
} from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = '';
  message = '';
  connection = new HubConnectionBuilder()
    .withUrl('/chathub', { accessTokenFactory: () => '1234' })
    .build();

  messages: { name: string; message: string }[] = [];

  connect(): void {
    const t = new HttpResponse(200);
    this.connection.start().then(() => {
      this.connection.on('ReceiveMessage', (name, message) => {
        this.messages = [...this.messages, { name, message }];
      });
    });
  }

  sendMessage(): void {
    this.connection.invoke('SendMessage', this.name, this.message);
  }
}

export class MyClient extends DefaultHttpClient {
  constructor(logger: ILogger) {
    super(logger);
  }

  public send(request: HttpRequest): Promise<HttpResponse> {
    return super.send({
      ...request,
      headers: { ...request.headers, Hello: 'world' },
    });
  }
}
