const φ = (1 + Math.sqrt(5)) / 2;
const edgeColor = "orange";
const defaultColor = "gray";
const center = [ 0.0, 0.0, 0.0 ];
const defaultVertexList = [
    [ -1,  φ,  0 ], [ 1, φ, 0 ], [ -1, -φ , 0 ], [  1, -φ , 0 ],
    [  0, -1,  φ ], [ 0, 1, φ ], [  0, -1, -φ ], [  0,  1, -φ ],
    [  φ,  0, -1 ], [ φ, 0, 1 ], [ -φ,  0, -1 ], [ -φ,  0,  1 ]
];

const stateList = [ "unknown", "shaded", "unshaded" ];
const stateColorList = { unknown: "gray", shaded: "black", unshaded: "white" };
const defaultState = 0;

// each face has three vertices (each one is an index into the vertex array)
// plus optional color and text
var faceList = [ ]
function pushFace(a, b, c, new_state = defaultState, new_text = "", new_locked = false) {
    faceList.push({ vidx1: a, vidx2: b, vidx3: c, state: new_state, text: new_text, locked: new_locked });
}
pushFace(0, 11, 5); pushFace(0, 5, 1); pushFace(0, 1, 7); pushFace(0, 7, 10); pushFace(0, 10, 11);
pushFace(1, 5, 9); pushFace(5, 11, 4); pushFace(11, 10, 2, 1, "3", true); pushFace(10, 7, 6); pushFace(7, 1, 8);
pushFace(3, 9, 4); pushFace(3, 4, 2); pushFace(3, 2, 6); pushFace(3, 6, 8); pushFace(3, 8, 9);
pushFace(4, 9, 5); pushFace(2, 4, 11); pushFace(6, 2, 10); pushFace(8, 6, 7, 2, "3", true); pushFace(9, 8, 1);

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let rotationMatrix = mat4.create();
let scale = 100.0;
let prevX = 0, prevY = 0;
let isDragging = false, redraw = true;

main();

function main()
{
    if (!ctx) return alert("Your browser sucks.");

    document.getElementById("resetRotation").addEventListener("click", () => {
        mat4.identity(rotationMatrix);
        redraw = true;
    });
    
    canvas.addEventListener("click", (e) => {
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
    
        for (const face of faceList)
        {
            const v1 = vertexList[face.vidx1];
            const v2 = vertexList[face.vidx2];
            const v3 = vertexList[face.vidx3];
    
            if (!isFaceVisible(v1, v2, v3)) continue;
    
            const p1 = [v1[0] + canvas.width * 0.5, v1[1] + canvas.height * 0.5];
            const p2 = [v2[0] + canvas.width * 0.5, v2[1] + canvas.height * 0.5];
            const p3 = [v3[0] + canvas.width * 0.5, v3[1] + canvas.height * 0.5];

            if (pointInTriangle([x, y], v1, v2, v3))
            {
                if (face.locked == false)
                {
                    face.state = (face.state + 1) % stateList.length;
                    redraw = true;
                }
                break;
            }
        }
    });
    
    canvas.addEventListener("mousedown", (e) => {
        redraw = true;
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
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
    
        ctx.beginPath();
        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.lineTo(v3[0], v3[1]);
        ctx.closePath();
        ctx.fillStyle = stateColorList[stateList[face.state]];

        ctx.fill();
        ctx.strokeStyle = edgeColor;
        ctx.stroke();

        if (face.text === "3")
        {
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
        
            const glyph3 = [
                [[-0.3,  0.3], [ 0.2,  0.3]],
                [[ 0.2,  0.3], [ 0.2,  0.0]],
                [[ 0.2,  0.0], [-0.2,  0.0]],
                [[ 0.2,  0.0], [ 0.2, -0.3]],
                [[ 0.2, -0.3], [-0.3, -0.3]],
                [[ 0.2, -0.45], [-0.3, -0.45]]
            ];
        
            for (const [ [x1, y1], [x2, y2] ] of glyph3)
            {
                const p1 = [
                    center[0] + scale * (x1 * xdir[0] + y1 * ydir[0]),
                    center[1] + scale * (x1 * xdir[1] + y1 * ydir[1])
                ];
                const p2 = [
                    center[0] + scale * (x2 * xdir[0] + y2 * ydir[0]),
                    center[1] + scale * (x2 * xdir[1] + y2 * ydir[1])
                ];
        
                ctx.beginPath();
                ctx.moveTo(p1[0], p1[1]);
                ctx.lineTo(p2[0], p2[1]);
                ctx.strokeStyle = "red";
                ctx.lineWidth = 4.0 * (scale / 100.0);
                ctx.stroke();
            }
        }
        
        
        ctx.restore();
    }

    window.requestAnimationFrame(drawScene);
}
