// geometry.js
//

const φ = (1 + Math.sqrt(5)) / 2;
const C0 = 0.9270509831248423;
const C1 = 1.3305869973355014;
const C2 = 2.152934986677507;
const C3 = 2.4270509831248424;

//const x = Math.cbrt((φ + Math.sqrt(φ-5/27))/2) + Math.cbrt((φ - Math.sqrt(φ-5/27))/2);
//const C0 = φ * (3 - (x^2));
//const C1 = x * φ - 1 - φ;
//const C2 = (1 + φ - x) / (x^3);
//const C3 = x * φ * (x - φ);
const polyhedronName = "Pentakis dodecahedron";

// generated with help from https://kitwallace.co.uk/polyhedra/solid-index.xq

const defaultVertexList = [
  [ 0, C0, C3 ], [ 0, C0, -C3 ], [ 0, -C0, C3 ], [ 0, -C0, -C3 ],
  [ C3, 0, C0 ], [ C3, 0, -C0 ], [ -C3, 0, C0 ], [ -C3, 0, -C0 ],
  [ C0, C3, 0 ], [ C0, -C3, 0 ], [ -C0, C3, 0 ], [ -C0, -C3, 0 ],
  [ C1, 0, C2 ], [ C1, 0, -C2 ], [ -C1, 0, C2 ], [ -C1, 0, -C2 ],
  [ C2, C1, 0 ], [ C2, -C1, 0 ], [ -C2, C1, 0 ], [ -C2, -C1, 0 ],
  [ 0, C2, C1 ], [ 0, C2, -C1 ], [ 0, -C2, C1 ], [ 0, -C2, -C1 ],
  [ 1.5, 1.5, 1.5 ], [ 1.5, 1.5, -1.5 ], [ 1.5, -1.5, 1.5 ], [ 1.5, -1.5, -1.5 ],
  [ -1.5, 1.5, 1.5 ], [ -1.5, 1.5, -1.5 ], [ -1.5, -1.5, 1.5 ], [ -1.5, -1.5, -1.5 ]
];

const faceIndexList = [
  [ 2, 0, 12 ], [ 26, 2, 12 ], [ 4, 26, 12 ], [ 24, 4, 12 ], [ 0, 24, 12 ],
  [ 1, 3, 13 ], [ 25, 1, 13 ], [ 5, 25, 13 ], [ 27, 5, 13 ], [ 3, 27, 13 ],
  [ 0, 2, 14 ], [ 28, 0, 14 ], [ 6, 28, 14 ], [ 30, 6, 14 ], [ 2, 30, 14 ],
  [ 3, 1, 15 ], [ 31, 3, 15 ], [ 7, 31, 15 ], [ 29, 7, 15 ], [ 1, 29, 15 ],
  [ 5, 4, 16 ], [ 25, 5, 16 ], [ 8, 25, 16 ], [ 24, 8, 16 ], [ 4, 24, 16 ],
  [ 4, 5, 17 ], [ 26, 4, 17 ], [ 9, 26, 17 ], [ 27, 9, 17 ], [ 5, 27, 17 ],
  [ 6, 7, 18 ], [ 28, 6, 18 ], [ 10, 28, 18 ], [ 29, 10, 18 ], [ 7, 29, 18 ],
  [ 7, 6, 19 ], [ 31, 7, 19 ], [ 11, 31, 19 ], [ 30, 11, 19 ], [ 6, 30, 19 ],
  [ 10, 8, 20 ], [ 28, 10, 20 ], [ 0, 28, 20 ], [ 24, 0, 20 ], [ 8, 24, 20 ],
  [ 8, 10, 21 ], [ 25, 8, 21 ], [ 1, 25, 21 ], [ 29, 1, 21 ], [ 10, 29, 21 ],
  [ 9, 11, 22 ], [ 26, 9, 22 ], [ 2, 26, 22 ], [ 30, 2, 22 ], [ 11, 30, 22 ],
  [ 11, 9, 23 ], [ 31, 11, 23 ], [ 3, 31, 23 ], [ 27, 3, 23 ], [ 9, 27, 23 ]
];

const edgeMap = new Map();
const edgeList = [ ];
const faceList = [ ];

function getEdgeKey(a, b)
{
  return a < b ? `${a},${b}` : `${b},${a}`;
}

function getEdgeIndex(a, b, faceIndex)
{
  const key = getEdgeKey(a, b);
  if (edgeMap.has(key))
  {
    const entry = edgeMap.get(key);
    entry.faces.push(faceIndex);
    return entry.index;
  }
  const index = edgeList.length;
  const entry = { vertices: [ a, b ], faces: [ faceIndex ] };
  edgeMap.set( key, { index, faces: entry.faces } );
  edgeList.push( entry );
  return index;
}

for (let i = 0; i < faceIndexList.length; i++)
{
  const [ a, b, c ] = faceIndexList[ i ];
  const e0 = getEdgeIndex( a, b, i );
  const e1 = getEdgeIndex( b, c, i );
  const e2 = getEdgeIndex( c, a, i );
  faceList.push({
    vertices: [ a, b, c ],
    edges: [ e0, e1, e2 ],
    state: 0,
    locked: false,
    number: null
  });
}

const glyphList = { };

glyphList[3] = [
    [[-0.2,  0.25], [-0.05,  0.28]],
    [[-0.05,  0.28], [ 0.08,  0.25]],
    [[ 0.08,  0.25], [ 0.18,  0.15]],
    [[ 0.18,  0.15], [ 0.10,  0.05]],
    [[ 0.10,  0.05], [-0.05,  0.00]],
    [[-0.05,  0.00], [ 0.10, -0.05]],
    [[ 0.10, -0.05], [ 0.18, -0.15]],
    [[ 0.18, -0.15], [ 0.08, -0.25]],
    [[ 0.08, -0.25], [-0.05, -0.28]],
    [[-0.05, -0.28], [-0.2, -0.25]]
];

glyphList[1] = [
    [[0.0, 0.3], [0.0, -0.3]],
    [[-0.05, 0.25], [0.0, 0.3]],
    [[-0.05, -0.3], [0.05, -0.3]]
];

glyphList[2] = [
    [[-0.2,  0.25], [ 0.1,  0.25]],
    [[ 0.1,  0.25], [ 0.2,  0.15]],
    [[ 0.2,  0.15], [ 0.1,  0.05]],
    [[ 0.1,  0.05], [-0.05, -0.05]],
    [[-0.05, -0.05], [-0.15, -0.15]],
    [[-0.15, -0.15], [-0.2, -0.3]],
    [[-0.2, -0.3], [ 0.2, -0.3]]
];


glyphList[3] = [
    [[-0.2,  0.25], [-0.05,  0.28]],
    [[-0.05,  0.28], [ 0.08,  0.25]],
    [[ 0.08,  0.25], [ 0.18,  0.15]],
    [[ 0.18,  0.15], [ 0.10,  0.05]],
    [[ 0.10,  0.05], [-0.05,  0.00]],
    [[-0.05,  0.00], [ 0.10, -0.05]],
    [[ 0.10, -0.05], [ 0.18, -0.15]],
    [[ 0.18, -0.15], [ 0.08, -0.25]],
    [[ 0.08, -0.25], [-0.05, -0.28]],
    [[-0.05, -0.28], [-0.2, -0.25]]
];

glyphList[4] = [
    [[ 0.15,  0.3 ], [ 0.15, -0.3]],
    [[ 0.15,  0.3 ], [-0.15,  0.05]],
    [[-0.15,  0.05], [ 0.25,  0.05]]
];


glyphList[5] = [
    [[0.15, 0.25], [-0.2, 0.25]],
    [[-0.2, 0.25], [-0.2, 0.0]],
    [[-0.2, 0.0], [0.1, 0.0]],
    [[0.1, 0.0], [0.2, -0.1]],
    [[0.2, -0.1], [0.1, -0.25]],
    [[0.1, -0.25], [-0.1, -0.3]],
    [[-0.1, -0.3], [ -0.2, -0.2]]
];

glyphList[6] = [
    [[ 0.1,   0.15], [-0.1,  0.15]],
    [[-0.1,   0.15], [-0.2,  -0.0 ]],
    [[-0.2,  -0.0 ], [-0.1,  -0.15]],
    
    [[-0.1,  -0.15], [ 0.1,  -0.15]],
    [[ 0.1,  -0.15], [ 0.2,  -0.0 ]],
    [[ 0.2,  -0.0 ], [ 0.1,  0.15]],
    [[-0.2,  -0.03], [-0.1,  0.3 ]],
    [[-0.1,  0.3 ], [ 0.05, 0.5]],
    [ [ -0.2, -0.3  ], [  0.2, -0.3  ] ]
];


glyphList[7] = [
    [[-0.2, 0.25], [0.2, 0.25]],
    [[0.2, 0.25], [-0.05, -0.3]]
];

glyphList[8] = [
    [[-0.1, 0.25], [0.1, 0.25]],
    [[0.1, 0.25], [0.2, 0.1]],
    [[0.2, 0.1], [0.0, 0.0]],
    [[0.0, 0.0], [0.2, -0.1]],
    [[0.2, -0.1], [0.1, -0.25]],
    [[0.1, -0.25], [-0.1, -0.25]],
    [[-0.1, -0.25], [-0.2, -0.1]],
    [[-0.2, -0.1], [0.0, 0.0]],
    [[0.0, 0.0], [-0.2, 0.1]],
    [[-0.2, 0.1], [-0.1, 0.25]]
];

glyphList[9] = [
    [ [ -0.1,  0.15 ], [  0.1,  0.15 ] ],
    [ [  0.1,  0.15 ], [  0.2,  0.3  ] ],
    [ [  0.2,  0.3  ], [  0.1,  0.45 ] ],
    [ [  0.1,  0.45 ], [ -0.1,  0.45 ] ],
    [ [ -0.1,  0.45 ], [ -0.2,  0.3  ] ],
    [ [ -0.2,  0.3  ], [ -0.1,  0.15 ] ],
    [ [  0.2,  0.33 ], [  0.1,  0.0  ] ],
    [ [  0.1,  0.0  ], [ -0.05, -0.2 ] ],
    [ [ -0.2, -0.3  ], [  0.2, -0.3  ] ]
];

glyphList[0] = [
    [[-0.1, 0.25], [0.1, 0.25]],
    [[0.1, 0.25], [0.2, 0.1]],
    [[0.2, 0.1], [0.2, -0.1]],
    [[0.2, -0.1], [0.1, -0.25]],
    [[0.1, -0.25], [-0.1, -0.25]],
    [[-0.1, -0.25], [-0.2, -0.1]],
    [[-0.2, -0.1], [-0.2, 0.1]],
    [[-0.2, 0.1], [-0.1, 0.25]]
];

const defaultPuzzle = [{"index":0,"state":2,"number":1,"locked":true},
{"index":1,"state":0,"number":null,"locked":false},
{"index":2,"state":0,"number":null,"locked":false},
{"index":3,"state":2,"number":2,"locked":true},
{"index":4,"state":0,"number":null,"locked":false},
{"index":5,"state":0,"number":null,"locked":false},
{"index":6,"state":0,"number":null,"locked":false},
{"index":7,"state":0,"number":null,"locked":false},
{"index":8,"state":2,"number":2,"locked":true},
{"index":9,"state":0,"number":null,"locked":false},
{"index":10,"state":0,"number":null,"locked":false},
{"index":11,"state":0,"number":null,"locked":false},
{"index":12,"state":0,"number":null,"locked":false},
{"index":13,"state":0,"number":null,"locked":false},
{"index":14,"state":0,"number":null,"locked":false},
{"index":15,"state":0,"number":null,"locked":false},
{"index":16,"state":0,"number":null,"locked":false},
{"index":17,"state":0,"number":null,"locked":false},
{"index":18,"state":0,"number":null,"locked":false},
{"index":19,"state":0,"number":null,"locked":false},
{"index":20,"state":0,"number":null,"locked":false},
{"index":21,"state":0,"number":null,"locked":false},
{"index":22,"state":0,"number":null,"locked":false},
{"index":23,"state":0,"number":null,"locked":false},
{"index":24,"state":0,"number":null,"locked":false},
{"index":25,"state":0,"number":null,"locked":false},
{"index":26,"state":0,"number":null,"locked":false},
{"index":27,"state":0,"number":null,"locked":false},
{"index":28,"state":2,"number":2,"locked":true},
{"index":29,"state":0,"number":null,"locked":false},
{"index":30,"state":0,"number":null,"locked":false},
{"index":31,"state":2,"number":1,"locked":true},
{"index":32,"state":1,"number":null,"locked":true},
{"index":33,"state":0,"number":null,"locked":false},
{"index":34,"state":0,"number":null,"locked":false},
{"index":35,"state":0,"number":null,"locked":false},
{"index":36,"state":0,"number":null,"locked":false},
{"index":37,"state":0,"number":null,"locked":false},
{"index":38,"state":2,"number":6,"locked":true},
{"index":39,"state":1,"number":null,"locked":true},
{"index":40,"state":2,"number":4,"locked":true},
{"index":41,"state":0,"number":null,"locked":false},
{"index":42,"state":0,"number":null,"locked":false},
{"index":43,"state":0,"number":null,"locked":false},
{"index":44,"state":0,"number":null,"locked":false},
{"index":45,"state":0,"number":null,"locked":false},
{"index":46,"state":0,"number":null,"locked":false},
{"index":47,"state":2,"number":2,"locked":true},
{"index":48,"state":1,"number":null,"locked":true},
{"index":49,"state":0,"number":null,"locked":false},
{"index":50,"state":1,"number":null,"locked":true},
{"index":51,"state":0,"number":null,"locked":false},
{"index":52,"state":0,"number":null,"locked":false},
{"index":53,"state":1,"number":null,"locked":true},
{"index":54,"state":0,"number":null,"locked":false},
{"index":55,"state":0,"number":null,"locked":false},
{"index":56,"state":0,"number":null,"locked":false},
{"index":57,"state":0,"number":null,"locked":false},
{"index":58,"state":2,"number":2,"locked":true},
{"index":59,"state":0,"number":null,"locked":false}];