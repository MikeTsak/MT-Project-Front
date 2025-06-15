import { useEffect, useState } from 'react';

export default function NotFound() {
  const [frame, setFrame] = useState(0);
  const frames = [
    `
      🤖
     /|\\  
     / \\
    `,
    `
     \\🤖/
      |    
     / \\
    `,
    `
     🤖
     /|\\  
     / \\
    `,
    `
     🤖
     \\|/
     / \\
    `,
    `
     🤖
     <|>
     / \\
    `
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % frames.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.subtitle}>But Tasky the ProjectBot is throwing a party!</p>
      <pre style={styles.dance}>{frames[frame]}</pre>
      <a href="/home" style={styles.link}>🏠 Return to Dashboard</a>
    </div>
  );
}

const styles = {
  container: {
    background: '#f0f4f8',
    height: '100vh',
    padding: '2rem',
    textAlign: 'center',
    fontFamily: 'monospace',
    color: '#2d3748',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem'
  },
  dance: {
    fontSize: '1.2rem',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
    marginBottom: '2rem',
    color: '#4a5568'
  },
  link: {
    fontSize: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4299e1',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.5rem'
  }
};
