import { useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [diceValue, setDiceValue] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
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
    if(tenzies){
      setDiceValue(allNewDice())
      setTenzies(false)
    }
    setDiceValue((oldDice) =>
      oldDice.map((die) => {
        return die.isHeld ? die : generateNewDie();
      })
    );
  }

  useEffect(() => {
    const allHeld = diceValue.every((die) => die.isHeld === true);
    const firstValue = diceValue[0].value;
    const allValues = diceValue.every((die) => die.value === firstValue);
    diceValue.map((dice) => {
      if (allHeld && allValues) {
        setTenzies(true);
      }
    });
  }, [diceValue]);

  const diceElements = diceValue.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="dice-button" onClick={rollDice}>
        {tenzies ? "Reset Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
