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

function isSolved(state: State): boolean {
  var ok = true;
  ok &&= Math.max(...state.eo) === 0;
  ok &&= Math.max(...state.co) === 0;
  ok &&= state.ep == Array.from({length: 12}, (v, k) => k);
  ok &&= state.cp == Array.from({length: 12}, (v, k) => k);
  return ok;
}

let moves = {
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

let moveNames = new Array();
const moveKeys: string[] = Object.keys(moves);
moveKeys.forEach(name => {
  let name2: string = name + "2";
  let name3: string = name + "\'";
  moveNames.push(name);
  moveNames.push(name2);
  moveNames.push(name3);
  moves[name2] = moves[name].applyMove(moves[name]);
  moves[name3] = moves[name].applyMove(moves[name]).applyMove(moves[name]);
});


function scrambleToState(scramble: string) {
  let scrambledState: State = solvedState;
  scramble.split(" ").forEach(op => {
    let moveState = moves[op];
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

function isMoveAvailable(preMove: string = "None", move: string): boolean {
  if (preMove == "None") return true;
  let preFace = preMove[0];
  if (preFace == move[0]) return false;
  if (invFace[preFace] == move[0]) return preFace < move[0];
  return true;
}

class Search {
  public currentSolution: string[];
  constructor() {
    this.currentSolution = new Array();
  }

  depthLimitedSearch(state: State, depth: number): boolean {
    if(depth === 0 && isSolved(state)) return true;
    if(depth === 0) return false;
    if(this.prune(depth, state)) return false;
    let preMove = (this.currentSolution.length === 0) ? this.currentSolution[this.currentSolution.length-1] : "None";
    let ret: boolean = false;
    moveNames.some(op => {
      if(! isMoveAvailable(preMove, op)) return;
      this.currentSolution.push(op);
      if(this.depthLimitedSearch(state.applyMove(moves[op]), depth - 1)) {
        ret = true;
        return false;
      }
      this.currentSolution.pop();
    });
    return ret;
  }

  startSearch(state: State, maxLength: number = 20) {
    for(let depth = 0; depth < maxLength; ++depth) {
      console.log("#Start searching length `${depth}`");
      if(this.depthLimitedSearch(state, depth)) {
        return this.currentSolution.join(" ");
      }
    }
    return "None";
  }

  prune(depth: number, state: State): boolean {
    if(depth === 1 && (this._countSolvedCorners(state) < 4) || this._countSolvedEdges(state) < 8) return true;
    if(depth === 2 && this._countSolvedEdges(state) < 4) return true;
    if(depth === 3 && this._countSolvedEdges(state) < 2) return true;
    return false;
  }

  _countSolvedCorners(state: State): number {
    let ret = 0;
    for(let i = 0; i < 8; ++i) if(state.cp[i] == i && state.co[i] == 0) ret++;
    return ret;
  }

  _countSolvedEdges(state: State): number {
    let ret = 0;
    for(let i = 0; i < 12; ++i) if(state.ep[i] == i && state.eo[i] == 0) ret++;
    return ret;
  }
}

export { Search, State, isSolved, isMoveAvailable, moves, moveNames, scrambleToState, solvedState, invFace }