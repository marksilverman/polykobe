// geometry.js
//
const sqrt5 = Math.sqrt(5);
const φ = (1 + sqrt5) / 2;

const polyhedronName = "Geodesic Cube Pattern 5 [3,0]";
const C0 = 0.248980242746681704081913867273;
const C1 = 0.263843526998053964813863576171;
const C2 = 0.582070743941977044408971034040;
const C3 = 0.7071067811865475244008443621048;
const C4 = 0.964565494542090266957282957994;

const defaultVertexList = [
  [ C1,  C1,  C4], [ C1,  C1, -C4], [ C1, -C1,  C4], [ C1, -C1, -C4],
  [-C1,  C1,  C4], [-C1,  C1, -C4], [-C1, -C1,  C4], [-C1, -C1, -C4],
  [ C4,  C1,  C1], [ C4,  C1, -C1], [ C4, -C1,  C1], [ C4, -C1, -C1],
  [-C4,  C1,  C1], [-C4,  C1, -C1], [-C4, -C1,  C1], [-C4, -C1, -C1],
  [ C1,  C4,  C1], [ C1,  C4, -C1], [ C1, -C4,  C1], [ C1, -C4, -C1],
  [-C1,  C4,  C1], [-C1,  C4, -C1], [-C1, -C4,  C1], [-C1, -C4, -C1],
  [ C3,  C0,  C3], [ C3,  C0, -C3], [ C3, -C0,  C3], [ C3, -C0, -C3],
  [-C3,  C0,  C3], [-C3,  C0, -C3], [-C3, -C0,  C3], [-C3, -C0, -C3],
  [ C3,  C3,  C0], [ C3,  C3, -C0], [ C3, -C3,  C0], [ C3, -C3, -C0],
  [-C3,  C3,  C0], [-C3,  C3, -C0], [-C3, -C3,  C0], [-C3, -C3, -C0],
  [ C0,  C3,  C3], [ C0,  C3, -C3], [ C0, -C3,  C3], [ C0, -C3, -C3],
  [-C0,  C3,  C3], [-C0,  C3, -C3], [-C0, -C3,  C3], [-C0, -C3, -C3],
  [ C2,  C2,  C2], [ C2,  C2, -C2], [ C2, -C2,  C2], [ C2, -C2, -C2],
  [-C2,  C2,  C2], [-C2,  C2, -C2], [-C2, -C2,  C2], [-C2, -C2, -C2],
];

const faceIndexList = [
  [  0,  4,  6,  2 ], [  1,  3,  7,  5 ], [  8, 10, 11,  9 ], [ 12, 13, 15, 14 ],
  [ 16, 17, 21, 20 ], [ 18, 22, 23, 19 ], [ 48, 24,  8, 32 ], [ 48, 32, 16, 40 ],
  [ 48, 40,  0, 24 ], [ 49, 25,  1, 41 ], [ 49, 41, 17, 33 ], [ 49, 33,  9, 25 ],
  [ 50, 26,  2, 42 ], [ 50, 42, 18, 34 ], [ 50, 34, 10, 26 ], [ 51, 27, 11, 35 ],
  [ 51, 35, 19, 43 ], [ 51, 43,  3, 27 ], [ 52, 28,  4, 44 ], [ 52, 44, 20, 36 ],
  [ 52, 36, 12, 28 ], [ 53, 29, 13, 37 ], [ 53, 37, 21, 45 ], [ 53, 45,  5, 29 ],
  [ 54, 30, 14, 38 ], [ 54, 38, 22, 46 ], [ 54, 46,  6, 30 ], [ 55, 31,  7, 47 ],
  [ 55, 47, 23, 39 ], [ 55, 39, 15, 31 ], [ 26, 10,  8, 24 ], [ 26, 24,  0,  2 ],
  [ 27,  3,  1, 25 ], [ 27, 25,  9, 11 ], [ 28, 12, 14, 30 ], [ 28, 30,  6,  4 ],
  [ 29,  5,  7, 31 ], [ 29, 31, 15, 13 ], [ 32,  8,  9, 33 ], [ 32, 33, 17, 16 ],
  [ 34, 18, 19, 35 ], [ 34, 35, 11, 10 ], [ 36, 20, 21, 37 ], [ 36, 37, 13, 12 ],
  [ 38, 14, 15, 39 ], [ 38, 39, 23, 22 ], [ 40, 16, 20, 44 ], [ 40, 44,  4,  0 ],
  [ 41,  1,  5, 45 ], [ 41, 45, 21, 17 ], [ 42,  2,  6, 46 ], [ 42, 46, 22, 18 ],
  [ 43, 19, 23, 47 ], [ 43, 47,  7,  3 ]
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
  const [ a, b, c, d ] = faceIndexList[ i ];
  const e0 = getEdgeIndex( a, b, i );
  const e1 = getEdgeIndex( b, c, i );
  const e2 = getEdgeIndex( c, d, i );
  const e3 = getEdgeIndex( d, a, i );
  faceList.push({
    vertices: [ a, b, c, d ],
    edges: [ e0, e1, e2, e3 ],
    state: 0,
    locked: false,
    number: null
  });
}
