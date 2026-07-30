const ROLES = {
  MAFIA: { id: 'mafia', name: 'Mafia', ink: '#8b0000', iconName: 'Flame', desc: "Eliminate the town." },
  VILLAGER: { id: 'villager', name: 'Villager', ink: '#2b2b2b', iconName: 'Eye', desc: "Find the guilty." },
  DOCTOR: { id: 'doctor', name: 'Doctor', ink: '#005b96', iconName: 'Heart', desc: "Protect the innocent." },
  DETECTIVE: { id: 'detective', name: 'Detective', ink: '#4a4a4a', iconName: 'Search', desc: "Investigate suspects." },
  JESTER: { id: 'jester', name: 'Jester', ink: '#5e3a8c', iconName: 'VenetianMask', desc: "Get yourself arrested." }
};

const rooms = {};
const roomTimers = {};

function parseTimeStr(timeStr) {
    if (!timeStr || timeStr === 'inf') return null;
    if (timeStr.endsWith('s')) return parseInt(timeStr) * 1000;
    if (timeStr.endsWith('m')) return parseInt(timeStr) * 60000;
    return 60000;
}

const createRoom = (roomId, theme = '1930s') => ({
  id: roomId,
  theme,
  state: 'lobby',
  players: [],
  settings: {
    mafia: 1, doctor: 1, detective: 1, jester: 1,
    discussionTime: '3m', nightTime: '30s', revealOnDeath: false,
    nightOrder: 'doc-det-maf', doctorSelfHeal: true,
    jesterWin: 'end', detectiveSees: 'alignment',
    anonVoting: false, tieVote: 'nothing', skipVote: true
  },
  notes: [{ id: 1, text: "CASE OPENED. Suspects gathered.", time: "12:00 AM", isSystem: true }],
  nightActions: {},
  votes: {},
  revealData: null,
  winner: null,
  transitionText: '',
  phaseEndTime: null,
  skipDiscussionVotes: [],
});

function addNote(room, text, isSystem = false, author = 'SYS') {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  room.notes.push({ id: Date.now() + Math.random(), text, time, isSystem, author });
}

function triggerTransition(io, room, text, nextState, delay = 5000) {
  console.log(`[${room.id}] triggerTransition to ${nextState} with text: ${text}`);
  room.transitionText = text;
  room.state = 'transition';
  room.nextState = nextState;
  room.phaseEndTime = null;
  io.to(room.id).emit('room_update', room);
  
  if (roomTimers[room.id]) { clearTimeout(roomTimers[room.id]); delete roomTimers[room.id]; }

  setTimeout(() => {
    console.log(`[${room.id}] Transition delay finished. Next state: ${nextState}`);
    room.state = nextState;
    room.transitionText = '';
    if (nextState === 'night') room.nightActions = {};
    if (nextState === 'day_voting') room.votes = {};
    if (nextState === 'day_discussion') room.skipDiscussionVotes = [];
    
    let timerMs = null;
    if (nextState === 'day_discussion' && room.settings.discussionTime !== 'inf') {
        timerMs = parseTimeStr(room.settings.discussionTime);
    } else if (nextState === 'night') {
        timerMs = parseTimeStr(room.settings.nightTime);
    } else if (nextState === 'day_voting') {
        timerMs = 60000; // 60s fallback for voting
    }
    
    if (timerMs) {
        room.phaseEndTime = Date.now() + timerMs;
        roomTimers[room.id] = setTimeout(() => {
            if (rooms[room.id] && rooms[room.id].state === nextState) {
                advancePhase(io, room);
            }
        }, timerMs);
    } else {
        room.phaseEndTime = null;
    }

    io.to(room.id).emit('room_update', room);
    
    // Check if we should auto-advance immediately (e.g. no human players for this phase)
    checkAutoAdvance(io, room);
  }, delay);
}

function checkAutoAdvance(io, room) {
    console.log(`[${room.id}] checkAutoAdvance for state: ${room.state}`);
    if (room.state === 'night') {
        const aliveHumanPRs = room.players.filter(p => !p.isDead && !p.isBot && p.role && ['mafia', 'doctor', 'detective'].includes(p.role.id));
        const allActed = aliveHumanPRs.every(p => room.nightActions[p.id] !== undefined);
        console.log(`[${room.id}] Night auto-advance check: allActed=${allActed}, alivePRs=${aliveHumanPRs.length}`);
        if (allActed || aliveHumanPRs.length === 0) {
            advancePhase(io, room);
        }
    } else if (room.state === 'day_voting') {
        const aliveHumans = room.players.filter(p => !p.isDead && !p.isBot);
        const allVoted = aliveHumans.every(p => room.votes[p.id] !== undefined);
        console.log(`[${room.id}] Voting auto-advance check: allVoted=${allVoted}, aliveHumans=${aliveHumans.length}`);
        if (allVoted || aliveHumans.length === 0) {
            advancePhase(io, room);
        }
    } else if (room.state === 'day_discussion') {
        const aliveHumans = room.players.filter(p => !p.isDead && !p.isBot);
        if (aliveHumans.length === 0) {
            console.log(`[${room.id}] Discussion auto-advance: No humans left, skipping to voting.`);
            triggerTransition(io, room, "THE DELIBERATION ENDS.\nTIME TO VOTE.", "day_voting", 1000);
        }
    }
}

function checkWinCondition(room) {
    if (room.winner) return; // already decided
    const aliveMafia = room.players.filter(p => p.role?.id === 'mafia' && !p.isDead).length;
    const totalAlive = room.players.filter(p => !p.isDead).length;
    const nonMafia = totalAlive - aliveMafia;
    
    if (aliveMafia === 0) {
        room.winner = { team: 'TOWN', text: "The town is finally safe." };
        room.state = 'game_over';
    } else if (aliveMafia >= nonMafia) {
        room.winner = { team: 'MAFIA', text: "The family controls the streets." };
        room.state = 'game_over';
    }
}

function simulateBotActions(room) {
    if (room.state === 'night') {
        room.players.filter(p => p.isBot && !p.isDead).forEach(bot => {
            if (!bot.role) return;
            let validTargets = room.players.filter(p => !p.isDead);
            
            if (bot.role?.id === 'mafia') {
                validTargets = validTargets.filter(p => p.role?.id !== 'mafia');
            }
            
            if (validTargets.length > 0 && !room.nightActions[bot.id]) {
                const target = validTargets[Math.floor(Math.random() * validTargets.length)];
                room.nightActions[bot.id] = target.id;
            }
        });
    } else if (room.state === 'day_voting') {
        room.players.filter(p => p.isBot && !p.isDead).forEach(bot => {
            const validTargets = room.players.filter(p => !p.isDead && p.id !== bot.id);
            if (Math.random() < 0.2 && room.settings.skipVote) return;
            
            if (validTargets.length > 0 && !room.votes[bot.id]) {
                const target = validTargets[Math.floor(Math.random() * validTargets.length)];
                room.votes[bot.id] = target.id;
            }
        });
    }
}

function advancePhase(io, room) {
  console.log(`[${room.id}] advancePhase called from state: ${room.state}`);
  if (roomTimers[room.id]) { clearTimeout(roomTimers[room.id]); delete roomTimers[room.id]; }
  room.phaseEndTime = null;
  simulateBotActions(room);
  
  if (room.state === 'night') {
      const mafiaIds = room.players.filter(p => p.role?.id === 'mafia' && !p.isDead).map(p => p.id);
      const doctorIds = room.players.filter(p => p.role?.id === 'doctor' && !p.isDead).map(p => p.id);
      
      let killedId = null;
      for (const mid of mafiaIds) {
          if (room.nightActions[mid]) killedId = room.nightActions[mid];
      }
      
      let savedIds = doctorIds.map(did => room.nightActions[did]).filter(Boolean);
      
      let victim = null;

      if (killedId && !savedIds.includes(killedId)) {
        victim = room.players.find(p => p.id === killedId);
        if (victim) {
            victim.isDead = true;
            checkWinCondition(room);
        }
      }

      room.nightActions = {};

      if (victim) {
        room.revealData = {
          type: 'death',
          title: "CORONER'S REPORT",
          victim: victim,
          text: `${victim.name} was found dead in an alleyway. Cause: Lead poisoning.`
        };
        if (!room.settings.revealOnDeath) {
           room.revealData.victim = { ...victim, role: { name: 'UNKNOWN', iconName: 'Skull' }};
        }
        addNote(room, `${victim.name} was murdered.`, true);
        io.to(room.id).emit('room_update', room);
      } else {
        triggerTransition(io, room, "MORNING BREAKS. NO CASUALTIES.", "day_discussion");
        addNote(room, "A quiet night in the city.", true);
      }
  } 
  else if (room.state === 'day_discussion') {
    triggerTransition(io, room, "THE DELIBERATION ENDS.\nTIME TO VOTE.", "day_voting", 5000);
  }
  else if (room.state === 'day_voting') {
    const voteCounts = {};
    Object.values(room.votes).forEach(targetId => {
        voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    });
    
    let lynchedId = null;
    let maxVotes = 0;
    for (const [targetId, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) { maxVotes = count; lynchedId = targetId === 'skip' ? 'skip' : parseInt(targetId); }
    }

    const tied = Object.values(voteCounts).filter(c => c === maxVotes).length > 1;
    if (tied && room.settings.tieVote === 'nothing') {
        lynchedId = null;
    }

    if (lynchedId === 'skip') {
      addNote(room, "The precinct chose to skip voting. No one was arrested.", true);
      triggerTransition(io, room, "NIGHT FALLS...", "night");
    } else if (lynchedId) {
      const victim = room.players.find(p => p.id === lynchedId);
      victim.isDead = true;
      addNote(room, `The precinct locked up ${victim.name}.`, true);
      
      if (victim.role?.id === 'jester') {
          room.winner = { team: 'JESTER', text: "The Con Artist fooled everyone. Absolute chaos." };
          if (room.settings.jesterWin === 'end') {
              room.state = 'game_over';
          } else {
              room.winner = null; // null it out so game continues
              addNote(room, `The Jester won, but the game continues!`, true);
          }
      }

      checkWinCondition(room);

      room.revealData = {
        type: 'lynch',
        title: "CASE CLOSED (ARREST)",
        victim: victim,
        text: `${victim.name} was voted out and locked away.`
      };
      if (!room.settings.revealOnDeath) {
           room.revealData.victim = { ...victim, role: { name: 'UNKNOWN', iconName: 'Skull' }};
      }
      
      io.to(room.id).emit('room_update', room);
    } else {
      addNote(room, "Hung jury. No one was arrested.", true);
      triggerTransition(io, room, "NIGHT FALLS...", "night");
    }
    room.votes = {};
  }
}

export const setupGameLogic = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_room', ({ roomId, playerName, isBotMode, theme, playerId, deviceId }) => {
      socket.join(roomId);
      if (!rooms[roomId]) {
        rooms[roomId] = createRoom(roomId, theme || '1930s');
        if (isBotMode) rooms[roomId].isBotMode = true;
      }
      
      const room = rooms[roomId];
      
      // If player already in room by name, reconnect them
      let existingPlayer = room.players.find(p => p.name === playerName);
      if (existingPlayer) {
          if (deviceId && existingPlayer.deviceId === deviceId) {
              existingPlayer.socketId = socket.id;
              socket.emit('player_id', existingPlayer.id);
          } else {
              socket.emit('error', 'IDENTITY THEFT DETECTED: This alias is already registered in the active roster. Choose another.');
              return;
          }
      } else {
         if (room.state !== 'lobby') {
             socket.emit('error', 'Game has already started.');
             return;
         }
         const maxId = room.players.reduce((max, p) => Math.max(max, p.id), 0);
         const playerId = maxId + 1;
         const rot = Math.floor(Math.random() * 12) - 6;
         const newPlayer = {
           id: playerId,
           name: playerName || `Player ${playerId}`,
           socketId: socket.id,
           deviceId: deviceId || 'unknown',
           isDead: false,
           isReady: false,
           rot,
           role: null
         };
         room.players.push(newPlayer);
         socket.emit('player_id', playerId);
      }
      io.to(roomId).emit('room_update', room);
    });

    socket.on('update_settings', ({ roomId, settings }) => {
      if (rooms[roomId]) {
        rooms[roomId].settings = settings;
        io.to(roomId).emit('room_update', rooms[roomId]);
      }
    });

    socket.on('add_bot', ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return;
      const maxId = room.players.reduce((max, p) => Math.max(max, p.id), 0);
      const botId = maxId + 1;
      room.players.push({
         id: botId,
         name: `Bot ${botId}`,
         socketId: `bot_${botId}`,
         isDead: false,
         isReady: true,
         rot: Math.floor(Math.random() * 12) - 6,
         isBot: true,
         role: null
      });
      io.to(roomId).emit('room_update', room);
    });

    socket.on('start_game', ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return;
      
      const allReady = room.players.every(p => p.isReady);
      if (!allReady) return;

      const specifiedRoles = room.settings.mafia + room.settings.doctor + room.settings.detective + room.settings.jester;
      const totalRoles = room.isBotMode ? Math.max(room.players.length, specifiedRoles) : room.players.length;
      if (room.isBotMode) {
          while (room.players.length < totalRoles) {
             const maxId = room.players.reduce((max, p) => Math.max(max, p.id), 0);
             const botId = maxId + 1;
             room.players.push({
                 id: botId,
                 name: `Bot ${botId}`,
                 socketId: `bot_${botId}`,
                 isDead: false,
                 isReady: true,
                 rot: Math.floor(Math.random() * 12) - 6,
                 isBot: true,
                 role: null
             });
          }
      }

      const pool = [];
      for(let i=0; i<room.settings.mafia; i++) pool.push(ROLES.MAFIA);
      for(let i=0; i<room.settings.doctor; i++) pool.push(ROLES.DOCTOR);
      for(let i=0; i<room.settings.detective; i++) pool.push(ROLES.DETECTIVE);
      for(let i=0; i<room.settings.jester; i++) pool.push(ROLES.JESTER);
      
      const remaining = room.players.length - pool.length;
      for(let i=0; i<remaining; i++) pool.push(ROLES.VILLAGER);
      
      pool.sort(() => Math.random() - 0.5);

      room.players.forEach((p, idx) => {
        p.role = pool[idx] || ROLES.VILLAGER;
      });

      room.state = 'dossier';
      room.notes = [{ id: 1, text: "CASE OPENED. Suspects gathered.", time: "12:00 AM", isSystem: true }];
      io.to(roomId).emit('room_update', room);
    });

    socket.on('open_case', ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return;
      addNote(room, "The lights go out. The city sleeps.", true);
      triggerTransition(io, room, "NIGHT FALLS ON THE CITY...", "night");
    });

    socket.on('add_note', ({ roomId, playerId, text }) => {
       const room = rooms[roomId];
       if (!room) return;
       const player = room.players.find(p => p.id === playerId);
       if (player) {
         addNote(room, text, false, player.name);
         io.to(roomId).emit('room_update', room);
       }
    });

    socket.on('action', ({ roomId, playerId, targetId }) => {
      const room = rooms[roomId];
      if (!room) return;

      if (room.state === 'night') {
        room.nightActions[playerId] = targetId;
        const player = room.players.find(p => p.id === playerId);
        const target = room.players.find(p => p.id === targetId);
        
        if (player.role?.id === 'detective') {
          const isMafia = target.role?.id === 'mafia';
          let text = `${target.name} is ${isMafia ? 'GUILTY (Mafia)' : 'CLEARED (Not Mafia)'}`;
          if (room.settings.detectiveSees === 'exact') text = `${target.name} is ${target.role?.name}`;
          
          socket.emit('private_reveal', {
            type: 'investigation',
            title: "INVESTIGATION FILED",
            text
          });
        }
      } else if (room.state === 'day_voting') {
        room.votes[playerId] = targetId;
      }
      
      io.to(roomId).emit('room_update', room);
      checkAutoAdvance(io, room);
    });

    socket.on('skip_discussion', ({ roomId, playerId }) => {
      const room = rooms[roomId];
      if (!room || room.state !== 'day_discussion') return;

      if (!room.skipDiscussionVotes.includes(playerId)) {
          room.skipDiscussionVotes.push(playerId);
      }

      const aliveHumans = room.players.filter(p => !p.isDead && !p.isBot);
      const allSkipped = aliveHumans.every(p => room.skipDiscussionVotes.includes(p.id));

      if (allSkipped && aliveHumans.length > 0) {
          triggerTransition(io, room, "THE DELIBERATION ENDS. TIME TO VOTE.", "day_voting");
      } else {
          io.to(roomId).emit('room_update', room);
      }
    });

    socket.on('advance_phase', ({ roomId }) => {
       const room = rooms[roomId];
       if (!room) return;
       advancePhase(io, room);
    });
    
    socket.on('continue_report', ({ roomId }) => {
        const room = rooms[roomId];
        if (!room) return;
        
        room.revealData = null;
        if (room.winner) {
            room.state = 'game_over';
            io.to(roomId).emit('room_update', room);
        } else {
            const nextState = room.state === 'night' ? 'day_discussion' : 'night';
            triggerTransition(io, room, nextState === 'night' ? "NIGHT FALLS..." : "MORNING BREAKS...", nextState);
        }
    });

    socket.on('return_to_lobby', ({ roomId }) => {
        const room = rooms[roomId];
        if (!room) return;
        
        room.state = 'lobby';
        room.winner = null;
        room.revealData = null;
        room.notes = [];
        room.votes = {};
        room.nightActions = {};
        room.transitionText = '';
        
        room.players.forEach(p => {
            p.role = null;
            p.isDead = false;
            if (!p.isBot) p.isReady = false;
        });
        
        io.to(roomId).emit('room_update', room);
    });

    socket.on('toggle_ready', ({ roomId, playerId }) => {
        console.log('Toggle ready called:', { roomId, playerId, type: typeof playerId });
        const room = rooms[roomId];
        if (!room) return;
        const player = room.players.find(p => p.id == playerId); // use loose equality
        if (player) {
            player.isReady = !player.isReady;
            io.to(roomId).emit('room_update', room);
        } else {
            console.log('Player not found!');
        }
    });

    socket.on('remove_player', ({ roomId, targetId }) => {
        const room = rooms[roomId];
        if (!room) return;
        room.players = room.players.filter(p => p.id !== targetId);
        io.to(roomId).emit('room_update', room);
    });
  });
};
