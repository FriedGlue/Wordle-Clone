import { useState, useEffect } from 'react';

type Hints = "correct" | "wrong" | "almost" | "clean"; 

interface Entry {
  char: string;
  hint: Hints;
}


function App() {
  const [userEntry, setUserEntry] = useState<Entry[]>([]);
  const [charCount, setCharCount] = useState<number>(0);
  const [currentRow, setCurrentRow] = useState<number>(1);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const testWord = ['a', 'd', 'i', 'e', 'u'];

  function checkCurrentRow(userEntry: Entry[], currentRow: number): boolean {

    var rightBound = currentRow * 5;
    var leftBound = rightBound - 5;

    var isCorrect: boolean = true 

    const guess = userEntry.slice(leftBound, rightBound);

    for (let i = 0; i < guess.length; i++) {
      if(guess[i].char === testWord[i]) {
        guess[i].hint = "correct"
      } else if (testWord.includes(guess[i].char)) {
        guess[i].hint = "almost"
        isCorrect = false
      } else {
        guess[i].hint = "wrong";
        isCorrect = false;
      }
    }

    setUserEntry([...userEntry.slice(0, leftBound), ...guess, ...userEntry.slice(rightBound)]);
    return isCorrect;
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const isLetter = /^[a-zA-Z]$/.test(event.key);
      
      if (event.key === 'Enter') {
        if (charCount === 5) {
          setCharCount(0); 
          setCurrentRow((prevRow) => prevRow + 1);
          setGameWon((checkCurrentRow(userEntry, currentRow)));
        }
      } else if (event.key === 'Backspace') {
        setCharCount((prevCount) => {
          if (prevCount > 0) {
            setUserEntry((prevUserEntry) => prevUserEntry.slice(0, -1));
            return prevCount - 1; 
          }
          return prevCount; 
        });
      } else if (isLetter && !gameWon) {
        setCharCount((prevCount) => {
          if (prevCount < 5) {
            setUserEntry((prevUserEntry) => [
              ...prevUserEntry,
              { char: event.key, hint: "clean" },
            ]);
            return prevCount + 1; // Increment character count
          }
          return prevCount; // Keep the count same if limit is reached
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [userEntry]);

  const gameBoard = Array(30).fill('');

  return (
    <>
      <div className="flex justify-center p-16">
        <div className={`grid grid-cols-5 gap-4 ${gameWon ? 'animate-none' : 'animate-none'}`}>
          {gameBoard.map((_, i) => (
            <div
              key={i}
              className={`size-16 flex justify-center items-center border-gray-400 border-2 rounded shadow-md ${
                userEntry[i]
                  ? userEntry[i].hint === 'correct'
                    ? gameWon ? 'animate-bounce bg-green-500' : 'bg-green-500'
                    : userEntry[i].hint === 'wrong'
                    ? 'bg-red-500'
                    : userEntry[i].hint === 'almost'
                    ? 'bg-yellow-500'
                    : 'bg-white'
                  : 'bg-white-500'
              }`}
            >
              <p className=' font-bold text-3xl '>{userEntry[i] ? userEntry[i].char : ''}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
