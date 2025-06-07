// geometry.js
//
window.JoinedTruncatedIcosahedron = (function() {

let joined_truncated_icosahedron = { };
joined_truncated_icosahedron["sizeFactor"] = -5;

// undoList[undoIdx] = faceList;

joined_truncated_icosahedron["polyhedronName"] = "Joined Truncated Icosahedron";

const C0 = 0.8090169943749474;
const C1 = 0.9270509831248423;
const C2 = 1.3305869973355014;
const C3 = 1.618033988749895;
const C4 = 1.8090169943749475;
const C5 = 2.118033988749895;
const C6 = 2.152934986677507;
const C7 = 2.4270509831248423;

joined_truncated_icosahedron["defaultVertexList"] = [
  [0.0, C1, C7], [0.0, C1, -C7], [0.0, -C1, C7], [0.0, -C1, -C7],
  [C7, 0.0, C1], [C7, 0.0, -C1], [-C7, 0.0, C1], [-C7, 0.0, -C1],
  [C1, C7, 0.0], [C1, -C7, 0.0], [-C1, C7, 0.0], [-C1, -C7, 0.0],
  [0.5, 0.0, C7], [0.5, 0.0, -C7], [-0.5, 0.0, C7], [-0.5, 0.0, -C7],
  [C7, 0.5, 0.0], [C7, -0.5, 0.0], [-C7, 0.5, 0.0], [-C7, -0.5, 0.0],
  [0.0, C7, 0.5], [0.0, C7, -0.5], [0.0, -C7, 0.5], [0.0, -C7, -0.5],
  [C2, 0.0, C6], [C2, 0.0, -C6], [-C2, 0.0, C6], [-C2, 0.0, -C6],
  [C6, C2, 0.0], [C6, -C2, 0.0], [-C6, C2, 0.0], [-C6, -C2, 0.0],
  [0.0, C6, C2], [0.0, C6, -C2], [0.0, -C6, C2], [0.0, -C6, -C2],
  [1.0, C0, C5], [1.0, C0, -C5], [1.0, -C0, C5], [1.0, -C0, -C5],
  [-1.0, C0, C5], [-1.0, C0, -C5], [-1.0, -C0, C5], [-1.0, -C0, -C5],
  [C5, 1.0, C0], [C5, 1.0, -C0], [C5, -1.0, C0], [C5, -1.0, -C0],
  [-C5, 1.0, C0], [-C5, 1.0, -C0], [-C5, -1.0, C0], [-C5, -1.0, -C0],
  [C0, C5, 1.0], [C0, C5, -1.0], [C0, -C5, 1.0], [C0, -C5, -1.0],
  [-C0, C5, 1.0], [-C0, C5, -1.0], [-C0, -C5, 1.0], [-C0, -C5, -1.0],
  [0.5, C3, C4], [0.5, C3, -C4], [0.5, -C3, C4], [0.5, -C3, -C4],
  [-0.5, C3, C4], [-0.5, C3, -C4], [-0.5, -C3, C4], [-0.5, -C3, -C4],
  [C4, 0.5, C3], [C4, 0.5, -C3], [C4, -0.5, C3], [C4, -0.5, -C3],
  [-C4, 0.5, C3], [-C4, 0.5, -C3], [-C4, -0.5, C3], [-C4, -0.5, -C3],
  [C3, C4, 0.5], [C3, C4, -0.5], [C3, -C4, 0.5], [C3, -C4, -0.5],
  [-C3, C4, 0.5], [-C3, C4, -0.5], [-C3, -C4, 0.5], [-C3, -C4, -0.5],
  [1.5, 1.5, 1.5], [1.5, 1.5, -1.5], [1.5, -1.5, 1.5], [1.5, -1.5, -1.5],
  [-1.5, 1.5, 1.5], [-1.5, 1.5, -1.5], [-1.5, -1.5, 1.5], [-1.5, -1.5, -1.5]
];

joined_truncated_icosahedron["faceIndexList"] = [
  [24,12,2,38],[24,38,86,70],[24,70,4,68],[24,68,84,36],[24,36,0,12],
  [25,13,1,37],[25,37,85,69],[25,69,5,71],[25,71,87,39],[25,39,3,13],
  [26,14,0,40],[26,40,88,72],[26,72,6,74],[26,74,90,42],[26,42,2,14],
  [27,15,3,43],[27,43,91,75],[27,75,7,73],[27,73,89,41],[27,41,1,15],
  [28,16,5,45],[28,45,85,77],[28,77,8,76],[28,76,84,44],[28,44,4,16],
  [29,17,4,46],[29,46,86,78],[29,78,9,79],[29,79,87,47],[29,47,5,17],
  [30,18,6,48],[30,48,88,80],[30,80,10,81],[30,81,89,49],[30,49,7,18],
  [31,19,7,51],[31,51,91,83],[31,83,11,82],[31,82,90,50],[31,50,6,19],
  [32,20,10,56],[32,56,88,64],[32,64,0,60],[32,60,84,52],[32,52,8,20],
  [33,21,8,53],[33,53,85,61],[33,61,1,65],[33,65,89,57],[33,57,10,21],
  [34,22,9,54],[34,54,86,62],[34,62,2,66],[34,66,90,58],[34,58,11,22],
  [35,23,11,59],[35,59,91,67],[35,67,3,63],[35,63,87,55],[35,55,9,23],
  [2,12,0,14],[3,15,1,13],[4,17,5,16],[7,19,6,18],[8,21,10,20],[9,22,11,23],
  [36,84,60,0],[37,1,61,85],[38,2,62,86],[39,87,63,3],[40,0,64,88],[41,89,65,1],
  [42,90,66,2],[43,3,67,91],[44,84,68,4],[45,5,69,85],[46,4,70,86],[47,87,71,5],
  [48,6,72,88],[49,89,73,7],[50,90,74,6],[51,7,75,91],[52,84,76,8],[53,8,77,85],
  [54,9,78,86],[55,87,79,9],[56,10,80,88],[57,89,81,10],[58,90,82,11],[59,11,83,91]
];

joined_truncated_icosahedron["edgeMap"] = new Map();
joined_truncated_icosahedron["edgeList"] = [ ];
joined_truncated_icosahedron["faceList"] = [ ];

function getEdgeKey(a, b)
{
  return a < b ? `${a},${b}` : `${b},${a}`;
}

function getEdgeIndex(a, b, faceIndex)
{
  const key = getEdgeKey(a, b);
  if (joined_truncated_icosahedron["edgeMap"].has(key))
  {
    const entry = joined_truncated_icosahedron["edgeMap"].get(key);
    entry.faces.push(faceIndex);
    return entry.index;
  }
  const index = joined_truncated_icosahedron["edgeList"].length;
  const entry = { vertices: [ a, b ], faces: [ faceIndex ] };
  joined_truncated_icosahedron["edgeMap"].set( key, { index, faces: entry.faces } );
  joined_truncated_icosahedron["edgeList"].push( entry );
  return index;
}

for (let i = 0; i < joined_truncated_icosahedron["faceIndexList"].length; i++)
{
  const [a, b, c, d] = joined_truncated_icosahedron["faceIndexList"][i];
  const e0 = getEdgeIndex(a, b, i);
  const e1 = getEdgeIndex(b, c, i);
  const e2 = getEdgeIndex(c, d, i);
  const e3 = getEdgeIndex(d, a, i);
  joined_truncated_icosahedron["faceList"].push({
    vertices: [a, b, c, d],
    edges: [e0, e1, e2, e3],
    state: 0,
    locked: false,
    number: null
  });
}

function getGeometry() { return joined_truncated_icosahedron; }
return { getGeometry };

})();
