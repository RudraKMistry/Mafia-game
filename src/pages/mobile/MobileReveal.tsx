import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Skull, Fingerprint } from "lucide-react";

export default function MobileReveal({ room, returnToLobby }: { room: any, returnToLobby: () => void }) {
  const navigate = useNavigate();
  const { winner, players, id } = room;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center py-4 px-3 overflow-x-hidden desk-day text-white">
      {/* The Manila Folder Canvas */}
      <main className="w-full max-w-md bg-[#E8D9C5] m-paper-texture border-[3px] border-black shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] relative flex flex-col rotate-[0.5deg] text-black">
        
        {/* Folder Tab */}
        <div className="absolute -top-10 right-4 bg-[#E8D9C5] border-[3px] border-b-0 border-black px-3 py-2 rounded-t-lg z-0">
          <span className="font-typewriter-md text-[#261816]">CASE CLOSED</span>
        </div>

        {/* Header Section */}
        <header className="w-full border-b-4 border-black p-2 flex flex-col items-center justify-center relative z-10 bg-[#E8D9C5]">
          <div className="flex items-center gap-2 mb-2 justify-center">
            <Trophy className="text-lg text-[#261816]" />
            <span className="font-display-xl text-[#261816] tracking-tighter uppercase text-lg">WINNER</span>
          </div>
          <div className="mt-4 relative">
            <div className="font-handwritten-lg text-[#1E3A8A] text-center bg-white px-3 py-3 border-2 border-black neo-brutalist-shadow rotate-[-2deg]">
                {winner.team} WINS
            </div>
            <div className="absolute -top-2 -right-6 font-typewriter-md border-[3px] border-[#991B1B] text-[#991B1B] px-2 py-1 uppercase font-bold opacity-80 -rotate-12 bg-transparent">
                SURVIVED
            </div>
          </div>
          <p className="mt-6 font-typewriter-md font-bold text-center">{winner.text}</p>
        </header>

        {/* Final Roles List */}
        <section className="p-2 flex-1">
          <h2 className="font-typewriter-md border-b-2 border-black pb-2 mb-4">SUBJECT DISPOSITIONS</h2>
          
          <div className="space-y-4">
            {players.map((p: any, index: number) => {
              const isDead = p.isDead;
              const rotClass = index % 2 === 0 ? 'rotate-[1deg]' : 'rotate-[-1deg]';
              return (
                <article key={p.id} className={`bg-[#f8dcd8] border-2 border-black p-2 flex items-center gap-2 neo-brutalist-shadow relative overflow-hidden ${rotClass}`}>
                  <div className={`w-10 h-10 bg-white border-2 border-black flex-shrink-0 flex items-center justify-center ${isDead ? 'opacity-50' : ''}`}>
                    <div className="text-black">
                      {isDead ? <Skull size={24} /> : <Fingerprint size={24} />}
                    </div>
                  </div>
                  
                  <div className={`flex-1 ${isDead ? 'opacity-70' : ''}`}>
                    <p className={`font-handwritten-lg ${isDead ? 'line-through text-[#5a403c]' : 'text-black'}`}>{p.name}</p>
                    <p className="font-typewriter-sm text-[#5a403c] uppercase">{p.role?.name || 'Unknown'}</p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {isDead ? (
                       <span className="font-typewriter-md text-[#991B1B] font-bold border-2 border-[#991B1B] px-1 rotate-[15deg]">DECEASED</span>
                    ) : (
                       <span className="font-typewriter-md text-[#1E3A8A] font-bold border-2 border-[#1E3A8A] px-1 rotate-[-5deg]">ALIVE</span>
                    )}
                  </div>

                  {isDead && (
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Return Button */}
        <div className="p-2">
          <button 
            onClick={() => { returnToLobby(); navigate(`/lobby/${id}`); }}
            className="w-full bg-[#261816] text-white font-headline-lg uppercase py-3 border-2 border-black neo-brutalist-shadow active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex justify-center items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to HQ
          </button>
        </div>

      </main>
    </div>
  );
}
