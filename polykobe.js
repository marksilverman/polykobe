const φ = (1 + Math.sqrt(5)) / 2;
const π = Math.pi;
const edges = [
    [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
    [1, 5], [1, 7], [1, 8], [1, 9],
    [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
    [3, 4], [3, 6], [3, 8], [3, 9],
    [4, 5], [4, 9], [4, 11],
    [5, 9], [5, 11],
    [6, 7], [6, 8], [6, 10],
    [7, 8], [7, 10],
    [8, 9],
    [10, 11]
];

const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var camX = 0.0, camY = 0.0, camZ = 0.0;
var proX = 0.28, proY = 0.0, proZ = -0.3333;
var speedX = 0.01, speedY = 0.01, speedZ = 0.0;
var scale = 120.0, speedOff = 0.0, speedOffSign = 1.0, lineWidth = 3, offset = 2.5, maxOffset = 4.0, raf = 0;

var colorMgr =
{
    red: 100, green: 200, blue: 50, radd: 2, gadd: -2, badd: 2, inColor: true, fgColor: '',
    randomize: function ()
    {
        this.red = 100 + Math.floor(Math.random() * 100);
        this.green = 100 + Math.floor(Math.random() * 100);
        this.blue = 100 + Math.floor(Math.random() * 100);
    },
    flip: function()
    {
        this.inColor = !this.inColor;
    },
    add: function(color, adder)
    {
        color += adder;
        if (color > 255) {
            color = 255;
            adder *= -1;
        }
        if (color < 100) {
            color = 100;
            adder *= -1;
        }
        return [ color, adder ];
    },
    next: function()
    {
        if (!this.inColor)
            return;
        [this.red, this.radd] = this.add(this.red, this.radd);
        [this.green, this.gadd] = this.add(this.green, this.gadd);
        [this.blue, this.badd] = this.add(this.blue, this.badd);
        this.fgColor='rgba(' + this.red + ',' + this.green + ',' + this.blue + ')';
        this.faceColor = this.fgColor;
        this.edgeColor = 'rgba(100,100,100)';
    }
}

main();

function main()
{
    if (!ctx)
        return alert("Your browser doesn\'t support something.");

    colorMgr.randomize();
    drawScene();
}

function rotate(xyz, center)
{
    vec3.rotateX(xyz, xyz, center, camX);
    vec3.rotateY(xyz, xyz, center, camY);
    vec3.rotateZ(xyz, xyz, center, camZ);
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
    colorMgr.next();

    ctx.save();
    // ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    // ctx.beginPath();

    let center = [ 0.0, 0.0, 0.0 ];

    vertices = [
        [ scale * -1, scale *  φ , 0],
        [ scale *  1, scale *  φ , 0],
        [ scale * -1, scale * -φ , 0],
        [ scale *  1, scale * -φ , 0],

        [ 0, scale * -1, scale *  φ ],
        [ 0, scale *  1, scale *  φ ],
        [ 0, scale * -1, scale * -φ ],
        [ 0, scale *  1, scale * -φ ],

        [ scale *  φ, 0, scale * -1 ],
        [ scale *  φ, 0, scale *  1 ],
        [ scale * -φ, 0, scale * -1 ],
        [ scale * -φ, 0, scale *  1 ]
    ];

    for (v of vertices)
        rotate(v, center);

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
        ctx.fillStyle = colorMgr.faceColor;
        ctx.fill();
        ctx.strokeStyle = colorMgr.edgeColor;
        ctx.stroke();
        ctx.restore();
    }
        
    /*
    for (const [i, j] of edges)
    {
        ctx.moveTo(vertices[i][0], vertices[i][1]);
        ctx.lineTo(vertices[j][0], vertices[j][1]);
    }
        
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = colorMgr.fgColor;
    ctx.stroke();
    ctx.restore();
*/
    if (speedOff)
    {
        if (offset > maxOffset)
        {
            offset = maxOffset;
            speedOffSign = -1;
        }
        if (offset < -1 * maxOffset)
        {
            offset = -1 * maxOffset;
            speedOffSign = 1;
        }
        offset += speedOffSign * speedOff;
        document.getElementById("offset").value = offset;
    }

    if (speedX)
    {
        camX += speedX;
        if (camX > 6.28) camX = 0.0;
        document.getElementById("camX").value = camX;
    }
    if (speedY)
    {
        camY += speedY;
        if (camY > 6.28) camY = 0.0;
        document.getElementById("camY").value = camY;
    }
    if (speedZ > 0.0)
    {
        camZ += speedZ;
        if (camZ > 6.28) camZ = 0.0;
        document.getElementById("camZ").value = camZ;
    }

    raf = window.requestAnimationFrame(drawScene);
}

function toggleAutoX()
{
    autoX = !autoX;
    document.getElementById("speedX").disabled = !autoX;
}
function toggleAutoY()
{
    autoY = !autoY;
    document.getElementById("speedY").disabled = !autoY;
}
function toggleAutoZ()
{
    autoZ = !autoZ;
    document.getElementById("speedZ").disabled = !autoZ;
}

function randomize()
{
    proX = proY = 0.0;

    if (Math.random() > 0.5)
        proX = (Math.random() * 0.7).toPrecision(2);
    else
        proY = (Math.random() * 0.7).toPrecision(2);
    proZ = Math.random().toPrecision(2);

    document.getElementById("proX").value = document.getElementById("proXdisp").value = proX;
    document.getElementById("proY").value = document.getElementById("proYdisp").value = proY;
    document.getElementById("proZ").value = document.getElementById("proZdisp").value = proZ;
    colorMgr.randomize();
    if (!raf) pause();
}

function pause()
{
    if (document.getElementById("pause").innerHTML == "pause")
    {
        window.cancelAnimationFrame(raf);
        document.getElementById("pause").innerHTML = "unpause";
        raf = 0;
    }
    else
    {
        document.getElementById("pause").innerHTML =  "pause";
        drawScene();
    }
}

function msg(info)
{
    document.getElementById("msg").innerHTML=info;
}

