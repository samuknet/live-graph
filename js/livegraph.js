window.LiveGraph = window.LiveGraph || (function() {

    function Pt(x, y) {
        return [x, y];
    }

    function LiveGraph(el, options = {}) {
        if (!options.yRange || options.yRange.length < 2) {
            throw new Error('LiveGraph: yRange required.');
        }

        let width = options.width || 300;
        let height = options.height || 180;
        /* Init container */
        var container = document.createElement('div');
        container.classList.add('livegraph-container');

        /* Create canvas */
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx.moveTo(0, 0);
        ctx.beginPath();
        container.appendChild(canvas);


        /* Now add container to the target el */
        el.appendChild(container);
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.prevPoint = [0, 0];
        this.tx = 0;
        this.buffer = (function() {
            let buffer = document.createElement('canvas'),
            ctx = buffer.getContext('2d');

            return {
                capture: function(canvas) {
                    buffer.width = canvas.width;
                    buffer.height = canvas.height;
                    ctx.clearRect(0, 0, buffer.width, buffer.height);
                    ctx.drawImage(canvas, 0, 0);
                },
                get: function () {
                    return buffer;
                }
            };
        })();
    }


    LiveGraph.prototype.timePlot = function(y) {
        let ctx = this.ctx;
        let [prevX, prevY] = this.prevPoint;
        let x = prevX + 1;
        ctx.beginPath();
        ctx.moveTo(prevX, this.height - prevY);
        ctx.lineTo(x, this.height - y);
        ctx.stroke();
        ctx.closePath();

        if (x > (this.width + this.tx)) {
            this.buffer.capture(this.canvas);
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.translate(this.width + this.tx - x, 0);
            this.tx += (this.width + this.tx - x);
            ctx.drawImage(this.buffer.get(), 0, 0);
        }

        this.prevPoint = [x, y];
    }

    LiveGraph.prototype.addPoint = function(pt) {
        let [x, y] = pt,
        [prevX, prevY] = this.prevPoint;
        let ctx = this.ctx;

        ctx.beginPath();
        ctx.moveTo(prevX, this.height - prevY);
        ctx.lineTo(prevX + 1, this.height - y);
        ctx.stroke();
        ctx.closePath();
        this.prevPoint = [prevX + 1, pt];
    };

    LiveGraph.prototype.addPoints = function() {

    };

    LiveGraph.prototype.clear = function() {

    };



    return LiveGraph;


})();