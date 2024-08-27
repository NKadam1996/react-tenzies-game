import { useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import WelcomeScreen from "./WelcomeScreen";
import GameOverScreen from "./GameOverScreen";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [diceValue, setDiceValue] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timerId, setTimerId] = useState(null);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function holdDice(id) {
    setDiceValue((oldDice) =>
      oldDice.map((die) => {
        return die.id == id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function rollDice() {
    if (tenzies) {
      setDiceValue(allNewDice());
      setTenzies(false);
      setRollCount(0);
      setElapsedTime(0);
      setStartTime(null);
      setIsGameOver(false);
    }
    setDiceValue((oldDice) =>
      oldDice.map((die) => (die.isHeld ? die : generateNewDie()))
    );
    setRollCount((prevCount) => prevCount + 1);
  }

  useEffect(() => {
    if (isGameStarted) {
      if (!startTime) {
        setStartTime(Date.now());
      } else {
        const interval = setInterval(() => {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        setTimerId(interval);

        return () => clearInterval(interval);
      }
    }
  }, [isGameStarted, startTime]);

  useEffect(() => {
    const allHeld = diceValue.every((die) => die.isHeld === true);
    const firstValue = diceValue[0].value;
    const allValues = diceValue.every((die) => die.value === firstValue);
    diceValue.map((dice) => {
      if (allHeld && allValues) {
        setTenzies(true);
        setIsGameOver(true);
        if (timerId) clearInterval(timerId); // Stop the timer when the game is over
      }
    });
  }, [diceValue, timerId]);

  const diceElements = diceValue.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  function handleResetGame() {
    setIsGameStarted(false);
    setIsGameOver(false);
    setDiceValue(allNewDice());
    setTenzies(false);
    setRollCount(0);
    setElapsedTime(0);
    setStartTime(null);
    if (timerId) clearInterval(timerId); // Clean up the timer interval
    setTimerId(null);
  }

  return (
    <main>
      {isGameStarted ? (
        <div className="game">
          {tenzies && <Confetti />}
          {isGameOver ? (
            <GameOverScreen
              rollCount={rollCount}
              elapsedTime={elapsedTime}
              onReset={handleResetGame}
            />
          ) : (
            <>
              <div className="dice-container">{diceElements}</div>
              <button className="dice-button" onClick={rollDice}>
                {tenzies ? "Reset Game" : "Roll"}
              </button>
              <div className="dice-stats">
                <div>Roll Count: {rollCount}</div>
                <div>Time Elapsed: {elapsedTime} seconds</div>
              </div>
            </>
          )}
        </div>
      ) : (
        <WelcomeScreen onStart={handleStartGame} />
      )}
    </main>
  );
}

export default App;
