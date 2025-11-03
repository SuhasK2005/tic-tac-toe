import "./TicTacToe.css";
import circle from '../assets/circle.png';
import cross from '../assets/cross.png';

const TicTacToe = () => {
  return (
    <div className="container">
      <h1 className="title">Tic Tac Toe <span>Game</span></h1>
      <div className="board">

      </div>
      <button className="reset">Reset Game</button>
    </div>
  );
};

export default TicTacToe;
