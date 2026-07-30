import { useEffect, useState, useRef } from 'react';

const CHARACTERS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン0123456789!@#$%^&*';

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className = '' }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number>(0);
  const queueRef = useRef<Array<{ from: string, to: string, start: number, end: number, char?: string }>>([]);

  useEffect(() => {
    let frame = 0;
    const length = text.length;
    
    queueRef.current = [];
    for (let i = 0; i < length; i++) {
      const from = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20) + 10;
      queueRef.current.push({ from, to, start, end });
    }

    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0, n = queueRef.current.length; i < n; i++) {
        let { from, to, start, end, char } = queueRef.current[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            queueRef.current[i].char = char;
          }
          output += `<span class="opacity-50">${char}</span>`;
        } else {
          output += from;
        }
      }
      setDisplayText(output);
      if (complete === queueRef.current.length) {
        cancelAnimationFrame(frameRef.current);
      } else {
        frameRef.current = requestAnimationFrame(update);
        frame++;
      }
    };
    
    cancelAnimationFrame(frameRef.current);
    update();
    return () => cancelAnimationFrame(frameRef.current);
  }, [text]);

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: displayText }} />
  );
}
