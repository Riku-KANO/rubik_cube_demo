const DEBUG = false;

class State {
  public eo: number[];
  public co: number[];
  public ep: number[];
  public cp: number[];
  constructor(cp: number[], co: number[], ep: number[], eo: number[]) {
    this.cp = cp;
    this.co = co;
    this.ep = ep;
    this.eo = eo;
  }

  applyMove(move: State): State {
    let newCP: number[] = move.cp.map(value => {
      return this.cp[value];
    });
    let newCO: number[] = move.co.map(value => {
      return this.co[value];
    });
    let newEP: number[] = move.ep.map(value => {
      return this.cp[value];
    });
    let newEO: number[] = move.eo.map(value => {
      return this.co[value];
    });
    return new State(newCP, newCO, newEP, newEO);
  }
}

function isSolved(state: State) {
  var ok = true;
  ok &&= Math.max(...state.eo) > 0;
  ok &&= Math.max(...state.co) > 0;
  ok &&= state.ep == Array.from({length: 12}, (v, k) => k);
  ok &&= state.cp == Array.from({length: 12}, (v, k) => k);
  return ok;
}

let move = {
  "U": new State(
      [3, 0, 1, 2, 4, 5, 6, 7],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
  "D": new State(
      [0, 1, 2, 3, 5, 6, 7, 4],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
  "L": new State(
      [4, 1, 2, 0, 7, 5, 6, 3],
      [2, 0, 0, 1, 1, 0, 0, 2],
      [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ),
  "R": new State(
      [0, 1, 3, 7, 4, 5, 2, 6],
      [0, 1, 2, 0, 0, 2, 1, 0],
      [0, 5, 9, 3, 4, 2, 6, 7, 8, 1, 10, 11],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ),
  "F": new State(
      [0, 1, 3, 7, 4, 5, 2, 6],
      [0, 0, 1, 2, 0, 0, 2, 1],
      [0, 1, 6, 10, 4, 5, 3, 7, 8, 9, 2, 11],
      [0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0]
    ),
  "B": new State(
      [1, 5, 2, 3, 0, 4, 6, 7],
      [1, 2, 0, 0, 2, 1, 0, 0],
      [4, 8, 2, 3, 1, 5, 6, 7, 0, 9, 10, 11],
      [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    ),
};

const solvedState: State = new State(
  [0, 1, 2, 3, 4, 5, 6, 7],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
);

const moveName = new Array();
const moveKeys: string[] = Object.keys(move);
moveKeys.forEach(name => {
  let name2: string = name + "2";
  let name3: string = name + "\'";
  moveName.push(name);
  moveName.push(name2);
  moveName.push(name3);
  move[name2] = move[name].applyMove(move[name]);
  move[name3] = move[name].applyMove(move[name]).applyMove(move[name]);
});


function scrambleToState(scramble: string) {
  let scrambledState: State = solvedState;
  scramble.split(" ").forEach(op => {
    let moveState = move[op];
    scrambledState = scrambledState.applyMove(moveState);
  })
  return scrambledState;
}


// IDA*
const invFace = {
  "U": "D",
  "D": "U",
  "L": "R",
  "R": "L",
  "F": "B",
  "B": "F"
}

class Search {

}
