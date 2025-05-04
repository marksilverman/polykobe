const φ = (1 + Math.sqrt(5)) / 2;
const π = Math.pi;
const faceColor = "green";
const edgeColor = "white";
const center = [ 0.0, 0.0, 0.0 ];
const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var camX = 0.0, camY = 0.0, camZ = 0.0;
var scale = 100.0, raf = 0, prevX = 0, prevY = 0;
var isDragging = false;

main();

function main()
{
    if (!ctx) return alert("Your browser sucks.");

    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });
    
    canvas.addEventListener("mouseup", () => {
        isDragging = false;
    });
    
    canvas.addEventListener("mouseleave", () => {
        isDragging = false;
    });
    
    canvas.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
    
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
    
        const sensitivity = 0.01;
        camY -= dx * sensitivity;
        camX += dy * sensitivity;
    
        prevX = e.clientX;
        prevY = e.clientY;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    vertices = [
        [ -1,  φ,  0 ], [ 1, φ, 0 ], [ -1, -φ , 0 ], [  1, -φ , 0 ],
        [  0, -1,  φ ], [ 0, 1, φ ], [  0, -1, -φ ], [  0,  1, -φ ],
        [  φ,  0, -1 ], [ φ, 0, 1 ], [ -φ,  0, -1 ], [ -φ,  0,  1 ]
    ];

    for (xyz of vertices)
    {
        vec3.scale(xyz, xyz, scale);
        vec3.rotateX(xyz, xyz, center, camX);
        vec3.rotateY(xyz, xyz, center, camY);
        vec3.rotateZ(xyz, xyz, center, camZ);
    }

    for (const [a, b, c] of faces)
    {
        const v0 = vertices[a];
        const v1 = vertices[b];
        const v2 = vertices[c];
        
        if (!isFaceVisible(v0, v1, v2))
            continue;

        ctx.save();
        ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    
        ctx.beginPath();
        ctx.moveTo(v0[0], v0[1]);
        ctx.lineTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.closePath();
        ctx.fillStyle = faceColor;
        ctx.fill();
        ctx.strokeStyle = edgeColor;
        ctx.stroke();
        ctx.restore();
    }

    raf = window.requestAnimationFrame(drawScene);
}
