export class WebSocketClient {
  private static clients: Set<any> = new Set();

  public static addClient(client: any) {
    WebSocketClient.clients.add(client);
  }

  public static removeClient(client: any) {
    WebSocketClient.clients.delete(client);
  }

  public static broadcast(message: string) {
    WebSocketClient.clients.forEach((client) => {
      client.send(message);
    });
  }
}
