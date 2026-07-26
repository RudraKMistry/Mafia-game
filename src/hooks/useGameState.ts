import { useState, useEffect } from 'react';
import { socket } from '../socket';

export function useGameState(roomId: string | undefined) {
  // Game State from Server
  const [room, setRoom] = useState<any>(null);
  
  // Interactivity
  const [playerId, setPlayerId] = useState<number>(Number(localStorage.getItem('mafia_playerId')) || 1);
  
  // Local UI state (private reveals specific to this client)
  const [privateReveal, setPrivateReveal] = useState<any>(null);

  useEffect(() => {
    if (!roomId) return;
    const playerName = localStorage.getItem('mafia_playerName') || 'Anon';
    socket.emit('join_room', { roomId, playerName });
    
    const onPlayerId = (id: number) => {
      setPlayerId(id);
      localStorage.setItem('mafia_playerId', id.toString());
    };

    const onRoomUpdate = (data: any) => {
      setRoom(data);
    };
    
    const onPrivateReveal = (data: any) => {
        setPrivateReveal(data);
    };

    socket.on('player_id', onPlayerId);
    socket.on('room_update', onRoomUpdate);
    socket.on('private_reveal', onPrivateReveal);

    return () => {
      socket.off('player_id', onPlayerId);
      socket.off('room_update', onRoomUpdate);
      socket.off('private_reveal', onPrivateReveal);
    };
  }, [roomId]);

  const addNote = (text: string) => {
    socket.emit('add_note', { roomId, playerId, text });
  };

  const startGame = () => {
    socket.emit('open_case', { roomId });
  };

  const handleStampAction = (targetId: number | string) => {
    socket.emit('action', { roomId, playerId, targetId });
  };

  const advancePhase = () => {
    socket.emit('advance_phase', { roomId });
  };
  
  const skipDiscussion = () => {
    socket.emit('skip_discussion', { roomId, playerId });
  };
  
  const continueReport = () => {
    socket.emit('continue_report', { roomId });
  }

  const returnToLobby = () => {
    socket.emit('return_to_lobby', { roomId });
  }

  return {
    room,
    playerId,
    privateReveal,
    setPrivateReveal,
    addNote,
    startGame,
    handleStampAction,
    advancePhase,
    skipDiscussion,
    continueReport,
    returnToLobby
  };
}
