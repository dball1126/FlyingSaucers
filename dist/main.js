

function drawCanvas() {
    disablePlayButton(); //Disabled game until clicked
    const canvas = document.getElementById("flyingCanvas");
    const ctx = canvas.getContext("2d");
    
    let x = canvas.width / 7;
    let y = canvas.height / 1.2;
    let dx = 3.6;
    let dy = -1.9;    //metrics for speed velocity of the discs
    let status = 1;
    let score = 0;
    let discRadius = 50;   //size of the disc

    let discArray = [];

    const target = {
        x: undefined,
        y: undefined
    }

    canvas.addEventListener('mousedown',
        function (event) {
            target.x = event.clientX - canvas.offsetLeft;
            target.y = event.clientY - canvas.offsetTop;
            //target position
        });


    function collisionDetection() {
        for (let i = 0; i < discArray.length; i++) {
            var unit = discArray[i];
            if (unit.status == 1) {
                if (target.x > unit.x && target.x < unit.x + unit.discRadius && target.y > unit.y && target.y < unit.y + unit.discRadius) {
                    unit.status = 0;   //change disc status
                    score++;  //score count
                    if (score >= 28) {
                        gameWonSound();
                        alert("YOU WiN");
                        document.location.reload();
                        clearInterval(interval);
                    }
                    if (score == discArray.length) {
                        // alert("ON FiRE!");  //TURN OVER
                        // document.location.reload();
                        // clearInterval(interval);
                        let sounder = playSound();
                        soundID += 1; //increment  per level completed

                        //Messages FOR ALL left right and bottom sidebar/footer
                        const footerMessage = `${sounder}`;
                        const footerTemplate = `<h1>${footerMessage}</h1>`;
                        render(footerTemplate, document.querySelector('#footer-messages'));

                        const leftMessage = `${sounder}`;
                        const leftTemplate = `<p class="sideMessage">${leftMessage}</p>`;
                        render(leftTemplate, document.querySelector('#left-sidebar'));


                        const rightMessage = `${sounder}`;
                        const rightTemplate = `<p class="sideMessage">${rightMessage}</p>`;
                        render(rightTemplate, document.querySelector('#right-sidebar'));


                        turn();  //REPEAT TURN INDEFINITELY UNTIL THEY LOSE
                    }
                }
            }
        }
    }

    const turn = () => {
        for (let i = 0; i < 8; i++) {
            //initiation of discs
            const xx = Math.random() * (canvas.width / 7);
            const yy = Math.random() * (canvas.height / 1.2);
            const dxx = (Math.random()) * 3.6;
            const dyy = (Math.random()) * -1.9;
            const radius = 50;
            discArray.push(new Disc(xx, yy, dxx, dyy, radius, status));
        }
    }

    function Disc(x, y, dx, dy, discRadius, status) {  //Disc class
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.discRadius = discRadius;
        this.status = status;
        this.imageWidth = 144; //actual width and height of the disc.png
        this.imageHeight = 66;

        this.draw = function () {
            const image = new Image();
            image.onload = Disc;
            image.src = "assets/saucer4.png";

            ctx.beginPath();
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;


            ctx.drawImage(image, this.x, this.y, this.imageWidth, this.imageHeight);
            ctx.arc(this.x, this.y, this.discRadius, 0, Math.PI * 2, false); //arc along with up above
            ctx.closePath();
        }

        this.update = function () {   //WHERE THE REAL MAGIC HAPPENS  the disc is drawn here.
            if (this.y + this.discRadius > canvas.height || this.y - this.discRadius < 0) {
                this.dy = -this.dy;
            } else if (this.x > canvas.width) {  //Does the disc fall off the right side of the screen
                //GAME OVER
                gameOverSound();
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            }

            this.x += this.dx;  //arc speed along with up above
            this.y += this.dy;
            this.imageWidth -= .09;  //change size of image as game progresses
            this.imageHeight -= .009;  // Height should get smaller due to it being less than half of the width of the disc

            this.draw();
        }
    }

    const drawScore = () => {

        ctx.font = "16px Sans Serif";
        ctx.fillStyle = 'red';
        ctx.fillText("Score: " + score, 8, 20);
    }

    const drawMessage = () => {
        ctx.font = "32px Arial";
        ctx.fillStyle = "orange";
        ctx.fillText("ON FIRE!", 8, 20);
    }


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear frames

        for (let i = 0; i < discArray.length; i++) {
            if (discArray[i].status == 1) {  //check if the disc has been hit
                discArray[i].update();   //discs continually drawn 
            }
        }
        collisionDetection();
        drawScore();

        x += dx;
        y += dy * Math.random(199);     //set for the speed of the discs
    }
    turn();
    var interval = setInterval(draw, 10);
}


