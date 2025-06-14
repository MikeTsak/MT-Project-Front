import React from 'react';

export default function AccountingLoader() {
  return (
    <div className="accounting-loader-wrapper">
      <style>
        {`
        .accounting-loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        .calculator-emoji {
          font-size: 3rem;
          animation: bounce 1s infinite;
          margin-bottom: 0.5rem;
        }

        .loading-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d3748;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dot {
          animation: blink 1.4s infinite;
          opacity: 0;
        }
        .dot.one { animation-delay: 0.2s; }
        .dot.two { animation-delay: 0.4s; }
        .dot.three { animation-delay: 0.6s; }

        .accounting-hint {
          font-size: 0.9rem;
          margin-top: 0.5rem;
          color: #718096;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        @keyframes blink {
          0%   { opacity: 0; }
          50%  { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        `}
      </style>

      <div className="calculator-emoji">🧮</div>
      <div className="loading-text">
        Loading
        <span className="dot one">.</span>
        <span className="dot two">.</span>
        <span className="dot three">.</span>
      </div>
      <p className="accounting-hint">Balancing the books, crunching the numbers 💸</p>
    </div>
  );
}
