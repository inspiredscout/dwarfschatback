from datetime import datetime
from uuid import UUID

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from fastapi.responses import HTMLResponse

from app.deps.db import CurrentAsyncSession
from app.repo.message_repo import MessageRepo
from app.schemas.message import MessageCreate
from app.models.message import Message

router = APIRouter(prefix="/chat")
html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="connectToRoom(event)">
            <input type="text" id="clientId" placeholder="Enter your client ID" autocomplete="off"/>
            <input type="text" id="roomNumber" placeholder="Enter room number" autocomplete="off"/>
            <button>Connect</button>
        </form>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws;

            function connectToRoom(event) {
                var clientId = document.getElementById("clientId").value
                var roomNumber = document.getElementById("roomNumber").value
                ws = new WebSocket(`ws://localhost:8001/api/v1/chat/ws/${roomNumber}/${clientId}`);
                ws.onmessage = function(event) {
                    var messages = document.getElementById('messages')
                    var message = document.createElement('li')
                    var content = document.createTextNode(event.data)
                    message.appendChild(content)
                    messages.appendChild(message)
                };
                event.preventDefault()
            }

            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: UUID):
        # Close the old connection if it exists
        if websocket in self.active_connections.get(room_id, []):
            await websocket.close()
        await websocket.accept()
        # Disconnect from all other rooms
        self.disconnect_from_all_rooms(websocket)
        if room_id in self.active_connections:
            self.active_connections[room_id].append(websocket)
        else:
            self.active_connections[room_id] = [websocket]

    def disconnect(self, websocket: WebSocket, room_id: UUID):
        if room_id in self.active_connections and websocket in self.active_connections[room_id]:
            self.active_connections[room_id].remove(websocket)

    def disconnect_from_all_rooms(self, websocket: WebSocket):
        for room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, room_id: UUID, client_id: UUID):
        for connection in self.active_connections[room_id]:
            await connection.send_text(message)


manager = ConnectionManager()


@router.websocket("/ws/{room_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: UUID, room_id: UUID, session: CurrentAsyncSession):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Client #{client_id} sent: {data}")
            print(f"Room #{room_id}")

            await manager.broadcast(message=data, room_id=room_id, client_id=client_id)
            message_repo: MessageRepo = MessageRepo(session)

            await message_repo.save_message(user_id=client_id, content=data, chat_id=room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast(f"Client #{client_id} left the chat", room_id,
                                client_id)
        try:
            await websocket.close()
        except RuntimeError:
            pass


@router.get("/main")
async def get(session: CurrentAsyncSession):
    message_repo: MessageRepo = MessageRepo(session)

    res = await message_repo.check_con()
    print(res)
    return HTMLResponse(html)
