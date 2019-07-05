(function () {
    const thisBody = document.currentScript.parentElement.shadowRoot;
    const canvas = thisBody.getElementById("paint-canvas");
    const canvasParent = canvas.parentElement;
    const host=thisBody.host;

    let win = host.parentElement;
    canvas.width = "1200";
    canvas.height = "600";
    const topOffset = host.getBoundingClientRect().top + 100;
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 20;
    let styleBuffer = { left: 0, top: 0 };
    const draw = function (e) {
        ctx.lineTo(e.clientX - styleBuffer.left + canvasParent.scrollLeft, e.clientY - styleBuffer.top - topOffset + canvasParent.scrollTop);
        ctx.stroke();
    }
    const setDraw = function (e) {
        styleBuffer.left = parseInt(win.style.left);
        styleBuffer.top = parseInt(win.style.top);
        ctx.beginPath();
        ctx.moveTo(e.clientX - styleBuffer.left + canvasParent.scrollLeft, e.clientY - styleBuffer.top - topOffset + canvasParent.scrollTop);
        canvas.addEventListener("mousemove", draw);
    }
    const stopDraw = function (e) {
        canvas.removeEventListener("mousemove", draw);
    }
    canvas.addEventListener("mousedown", setDraw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);
    /// end of event basic canvas

    /// start of paint setup
    const bgState = thisBody.querySelector(".paint-color-current");
    const setColor = function (e) {
        if (!e.target.style) return;
        const bg = e.target.style.backgroundColor;
        if (bg) {
            ctx.strokeStyle = bg;
            bgState.style.backgroundColor = bg;
        }
    }
    const setSize = function (size) {
        ctx.lineWidth = size * 5;
    }
    const setBrushStyle = function (style) {
        switch (style) {
            case "round":
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                break;
            case "rect":
                ctx.lineJoin = "bevel";
                ctx.lineCap = "butt";
                break;
        }
    }
    thisBody.getElementById("paint-clear").addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));
    thisBody.getElementById("paint-color").addEventListener("click", setColor);
    thisBody.getElementById("paint-brush-round").addEventListener("click", () => setBrushStyle("round"));
    thisBody.getElementById("paint-brush-rect").addEventListener("click", () => setBrushStyle("rect"));
    for (let i = 1; i < 6; i++) {
        thisBody.getElementById("paint-size" + i).addEventListener("click", () => setSize(i));
    }
})();