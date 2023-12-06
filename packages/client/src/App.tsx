import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useUserStore } from './store';
import { GameState, Player, isValidMove } from '@tictac/shared';
import './App.css';

const App = () => {
  const { client, room, state, setRoom, setState } = useUserStore();

  const joinRoom = async () => {
    const newRoom = await client.joinOrCreate<GameState>('battle');

    newRoom.onStateChange((state) => {
      setState(state);
    });

    // newRoom.onMessage("message_type", (message) => {
    //   console.log(client.id, "received on", newRoom.name, message);
    // });

    // newRoom.onError((code, message) => {
    //   console.log(client.id, "couldn't join", newRoom.name);
    // });

    // newRoom.onLeave((code) => {
    //   console.log(client.id, "left", newRoom.name);
    // });

    setRoom(newRoom);
  };

  if (!room || !state) return <button onClick={joinRoom}>{room ? 'Loading...' : 'Join'}</button>;

  return <App2 />;
};

const PlayerInfo = ({ player, isClient, isActive }: { player: Player; isClient: boolean; isActive: boolean }) => {
  const [time, setTime] = useState(-1);

  useEffect(() => {
    setTime(player.timeRemainingMs);
    let intervalId: number;
    if (isActive) {
      intervalId = setInterval(() => {
        setTime((prev) => prev - 100);
      }, 100);
    }
    return () => clearInterval(intervalId);
  }, [isActive, player.timeRemainingMs]);

  const getTimeDisplay = (timeMs: number): string => {
    return Math.ceil(timeMs / 1000).toString();
  };

  return (
    <div>
      P{player.id} {isClient && '(you)'} {player.isConnected ? 'F' : 'L'} {getTimeDisplay(time)}
    </div>
  );
};

const App2 = () => {
  const state = useUserStore((s) => s.state!);
  const room = useUserStore((s) => s.room!);

  const onCellClick = (index: number) => {
    room.send('cell_click', index);
  };

  const player = state.players.get(room.sessionId);

  const players = Array.from(state.players.values());
  const p1 = players[0];
  const p2 = players.length > 1 ? players[1] : undefined;
  const isActive = state.activePlayerId === player?.id;

  if (!p2) {
    return <div>Waiting for p2...</div>;
  }

  return (
    <div className={clsx('wrapper', isActive && 'active')}>
      <div className="player-info">
        <PlayerInfo player={p1} isClient={player?.id === p1.id} isActive={state.activePlayerId === p1.id} />
        {p2 && <PlayerInfo player={p2} isClient={player?.id === p2.id} isActive={state.activePlayerId === p2.id} />}
      </div>
      <div className="board">
        {state.board.map((v, index) => {
          const isValid = isValidMove(index, state.board);
          return (
            <div
              key={index}
              className={clsx('cell', isValid && isActive && 'valid')}
              onClick={() => onCellClick(index)}
            >
              {v}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
