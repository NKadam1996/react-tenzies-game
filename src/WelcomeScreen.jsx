import React from "react";

export default function WelcomeScreen(props) {
  return (
    <div className="welcome-screen">
      <h1 className="title">Welcome to Tenzies!</h1>
      <p className="description">
        Tenzies is a dice game where the goal is to roll all the dice to show the same number.
        Click "Start Game" to begin.
      </p>
      <button className="start-button" onClick={props.onStart}>
        Start Game
      </button>
    </div>
  );
}
