import { useEffect, useState } from "react";
import "./App.css";

import { Client, Room } from "colyseus.js";
import { useUserStore } from "./store";

const App = () => {
  const { client, setClient } = useUserStore();

  useEffect(() => {
    if (!client) {
      console.log("setting client");
      setClient(new Client("ws://localhost:3000"));
    }
  }, [client, setClient]);

  if (!client) return <>No Client</>;

  return <App2 />;
};

const App2 = () => {
  const { client, room, setRoom } = useUserStore();

  useEffect(() => {
    const joinRoom = async () => {
      console.log("in room join");
      const newRoom = await client!.joinOrCreate("battle");
      console.log(newRoom.sessionId, "joined", newRoom.name);

      newRoom.onStateChange((state) => {
        console.log(newRoom.name, "has new state:", state);
      });

      newRoom.onMessage("message_type", (message) => {
        console.log(client.id, "received on", newRoom.name, message);
      });

      newRoom.onError((code, message) => {
        console.log(client.id, "couldn't join", newRoom.name);
      });

      newRoom.onLeave((code) => {
        console.log(client.id, "left", newRoom.name);
      });

      setRoom(newRoom);
      console.log("room join");
    };
    if (!room) {
      joinRoom();
    }
  }, [client, room, setRoom]);

  if (!room) return <>No Room</>;

  return <App3 />;
};

function App3() {
  const { room } = useUserStore();

  const [vals, setVals] = useState<string[]>(Array(9).fill(""));

  const onCellClick = (index: number) => {
    room!.send("cell_click", index);
  };

  // const updateCell = (indexToUpdate: number) => {
  //   setVals((prev) =>
  //     prev.map((item, index) => (index === indexToUpdate ? "X" : item))
  //   );
  // };

  return (
    <div className="board">
      {vals.map((v, index) => (
        <div className="cell" onClick={() => onCellClick(index)}>
          {v}
        </div>
      ))}
    </div>
  );
}

export default App;
