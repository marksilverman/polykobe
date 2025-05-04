const φ = (1 + Math.sqrt(5)) / 2;
const edgeColor = "white";
const defaultColor = "gray";
const center = [ 0.0, 0.0, 0.0 ];
const defaultVertices = [
    [ -1,  φ,  0 ], [ 1, φ, 0 ], [ -1, -φ , 0 ], [  1, -φ , 0 ],
    [  0, -1,  φ ], [ 0, 1, φ ], [  0, -1, -φ ], [  0,  1, -φ ],
    [  φ,  0, -1 ], [ φ, 0, 1 ], [ -φ,  0, -1 ], [ -φ,  0,  1 ]
];

// each face has three vertices (each one is an index into the vertex array)
// plus optional color and text
var faces = [ ]
function pushFace(a, b, c, faceColor = defaultColor, faceText = "") {
    faces.push({ vertex: [a, b, c], color: faceColor, text: faceText });
}
pushFace(0, 11, 5); pushFace(0, 5, 1); pushFace(0, 1, 7); pushFace(0, 7, 10); pushFace(0, 10, 11);
pushFace(1, 5, 9); pushFace(5, 11, 4, "green"); pushFace(11, 10, 2); pushFace(10, 7, 6); pushFace(7, 1, 8);
pushFace(3, 9, 4); pushFace(3, 4, 2); pushFace(3, 2, 6, "blue"); pushFace(3, 6, 8); pushFace(3, 8, 9);
pushFace(4, 9, 5); pushFace(2, 4, 11); pushFace(6, 2, 10); pushFace(8, 6, 7); pushFace(9, 8, 1);

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var rotX = 0.0, rotY = 0.0;
var scale = 100.0;
var prevX = 0, prevY = 0;
var isDragging = false, redraw = true;

main();

function main()
{
    if (!ctx) return alert("Your browser sucks.");

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
        if (isDragging)
        {
            redraw = true;
            const dx = e.clientX - prevX;
            const dy = e.clientY - prevY;
        
            const sensitivity = 0.01;
            rotY -= dx * sensitivity;
            rotX += dy * sensitivity;
        
            prevX = e.clientX;
            prevY = e.clientY;
        }
    });
        
    drawScene();
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
    const vertices = defaultVertices.map(v => v.slice());

    // scale and rotate each vertex
    for (xyz of vertices)
    {
        vec3.scale(xyz, xyz, scale);
        vec3.rotateX(xyz, xyz, center, rotX);
        vec3.rotateY(xyz, xyz, center, rotY);
    }

    // render each visible face
    for (const face of faces)
    {
        const { vertex: [a, b, c] } = face;
        const v1 = vertices[a];
        const v2 = vertices[b];
        const v3 = vertices[c];
        
        if (!isFaceVisible(v1, v2, v3))
            continue;

        ctx.save();
        ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    
        ctx.beginPath();
        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.lineTo(v3[0], v3[1]);
        ctx.closePath();
        ctx.fillStyle = face.color;
        ctx.fill();
        ctx.strokeStyle = edgeColor;
        ctx.stroke();
        ctx.restore();
    }

    window.requestAnimationFrame(drawScene);
}
