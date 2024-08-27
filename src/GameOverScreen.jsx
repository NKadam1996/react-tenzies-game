import React from "react";

export default function GameOverScreen(props) {
  return (
    <div className="game-over-screen">
      <h1 className="title">Congratulations!</h1>
      <p className="score">Score: {props.rollCount}</p>
      <p className="time">Time Elapsed: {props.elapsedTime} seconds</p>
      <button className="reset-button" onClick={props.onReset}>
        Reset Game
      </button>
    </div>
  );
}
