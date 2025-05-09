// polykobe.js
//
const φ = (1 + Math.sqrt(5)) / 2;
const rotateBy = Math.PI / 6;
const edgeColor = "orange";
const defaultColor = "gray";
const center = [ 0.0, 0.0, 0.0 ];
const stateList = [ "unknown", "shaded", "unshaded" ];
const stateColorList = { unknown: "white", shaded: "black", unshaded: "green" };
const defaultState = 0;

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let rotationMatrix = mat4.fromValues(
    -0.309017, -0.755761,  0.577350,  0.000000,
    -0.809017, -0.110264, -0.577350,  0.000000,
     0.500000, -0.645497, -0.577350,  0.000000,
     0.000000,  0.000000,  0.000000,  1.000000
);
const defaultRotation = mat4.clone(rotationMatrix);

let scale = 300.0, prevX = 0, prevY = 0;
let isDragging = false, redraw = true;
let selectedFace = null;

function saveState()
{
    //for (var i = 0; i < faceList.length; i++)
    //{
    //    const face = faceList[i];
    //}
    const data=faceList.map(f => ({
        vidx1: f.vidx1,
        vidx2: f.vidx2,
        vidx3: f.vidx3,
        state: f.state,
        number: f.number,
        locked: f.locked
    }));
    const blob=new Blob([JSON.stringify(data)], {type: "application/json"});
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
                const match = faceList.find(x =>
                    x.vidx1===f.vidx1 && x.vidx2===f.vidx2 && x.vidx3===f.vidx3);
                if (match)
                {
                    match.state = f.state;
                    match.number = f.number;
                    if (f.number !== undefined)
                        match.state = 2;
                    if (f.state != 0)
                        match.locked=true;
                }
            }
            redraw = true;
        } catch {}
    };
    reader.readAsText(file);
}

function resetRotation()
{
    mat4.copy(rotationMatrix, defaultRotation);
    redraw = true;
}

function toggleState()
{
    redraw = true;
    if (selectedFace)
        selectedFace.state = (selectedFace.state + 1) % stateList.length;
}

function clearFaces()
{
    console.log("clearFaces()");
    for (var face of faceList)
    {
        if (face.state == 1)
            face.state = 0;
        if (face.state == 2)
            face.state = 0;
        if (face.number !== undefined)
            face.state = 2;
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

main();

function main()
{
    if (!ctx) return alert("Your browser sucks.");

    document.addEventListener("keydown", (e) => {
        if (e.key === 'a') animateRotation('y', -rotateBy);
        else if (e.key === 'd') animateRotation('y', rotateBy);
        else if (e.key === 'w') animateRotation('x', -rotateBy);
        else if (e.key === 's') animateRotation('x', rotateBy);
        else if (e.key === 'q') animateRotation('z', -rotateBy);
        else if (e.key === 'e') animateRotation('z', rotateBy);
        else if (e.key === ' ') toggleState();
        else if (e.key === 'r') resetRotation();
        else if (selectedFace && /^[1-9]$/.test(e.key)) selectedFace.number = parseInt(e.key);
        else if (selectedFace && e.key === '0') selectedFace.number = undefined;
        redraw = true;
    });
    
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    
    canvas.addEventListener("mousedown", (e) =>
    {
        redraw = true;
        if (e.button === 0)
        {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX - canvas.width * 0.5;
            const y = (e.clientY - rect.top) * scaleY - canvas.height * 0.5;
    
            const vertexList = defaultVertexList.map(v => v.slice());
            for (const xyz of vertexList)
                {
                vec3.scale(xyz, xyz, scale);
                vec3.transformMat4(xyz, xyz, rotationMatrix);
            }
    
            for (var i = 0; i < faceList.length; i++)
            {
                const face = faceList[i];
                const v1 = vertexList[face.vidx1];
                const v2 = vertexList[face.vidx2];
                const v3 = vertexList[face.vidx3];
    
                if (!isFaceVisible(v1, v2, v3)) continue;
                if (pointInTriangle([x, y], v1, v2, v3))
                {
                    if (selectedFace == face)
                        selectedFace = null;
                    else
                        selectedFace = face;
                    break;
                }
                else
                    selectedFace = null;
            }
        }

        if (e.button === 0)
        {
            isDragging = true;
            prevX = e.clientX;
            prevY = e.clientY;
        }
    });
    
    canvas.addEventListener("mouseup", () => {
        redraw = true;
        isDragging = false;
    });
    
    canvas.addEventListener("mouseleave", () => {
        redraw = true;
        isDragging = false;
    });
    
    canvas.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        redraw = true;
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
    });

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
    const vertexList = defaultVertexList.map(v => v.slice());

    // scale and rotate each vertex
    for (xyz of vertexList)
    {
        vec3.scale(xyz, xyz, scale);
        vec3.transformMat4(xyz, xyz, rotationMatrix);
    }

    // render each visible face
    for (const face of faceList)
    {
        const v1 = vertexList[face.vidx1];
        const v2 = vertexList[face.vidx2];
        const v3 = vertexList[face.vidx3];
        
        if (!isFaceVisible(v1, v2, v3))
            continue;

        ctx.save();
        ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    
        if (selectedFace == face)
        {
            ctx.lineWidth = 8.0 * (scale / 200.0);
            ctx.strokeStyle = "purple";
        }
        else
        {
            ctx.lineWidth = 1.0 * (scale / 200.0);
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
            const glyphScale = scale / 3.0;

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
                ctx.strokeStyle = "white";
                ctx.lineWidth = 2.0 * (scale / 100.0);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    window.requestAnimationFrame(drawScene);
}
