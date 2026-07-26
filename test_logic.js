import { setupGameLogic } from './gameLogic.js';

const mockSockets = [];
let emittedEvents = [];

const io = {
    on: (event, cb) => {
        if (event === 'connection') {
            io.connect = cb;
        }
    },
    to: (roomId) => ({
        emit: (event, data) => {
            emittedEvents.push({ roomId, event, data });
            // console.log(`[Emitted to ${roomId}]`, event);
        }
    })
};

setupGameLogic(io);

function createMockSocket(id) {
    const s = {
        id,
        listeners: {},
        join: (room) => { /* console.log(id, 'joined', room) */ },
        on: (event, cb) => { s.listeners[event] = cb; },
        emit: (event, data) => {
            emittedEvents.push({ socketId: id, event, data });
        },
        send: (event, data) => {
            if (s.listeners[event]) s.listeners[event](data);
        }
    };
    io.connect(s);
    return s;
}

async function runTest() {
    console.log("Starting game logic tests...");
    
    // 1. Host creates room
    const host = createMockSocket('host1');
    host.send('join_room', { roomId: 'TEST1', playerName: 'Host', isBotMode: false, theme: 'edo', playerId: null, deviceId: 'dev_host' });
    
    // 2. Player 2 joins
    const p2 = createMockSocket('p2');
    p2.send('join_room', { roomId: 'TEST1', playerName: 'Player2', isBotMode: false, theme: 'edo', playerId: null, deviceId: 'dev_p2' });

    // 2b. Player 3 tries to join with same name 'Player2' but different deviceId (Identity Theft)
    console.log("TEST: Identity Theft with same name");
    const p3 = createMockSocket('p3');
    p3.send('join_room', { roomId: 'TEST1', playerName: 'Player2', isBotMode: false, theme: 'edo', playerId: 2, deviceId: 'dev_p3' });
    const p3Errors = emittedEvents.filter(e => e.socketId === 'p3' && e.event === 'error');
    if (!p3Errors.some(e => e.data.includes('IDENTITY THEFT DETECTED'))) {
        console.error("TEST FAILED: Identity theft was not blocked!");
        process.exit(1);
    }
    
    // 2c. Player 2 reconnects correctly with matching deviceId
    console.log("TEST: Correct Reconnect");
    const p2_reconnect = createMockSocket('p2_reconnect');
    p2_reconnect.send('join_room', { roomId: 'TEST1', playerName: 'Player2', isBotMode: false, theme: 'edo', playerId: 2, deviceId: 'dev_p2' });
    const p2ReconnectSuccess = emittedEvents.filter(e => e.socketId === 'p2_reconnect' && e.event === 'player_id');
    if (p2ReconnectSuccess.length === 0) {
        console.error("TEST FAILED: Correct reconnect failed!");
        process.exit(1);
    }

    // 3. Start game as host
    host.send('toggle_ready', { roomId: 'TEST1', playerId: 1 });
    p2.send('toggle_ready', { roomId: 'TEST1', playerId: 2 });
    
    // 4. Add bots and start
    host.send('add_bot', { roomId: 'TEST1' });
    host.send('add_bot', { roomId: 'TEST1' });
    host.send('start_game', { roomId: 'TEST1' });
    
    // 5. Open case (goes to night)
    host.send('open_case', { roomId: 'TEST1' });
    
    // 6. Test late joiner (should be blocked)
    console.log("TEST: Late joiner blocked");
    const late = createMockSocket('late');
    late.send('join_room', { roomId: 'TEST1', playerName: 'LateBot', isBotMode: false, theme: 'edo', playerId: null, deviceId: 'dev_late' });
    
    const errors = emittedEvents.filter(e => e.event === 'error');
    console.log("Errors emitted (should contain 'Game has already started.'):", errors);
    
    if (!errors.some(e => e.data === 'Game has already started.')) {
        console.error("TEST FAILED: Late joiner was not blocked!");
        process.exit(1);
    }
    
    // 7. Advance phases manually to test timer logic
    console.log("TEST: Manual transition day_voting -> night");
    host.send('action', { roomId: 'TEST1', playerId: 1, targetId: 'skip' });
    p2.send('action', { roomId: 'TEST1', playerId: 2, targetId: 'skip' });
    // Bot actions are simulated in advancePhase.
    host.send('advance_phase', { roomId: 'TEST1' }); 

    console.log("TEST: Continue report");
    host.send('continue_report', { roomId: 'TEST1' }); // This should transition if revealData exists
    
    // Simulate game over check
    console.log("TEST: Return to lobby");
    host.send('return_to_lobby', { roomId: 'TEST1' });

    console.log("All manual tests passed without crashing.");
}

runTest().catch(console.error);
