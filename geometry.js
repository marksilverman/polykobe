// geometry.js
//

// The pentakis icosidodecahedron (or subdivided icosahedron) is a convex polyhedron
// with 80 triangular faces, 120 edges, and 42 vertices. 20 of the faces are equilateral
// triangles. The edges and vertices come in two sizes.
//
const defaultVertexList = [ 
    [ -1.000000,  0.000000, 0.000000 ], 
    [ -0.809017, -0.309017, -0.500000 ], 
    [ -0.809017, -0.309017, 0.500000 ], 
    [ -0.809017, 0.309017, -0.500000 ], 
    [ -0.809017, 0.309017, 0.500000 ], 
    [ -0.808672, -0.499787, 0.000000 ], 
    [ -0.808672, 0.499787, 0.000000 ], 
    [ -0.500000, -0.809017, -0.309017 ], 
    [ -0.500000, -0.809017, 0.309017 ], 
    [ -0.500000, 0.809017, -0.309017 ], 
    [ -0.500000, 0.809017, 0.309017 ], 
    [ -0.499787, 0.000000, -0.808672 ], 
    [ -0.499787, 0.000000, 0.808672 ], 
    [ -0.309017, -0.500000, -0.809017 ], 
    [ -0.309017, -0.500000, 0.809017 ], 
    [ -0.309017, 0.500000, -0.809017 ], 
    [ -0.309017, 0.500000, 0.809017 ], 
    [ 0.000000, -1.000000, 0.000000 ], 
    [ 0.000000, -0.808672, -0.499787 ], 
    [ 0.000000, -0.808672, 0.499786 ], 
    [ 0.000000, 0.000000, -1.000000 ], 
    [ 0.000000, 0.000000, 1.000000 ], 
    [ 0.000000, 0.808672, -0.499787 ], 
    [ 0.000000, 0.808672, 0.499786 ], 
    [ 0.000000, 1.000000, 0.000000 ], 
    [ 0.309017, -0.500000, -0.809017 ], 
    [ 0.309017, -0.500000, 0.809017 ], 
    [ 0.309017, 0.500000, -0.809017 ], 
    [ 0.309017, 0.500000, 0.809017 ], 
    [ 0.499786, 0.000000, -0.808672 ], 
    [ 0.499786, 0.000000, 0.808672 ], 
    [ 0.500000, -0.809017, -0.309017 ], 
    [ 0.500000, -0.809017, 0.309017 ], 
    [ 0.500000, 0.809017, -0.309017 ], 
    [ 0.500000, 0.809017, 0.309017 ], 
    [ 0.808672, -0.499787, 0.000000 ], 
    [ 0.808672, 0.499787, 0.000000 ], 
    [ 0.809017, -0.309017, -0.500000 ], 
    [ 0.809017, -0.309017, 0.500000 ], 
    [ 0.809017, 0.309017, -0.500000 ], 
    [ 0.809017, 0.309017, 0.500000 ], 
    [ 1.000000, 0.000000, 0.000000 ]
 ];

// each face has three vertices (each one is an index into the vertex array)
// plus optional color and text
var faceList = [  ]

function pushFace(a, b, c, new_state=0, new_text="", new_locked=false) {
    faceList.push({vidx1: a, vidx2: b, vidx3: c, state: new_state, text: new_text, locked: new_locked});
}

pushFace(32, 31, 35);
pushFace(2, 0, 5);
pushFace(28, 21, 30);
pushFace(39, 37, 29);
pushFace(4, 2, 12);
pushFace(15, 20, 11);
pushFace(34, 24, 23);
pushFace(26, 14, 19);
pushFace(27, 15, 22);
pushFace(31, 17, 18);
pushFace(40, 41, 36);
pushFace(34, 28, 40);
pushFace(39, 27, 33);
pushFace(38, 26, 32);
pushFace(31, 25, 37);
pushFace(4, 16, 10, 2, "3");
pushFace(9, 15, 3);
pushFace(8, 14, 2);
pushFace(1, 13, 7);
pushFace(33, 24, 34);
pushFace(10, 24, 9);
pushFace(32, 17, 31);
pushFace(7, 17, 8);
pushFace(38, 41, 40);
pushFace(39, 41, 37);
pushFace(4, 0, 2);
pushFace(1, 0, 3);
pushFace(16, 21, 28);
pushFace(26, 21, 14);
pushFace(27, 20, 15);
pushFace(13, 20, 25);
pushFace(10, 9, 6);
pushFace(9, 3, 6);
pushFace(3, 0, 6);
pushFace(0, 4, 6);
pushFace(4, 10, 6);
pushFace(31, 37, 35);
pushFace(37, 41, 35);
pushFace(41, 38, 35);
pushFace(38, 32, 35);
pushFace(0, 1, 5);
pushFace(1, 7, 5);
pushFace(7, 8, 5);
pushFace(8, 2, 5);
pushFace(21, 26, 30);
pushFace(26, 38, 30);
pushFace(38, 40, 30);
pushFace(40, 28, 30);
pushFace(37, 25, 29);
pushFace(25, 20, 29);
pushFace(20, 27, 29);
pushFace(27, 39, 29);
pushFace(2, 14, 12);
pushFace(14, 21, 12);
pushFace(21, 16, 12);
pushFace(16, 4, 12);
pushFace(20, 13, 11);
pushFace(13, 1, 11);
pushFace(1, 3, 11);
pushFace(3, 15, 11);
pushFace(24, 10, 23);
pushFace(10, 16, 23);
pushFace(16, 28, 23);
pushFace(28, 34, 23);
pushFace(14, 8, 19);
pushFace(8, 17, 19);
pushFace(17, 32, 19);
pushFace(32, 26, 19);
pushFace(15, 9, 22);
pushFace(9, 24, 22);
pushFace(24, 33, 22);
pushFace(33, 27, 22);
pushFace(17, 7, 18);
pushFace(7, 13, 18);
pushFace(13, 25, 18);
pushFace(25, 31, 18);
pushFace(41, 39, 36);
pushFace(39, 33, 36);
pushFace(33, 34, 36);
pushFace(34, 40, 36);
