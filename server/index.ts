import { Server } from "colyseus";
import { BattleRoom } from "./rooms/BattleRoom";
const port = process.env.port || 3000;

const gameServer = new Server();

gameServer.define("battle", BattleRoom).enableRealtimeListing();

gameServer.listen(Number(port));
