// polykobe.js
//
const rotateBy = Math.PI / 6;
const edgeColor = "orange";
const selectedColor = "purple"
const defaultColor = "gray";
const glyphColor = "orange";
const stateList = [ "unknown", "shaded", "unshaded" ];
const stateColorList = { unknown: "white", shaded: "black", unshaded: "green" };
const unknownState = 0, shadedState = 1, unshadedState = 2;

let canvas = document.querySelector('#canvas');
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;
const halfWidth = canvas.width * 0.5;
const halfHeight = canvas.height * 0.5;
const rectLeft = rect.left;
const rectTop = rect.top;

let ctx = canvas.getContext('2d');

let defaultRotationMatrix = mat4.fromValues(
    -0.309017, -0.755761,  0.577350,  0.000000,
    -0.809017, -0.110264, -0.577350,  0.000000,
     0.500000, -0.645497, -0.577350,  0.000000,
     0.000000,  0.000000,  0.000000,  1.000000
);
const rotationMatrix = mat4.clone(defaultRotationMatrix);

let fov = 0.5, zoom = 2.0, /*scale = 0.5, */ prevX = 0, prevY = 0;
let isDragging = false, redraw = true;
let selectedFace = null;

function saveState()
{
    const data = [ ];
    for (let i = 0; i < faceList.length; i++)
    {
        const f = faceList[i];
        data.push({ index: i, state: f.state, number: f.number, locked: f.locked });
    }
    const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "polykobe.json";
    a.click();
    URL.revokeObjectURL(url);
}

function loadState(fileList)
{
    if (!fileList.length) return;
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            for (const f of data)
            {
                const face = faceList[f.index];
                if (!face) continue;
                face.state = f.state;
                face.number = f.number;
                if (f.state !== unknownState) face.locked = true;
            }
        } catch {}
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
    if (selectedFace && !selectedFace.locked)
        selectedFace.state = (selectedFace.state + 1) % stateList.length;
    redraw = true;
}

function clearFaces()
{
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
    for (var face of faceList)
        face.locked = false;
    redraw = true;
}

function unlock()
{
    if (selectedFace)
        selectedFace.locked = false;
}

function lock()
{
    if (selectedFace)
        selectedFace.locked = true;
}

function setNumber(n)
{
    if (selectedFace && !selectedFace.locked)
        selectedFace.number = parseInt(n);
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

function getTransformedVertices()
{
    //const fov = Math.PI * 0.5 * fov; // scale / 400.0;
    const aspect = canvas.width / canvas.height;
    const near = 0.1;
    const far = 10;

    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();

    mat4.perspective(projectionMatrix, Math.PI * 0.5 * fov, aspect, near, far);
    mat4.translate(modelViewMatrix, modelViewMatrix, [ 0, 0, -5 * zoom ]);
    //mat4.scale(modelViewMatrix, modelViewMatrix, [ scale, scale, scale ]);
    mat4.multiply(modelViewMatrix, modelViewMatrix, rotationMatrix);

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
    for (const face of faceList)
    {
        const v1 = vertexList[face.vertices[0]];
        const v2 = vertexList[face.vertices[1]];
        const v3 = vertexList[face.vertices[2]];
        if (!isFaceVisible(v1, v2, v3)) continue;
        if (pointInTriangle([x, y], v1, v2, v3))
            return face;
    }
    return null;
 }

main();

function main()
{
    if (!ctx) return alert("Your browser sucks.");

    document.addEventListener("keydown", (e) => {
        if (e.key === 'a') animateRotation('y', -rotateBy);
        else if (e.key === 'd') animateRotation('y', rotateBy);
        else if (e.key === 'w') animateRotation('x', rotateBy);
        else if (e.key === 's') animateRotation('x', -rotateBy);
        else if (e.key === 'q') animateRotation('z', -rotateBy);
        else if (e.key === 'e') animateRotation('z', rotateBy);
        else if (e.key === ' ') toggleState();
        else if (e.key === 'r') resetRotation();
        else if (/^[1-9]$/.test(e.key)) setNumber(e.key);
        else if (e.key === '0') setNumber(null);
        else if (e.key === 'u') unlock();
        else if (e.key === 'l') lock();
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
        mat4.fromYRotation(rotY, -angleY);
        mat4.multiply(rotationMatrix, rotY, rotationMatrix);
        mat4.multiply(rotationMatrix, rotX, rotationMatrix);
        redraw = true;
    });

    document.getElementById("polyhedronName").value = polyhedronName;
    drawScene();
}

function pointInTriangle(p, a, b, c)
{
    function sign(p1, p2, p3)
    {
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) -
               (p2[0] - p3[0]) * (p1[1] - p3[1]);
    }
    const d1 = sign(p, a, b);
    const d2 = sign(p, b, c);
    const d3 = sign(p, c, a);
    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(hasNeg && hasPos);
}

function isFaceVisible(v0, v1, v2)
{
    const u = vec3.subtract([], v1, v0);
    const v = vec3.subtract([], v2, v0);
    const normal = vec3.cross([], u, v);
    return normal[2] < 0;
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
        
        if (!isFaceVisible(v1, v2, v3))
            continue;

        ctx.save();
        ctx.translate(halfWidth, halfHeight);
    
        if (selectedFace == face)
        {
            ctx.lineWidth = 8.0; // * (scale / 200.0);
            ctx.strokeStyle = selectedColor;
        }
        else
        {
            ctx.lineWidth = 1.0; // * (scale / 200.0);
            ctx.strokeStyle = edgeColor;
        }

        ctx.beginPath();
        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.lineTo(v3[0], v3[1]);        

        ctx.closePath();
        ctx.fillStyle = stateColorList[stateList[face.state]];

        ctx.fill();
        ctx.stroke();

        let glyph = glyphList[face.number];
        if (glyph)
        {
            const glyphScale = 80;

            const center = [
                (v1[0] + v2[0] + v3[0]) / 3,
                (v1[1] + v2[1] + v3[1]) / 3,
                0
            ];
        
            const xdir = vec3.subtract([], v2, v1);
            vec3.normalize(xdir, xdir);
        
            const temp = vec3.subtract([], v3, v1);
            const normal = vec3.cross([], xdir, temp);
            vec3.normalize(normal, normal);
        
            const ydir = vec3.cross([], normal, xdir);
            vec3.normalize(ydir, ydir);
        
            for (const [ [x1, y1], [x2, y2] ] of glyph)
            {
                const p1 = [
                    center[0] + glyphScale * (x1 * xdir[0] + y1 * ydir[0]),
                    center[1] + glyphScale * (x1 * xdir[1] + y1 * ydir[1])
                ];
                const p2 = [
                    center[0] + glyphScale * (x2 * xdir[0] + y2 * ydir[0]),
                    center[1] + glyphScale * (x2 * xdir[1] + y2 * ydir[1])
                ];
        
                ctx.beginPath();
                ctx.moveTo(p1[0], p1[1]);
                ctx.lineTo(p2[0], p2[1]);
                ctx.strokeStyle = glyphColor;
                ctx.lineWidth = 2.0;
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    window.requestAnimationFrame(drawScene);
}
