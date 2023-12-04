import { Room } from "colyseus";

export class BattleRoom extends Room {
  onCreate(options) {
    console.log("created battle room");

    this.onMessage("cell_click", (client, index: number) => {
      console.log(client.sessionId, "sent 'action' message: ", index);
    });
  }

  onJoin(client, options) {
    console.log("joined battle room");
    if (options.mode === "duo") {
      // put this player into a team!
    }
  }

  onLeave() {
    console.log("left battle room");
  }
}
