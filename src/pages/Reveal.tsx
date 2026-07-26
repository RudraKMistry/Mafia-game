import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';
import './Reveal.css';

export default function Reveal() {
  const navigate = useNavigate();

  // Mock end game data
  const winnerTeam: string = 'Town'; // 'Mafia', 'Town', 'Jester'
  const players = [
    { id: 1, name: 'You (Host)', role: 'Doctor', team: 'Town', status: 'Alive' },
    { id: 2, name: 'Alice', role: 'Mafia', team: 'Mafia', status: 'Dead' },
    { id: 3, name: 'Bob', role: 'Villager', team: 'Town', status: 'Alive' },
    { id: 4, name: 'Charlie', role: 'Jester', team: 'Solo', status: 'Dead' },
    { id: 5, name: 'Diana', role: 'Detective', team: 'Town', status: 'Alive' },
  ];

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className="container reveal-container animate-fade-in">
      <div className="reveal-header">
        <Trophy size={64} className={`winner-icon ${winnerTeam.toLowerCase()}`} />
        <h1 className={`winner-title ${winnerTeam.toLowerCase()}`}>
          {winnerTeam === 'Town' && 'The Town Survived!'}
          {winnerTeam === 'Mafia' && 'The Mafia Took Over!'}
          {winnerTeam === 'Jester' && 'The Jester Fooled Everyone!'}
        </h1>
        <p>The truth has finally come to light.</p>
      </div>

      <div className="glass-card reveal-card">
        <h2>Final Roles</h2>
        <div className="reveal-grid">
          {players.filter(Boolean).map(p => (
            <div key={p.id} className={`reveal-item ${p.status === 'Dead' ? 'dead' : ''}`}>
              <div className="avatar">{p.name.charAt(0)}</div>
              <div className="player-details">
                <span className="name">{p.name}</span>
                <span className={`role ${p.role.toLowerCase()}`}>{p.role}</span>
              </div>
              <div className="status">{p.status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="reveal-footer">
        <button className="btn btn-secondary" onClick={handleReturn}>
          <ArrowLeft size={20} />
          Return to Home
        </button>
      </div>
    </div>
  );
}

