import { useState, useEffect } from 'react';

function App() {
  const [userEntry, setUserEntry] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      setUserEntry((prevUserEntry) => [...prevUserEntry, event.key]);
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const gameBoard = Array(30).fill('');

  return (
    <>
      <div className="flex justify-center p-16">
        <div className="grid grid-cols-5 gap-4">
          {gameBoard.map((_, i) => (
            <div key={i} className="size-14 bg-red-500 flex justify-center items-center">
              <p> { userEntry[i] } </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
