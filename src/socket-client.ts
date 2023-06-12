import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = ( token: string) => {

    const manager = new Manager("https://test-shop-nestjs.fly.dev/socket.io/socket.io.js", {
        extraHeaders: {
            hola: "mundo",
            authentication: token
        }
    });

    socket?.removeAllListeners();
    socket = manager.socket("/");
4
    addListeners();

}

const addListeners = () => {

    const serverStatusLabel = document.querySelector("#label")!;
    const clientsUl = document.querySelector("#clients-ul")!;
    const messageForm = document.querySelector("#message-form")!;
    const messageInput = document.querySelector<HTMLInputElement>("#message-input")!;
    const messageReceivedUl = document.querySelector<HTMLUListElement>("#messages-ul")!;
    
    socket.on("connect", () => {
        serverStatusLabel.innerHTML = "connected";
    });

    socket.on("disconnect", () => {
        serverStatusLabel.innerHTML = "disconnected";
    });

    socket.on("clients-updated", ( clients: string[] ) => {

        let clientsHtml = "";

        clients.forEach( ( clientId: string ) => {
            clientsHtml += `
                <li>${ clientId }</li>
            `;
        });

        clientsUl.innerHTML = clientsHtml;
    });

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if ( messageInput.value.trim().length <= 0 ) return;

        socket.emit("message-from-client", {
            id: "YO",
            message: messageInput.value
        });

        messageInput.value = "";

    })

    socket.on("message-from-server", ( payload: { message:string, fullName:string}) => {
        const newMessage = `
        <li>
            <b>${ payload.fullName }: </b>
            <span>${ payload.message }</span>
        </li>
        `;
        const li = document.createElement("li");
        li.innerHTML = newMessage;

        messageReceivedUl.append( li );
        
    });
    
}