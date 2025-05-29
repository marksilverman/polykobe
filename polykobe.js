// polykobe.js
//
const rotateBy = Math.PI / 6;
const edgeColor = "orange";
const selectedColor = "purple"
const glyphColor = "orange";
const stateList = [ "unknown", "shaded", "unshaded" ];
const stateColorList = { unknown: "lightgray", shaded: "black", unshaded: "green" };
const unknownState = 0, shadedState = 1, unshadedState = 2;

let perspective = -0.58, fovRatio= 0.8;
let prevX = 0, prevY = 0;
let isDragging = false, redraw = true;
let selectedFace = null;

function resetSize()
{
    rect = canvas.getBoundingClientRect();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scaleX = canvas.width / rect.width;
    scaleY = canvas.height / rect.height;
    halfWidth = canvas.width * 0.5;
    halfHeight = canvas.height * 0.5;
    rectLeft = rect.left;
    rectTop = rect.top;
    aspect = canvas.width / canvas.height;
    redraw = true;
}

let canvas = document.querySelector('#canvas');
let rect = null, scaleX = null, scaleY = null, halfWidth = null, halfHeight = null;
let rectLeft = null, rectTop = null, aspect = null;
resetSize();

const near = 0.1;
const far = 1000;

let ctx = canvas.getContext('2d');

let defaultRotationMatrix = mat4.fromValues(
    -0.309017, -0.755761,  0.577350,  0.000000,
    -0.809017, -0.110264, -0.577350,  0.000000,
     0.500000, -0.645497, -0.577350,  0.000000,
     0.000000,  0.000000,  0.000000,  1.000000
);
const rotationMatrix = mat4.clone(defaultRotationMatrix);

function doSomething()
{
    undoIdx += 1;
    while (undoIdx < undoList.length)
        undoList.pop();
    undoList[undoIdx] = structuredClone(undoList[undoIdx - 1]);
    faceList = undoList[undoIdx];
}

function saveState()
{
    const data = [ ];
    for (let i = 0; i < faceList.length; i++)
    {
        const f = faceList[i];
        data.push({ index: i, state: f.state, number: f.number, locked: f.locked, solution: f.solution });
    }
    const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "polykobe.json";
    a.click();
    URL.revokeObjectURL(url);
}

function loadPuzzle(puzzle)
{
    doSomething();
    for (const f of puzzle)
    {
        const face = faceList[f.index];
        if (!face) continue;
        face.state = f.state;
        if (f.number == undefined)
            face.number = null;
        else
            face.number = f.number;
        if (f.solution == undefined)
            face.solution = null;
        else
            face.solution = f.solution;
        face.locked = f.locked;
    }
    redraw = true;
}

function showSolution()
{
    doSomething();
    for (const f of faceList)
        f.state = f.solution;
    redraw = true;
}

function setSolution()
{
    doSomething();
    for (const f of faceList)
    {
        f.solution = f.state;
        if (f.number !== null)
            f.locked = true;
    }
    redraw = true;
}

function loadState(fileList)
{
    doSomething();
    if (!fileList.length) return;
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = function()
    {
        for (const f of JSON.parse(reader.result))
        {
            const face = faceList[f.index];
            if (!face) continue;
            face.state = f.state;
            if (f.number == undefined)
                face.number = null;
            else
                face.number = f.number;
            if (f.solution == undefined)
                face.solution = null;
            else
                face.solution = f.solution;
            face.locked = f.locked;
        }
    };
    reader.readAsText(file);
    redraw = true;
}

function resetRotation()
{
    mat4.copy(rotationMatrix, defaultRotationMatrix);
    redraw = true;
}

function toggleState()
{
    if (selectedFace !== null && !faceList[selectedFace].locked)
    {
        doSomething();
        faceList[selectedFace].state = (faceList[selectedFace].state + 1) % stateList.length;
    }
    redraw = true;
}

function defeat()
{
    const start = performance.now();
    const duration = 400;
    const colorInterval = 50;
    let lastColorChange = 0;

    function animate(now)
    {
        const elapsed = now - start;
        if (elapsed > duration)
        {
            for (const face of faceList)
                delete face._tempColor;
            redraw = true;
            return;
        }

        if (now - lastColorChange > colorInterval)
        {
            for (const face of faceList)
            {
                if (face._tempColor === "red")
                    face._tempColor = "black";
                else
                    face._tempColor = "red";
            }
            lastColorChange = now;
        }    

        redraw = true;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function victory()
{
    const start = performance.now();
    const duration = 2000;
    const colorInterval = 100;
    const colors = ["red", "lime", "yellow", "cyan", "magenta", "orange"];
    let lastColorChange = 0;

    function animate(now)
    {
        const elapsed = now - start;
        if (elapsed > duration)
        {
            for (const face of faceList)
                delete face._tempColor;
            redraw = true;
            return;
        }

        if (now - lastColorChange > colorInterval)
        {
            for (const face of faceList)
                face._tempColor = colors[Math.floor(Math.random() * colors.length)];
            lastColorChange = now;
        }    

        redraw = true;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function checkSolution()
{
    let winner = true;
    redraw = true;
    for (var face of faceList)
    {
        // unshaded is equal to unknown for this purpose
        if (face.solution != unknownState && face.state != face.solution)
        {
            winner = false;
            if (face.solution == shadedState)
                face._tempColor = "darkred";
            else if (face.solution == unshadedState)
                face._tempColor = "pink";
        }
    }
    if (winner)
        victory();
}

function clearMost()
{
    doSomething();
    for (var face of faceList)
    {
        if (face.locked)
            continue;
        if (face.number !== null)
        {
            face.state = unshadedState;
            face.locked = true;
        }
        else
        {
            face.state = unknownState;
        }
    }
    redraw = true;
}

function clearFaces()
{
    doSomething();
    for (var face of faceList)
    {
        if (!face.locked)
        {
            face.state = unknownState;
            face.number = null;
        }
    }
    redraw = true;
}

function unlockFaces()
{
    doSomething();
    for (var face of faceList)
        face.locked = false;
    redraw = true;
}

function toggleLock()
{
    doSomething();
    if (selectedFace !== null)
        faceList[selectedFace].locked = !faceList[selectedFace].locked;
    redraw = true;
}

function setNumber(n)
{
    doSomething();
    if (selectedFace !== null && !faceList[selectedFace].locked)
    {
        faceList[selectedFace].number = parseInt(n);
        faceList[selectedFace].solution = null;
    }
    redraw = true;
}

function animateRotation(axis, angle, steps = 20)
{
    let count = 0;
    const stepAngle = angle / steps;
    const rot = mat4.create();

    function step()
    {
        if (count++ >= steps) return;
        if (axis === 'x') mat4.fromXRotation(rot, stepAngle);
        else if (axis === 'y') mat4.fromYRotation(rot, stepAngle);
        else if (axis === 'z') mat4.fromZRotation(rot, stepAngle);
        mat4.multiply(rotationMatrix, rot, rotationMatrix);
        redraw = true;
        requestAnimationFrame(step);
    }
    step();
}

function getProjectionAndModelView()
{
    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();

    mat4.perspective(projectionMatrix, perspective / fovRatio, aspect, near, far);
    mat4.translate(modelViewMatrix, modelViewMatrix, [ 0, 0, -5 ]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [ perspective, perspective, perspective ]);
    mat4.multiply(modelViewMatrix, modelViewMatrix, rotationMatrix);

    return { projectionMatrix, modelViewMatrix };
}

function getTransformedVertices()
{
    const { projectionMatrix, modelViewMatrix } = getProjectionAndModelView();

    let result = [ ];
    for (const v of defaultVertexList)
    {
        const v4 = vec4.fromValues(v[0], v[1], v[2], 1);
        vec4.transformMat4(v4, v4, modelViewMatrix);
        vec4.transformMat4(v4, v4, projectionMatrix);

        const x = (v4[0] / v4[3]) * halfWidth;
        const y = -(v4[1] / v4[3]) * halfHeight;
        result.push([ x, y, 0 ]);
    }
    return result;
}

function pickFaceAtCanvasXY(x, y)
{
    const vertexList = getTransformedVertices();
    for (let idx = 0; idx < faceList.length; idx++)
    {
        const face = faceList[idx];
        const v1 = vertexList[face.vertices[0]];
        const v2 = vertexList[face.vertices[1]];
        const v3 = vertexList[face.vertices[2]];
        const v4 = vertexList[face.vertices[3]];
        if (!isFaceVisible(v1, v2, v3, v4)) continue;
        if (pointInFace([x, y], v1, v2, v3, v4))
            return idx;
    }
    return null;
}

function undo()
{
    if (undoIdx)
    {
        undoIdx -= 1;
        faceList = undoList[undoIdx];
        redraw = true;
    }
}

function redo()
{
    if (undoIdx + 1 < undoList.length)
    {
        undoIdx += 1;
        faceList = undoList[undoIdx];
        redraw = true;
    }
}

main();

function main()
{
    if (!ctx) return alert("Your browser sucks.");

    resetSize();

    window.addEventListener('resize', resetSize);
    
    document.addEventListener("keydown", (e) => {
        if (e.key === 'a') animateRotation('y', -rotateBy);
        else if (e.key === 'd') animateRotation('y', rotateBy);
        else if (e.key === 'w') animateRotation('x', -rotateBy);
        else if (e.key === 's') animateRotation('x', rotateBy);
        else if (e.key === 'q') animateRotation('z', rotateBy);
        else if (e.key === 'e') animateRotation('z', -rotateBy);
        else if (e.key === ' ') toggleState();
        else if (e.key === 'z') undo();
        else if (e.key === 'x') redo();
        else if (e.key === 'r') resetRotation();
        else if (/^[1-9]$/.test(e.key)) setNumber(e.key);
        else if (e.key === '0') setNumber(null);
        else if (e.key === 'l') toggleLock();
        else if (e.key === 'f') resetSize();        
        redraw = true;
    });
    
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    canvas.addEventListener("touchstart", (e) =>
    {
        if (e.touches.length == 1)
        {
            const x = (e.touches[0].clientX - rectLeft) * scaleX - halfWidth;
            const y = (e.touches[0].clientY - rectTop) * scaleY - halfHeight;
            selectedFace = pickFaceAtCanvasXY(x, y);
            redraw = true;
        }
    });
    
    canvas.addEventListener("mousedown", (e) =>
    {
        const x = (e.clientX - rectLeft) * scaleX - halfWidth;
        const y = (e.clientY - rectTop) * scaleY - halfHeight;
        selectedFace = pickFaceAtCanvasXY(x, y);

        if (e.button === 0)
        {
            isDragging = true;
            prevX = e.clientX;
            prevY = e.clientY;
        }
        else
        {
            toggleState();
            selectedFace = null;
        }
    });
    
    canvas.addEventListener("mouseup", () => {
        isDragging = false;
        redraw = true;
    });
    
    canvas.addEventListener("mouseleave", () => {
        isDragging = false;
        redraw = true;
    });
    
    canvas.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
    
        const angleX = dy * 0.01;
        const angleY = dx * 0.01;
    
        const rotX = mat4.create();
        const rotY = mat4.create();
        mat4.fromXRotation(rotX, angleX);
        mat4.fromYRotation(rotY, angleY);
        mat4.multiply(rotationMatrix, rotY, rotationMatrix);
        mat4.multiply(rotationMatrix, rotX, rotationMatrix);
        redraw = true;
    });

    document.getElementById("polyhedronName").value = polyhedronName;
    document.getElementById("numberOfFaces").value = faceList.length;
    document.getElementById("numberOfEdges").value = edgeList.length;
    document.getElementById("numberOfVertices").value = defaultVertexList.length;
    drawScene();
}

function pointInFace(p, a, b, c, d)
{
    function sign(p1, p2, p3)
    {
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) -
               (p2[0] - p3[0]) * (p1[1] - p3[1]);
    }

    function inTriangle(p, a, b, c)
    {
        const d1 = sign(p, a, b);
        const d2 = sign(p, b, c);
        const d3 = sign(p, c, a);
        const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        return !(hasNeg && hasPos);
    }

    return inTriangle(p, a, b, c) || inTriangle(p, c, d, a);
}

function isFaceVisible(v0, v1, v2, v3)
{
    const u1 = vec3.subtract([], v1, v0);
    const v1_ = vec3.subtract([], v2, v0);
    const n1 = vec3.cross([], u1, v1_);

    const u2 = vec3.subtract([], v3, v2);
    const v2_ = vec3.subtract([], v0, v2);
    const n2 = vec3.cross([], u2, v2_);

    const avg = vec3.add([], n1, n2);
    return avg[2] < 0;
}

function renderLock(face)
{
    if (face.locked)
    {
        const glyph = glyphList["lock"];
        const { projectionMatrix, modelViewMatrix } = getProjectionAndModelView();

        const v0 = defaultVertexList[face.vertices[0]];
        const v1 = defaultVertexList[face.vertices[1]];
        const v2 = defaultVertexList[face.vertices[2]];
        const v3 = defaultVertexList[face.vertices[3]];

        const xdir = vec3.normalize([], vec3.subtract([], v1, v0));
        const normal = vec3.normalize([], vec3.cross([], vec3.subtract([], v2, v1), xdir));
        const ydir = vec3.normalize([], vec3.cross([], xdir, normal));
        const offset = 0.04;
        const corner = vec3.scaleAndAdd([], v1, xdir, -offset);
        vec3.scaleAndAdd(corner, corner, ydir, offset);
        
        const glyphScale = 0.1;

        for (const [[x1, y1], [x2, y2]] of glyph)
        {
            const p1 = vec3.scaleAndAdd([], corner, xdir, x1 * glyphScale);
            vec3.scaleAndAdd(p1, p1, ydir, y1 * glyphScale);
            const p2 = vec3.scaleAndAdd([], corner, xdir, x2 * glyphScale);
            vec3.scaleAndAdd(p2, p2, ydir, y2 * glyphScale);

            const v4_1 = vec4.fromValues(p1[0], p1[1], p1[2], 1);
            const v4_2 = vec4.fromValues(p2[0], p2[1], p2[2], 1);

            vec4.transformMat4(v4_1, v4_1, modelViewMatrix);
            vec4.transformMat4(v4_1, v4_1, projectionMatrix);
            vec4.transformMat4(v4_2, v4_2, modelViewMatrix);
            vec4.transformMat4(v4_2, v4_2, projectionMatrix);

            const sx1 = (v4_1[0] / v4_1[3]) * halfWidth;
            const sy1 = -(v4_1[1] / v4_1[3]) * halfHeight;
            const sx2 = (v4_2[0] / v4_2[3]) * halfWidth;
            const sy2 = -(v4_2[1] / v4_2[3]) * halfHeight;

            ctx.beginPath();
            ctx.moveTo(sx1, sy1);
            ctx.lineTo(sx2, sy2);
            ctx.strokeStyle = "darkgreen";
            ctx.lineWidth = 2.0;
            ctx.stroke();
        }
    }
}

function drawScene()
{
    if (redraw == false)
    {
        window.requestAnimationFrame(drawScene);
        return;
    }
    redraw = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const vertexList = getTransformedVertices();

    // render each visible face
    for (const face of faceList)
    {
        const v1 = vertexList[face.vertices[0]];
        const v2 = vertexList[face.vertices[1]];
        const v3 = vertexList[face.vertices[2]];
        const v4 = vertexList[face.vertices[3]];
        
        if (!isFaceVisible(v1, v2, v3, v4))
            continue;

        ctx.save();
        ctx.translate(halfWidth, halfHeight);
    
        if (selectedFace !== null && faceList[selectedFace] == face)
        {
            ctx.lineWidth = 8;
            ctx.strokeStyle = selectedColor;
        }
        else
        {
            ctx.lineWidth = 2;
            ctx.strokeStyle = edgeColor;
        }

        ctx.beginPath();
        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.lineTo(v3[0], v3[1]);        
        ctx.lineTo(v4[0], v4[1]);        

        ctx.closePath();
        if (face._tempColor)
        {
            ctx.fillStyle = face._tempColor;
            face._tempColor = null;
        }
        else
            ctx.fillStyle = stateColorList[stateList[face.state]];
        
        ctx.fill();
        ctx.stroke();

        renderLock(face);

        const glyph = glyphList[face.number];
        if (glyph)
        {
            const { projectionMatrix, modelViewMatrix } = getProjectionAndModelView();
        
            const glyphScale = 0.3;
        
            const v0 = defaultVertexList[face.vertices[0]];
            const v1 = defaultVertexList[face.vertices[1]];
            const v2 = defaultVertexList[face.vertices[2]];
            const v3 = defaultVertexList[face.vertices[3]];

            const center = [
                (v0[0] + v1[0] + v2[0] + v3[0]) / 4,
                (v0[1] + v1[1] + v2[1] + v3[1]) / 4,
                (v0[2] + v1[2] + v2[2] + v3[2]) / 4
            ];

            const xdir = vec3.normalize([], vec3.subtract([], v1, v0));
            const normal = vec3.normalize([], vec3.cross([], xdir, vec3.subtract([], v2, v0)));
            const ydir = vec3.normalize([], vec3.cross([], normal, xdir));
        
            for (const [ [x1, y1], [x2, y2] ] of glyph)
            {
                const p1 = vec3.scaleAndAdd([], center, xdir, x1 * glyphScale);
                vec3.scaleAndAdd(p1, p1, ydir, y1 * glyphScale);
                const p2 = vec3.scaleAndAdd([], center, xdir, x2 * glyphScale);
                vec3.scaleAndAdd(p2, p2, ydir, y2 * glyphScale);
        
                const v4_1 = vec4.fromValues(p1[0], p1[1], p1[2], 1);
                const v4_2 = vec4.fromValues(p2[0], p2[1], p2[2], 1);
        
                vec4.transformMat4(v4_1, v4_1, modelViewMatrix);
                vec4.transformMat4(v4_1, v4_1, projectionMatrix);
                vec4.transformMat4(v4_2, v4_2, modelViewMatrix);
                vec4.transformMat4(v4_2, v4_2, projectionMatrix);
        
                const sx1 = (v4_1[0] / v4_1[3]) * halfWidth;
                const sy1 = -(v4_1[1] / v4_1[3]) * halfHeight;
                const sx2 = (v4_2[0] / v4_2[3]) * halfWidth;
                const sy2 = -(v4_2[1] / v4_2[3]) * halfHeight;
        
                ctx.beginPath();
                ctx.moveTo(sx1, sy1);
                ctx.lineTo(sx2, sy2);
                ctx.strokeStyle = glyphColor;
                ctx.lineWidth = 4.0;
                ctx.stroke();
            }
        }
                
        ctx.restore();
    }

    window.requestAnimationFrame(drawScene);
}
