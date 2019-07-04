(function () {
    const thisBody = document.currentScript.parentElement.shadowRoot;
    const width = window.innerWidth;
    const height = window.innerHeight;
    thisBody.getElementById("monitor-width").innerText = width;
    thisBody.getElementById("monitor-height").innerText = height;
    const state = CheckState();
    const result=thisBody.getElementById("monitor-result");
    switch(state){
        case 0:
            result.classList.add("perfect");
            result.innerText="Perfect! No problem!";
            break;
        case 1:
            result.classList.add("good");
            result.innerText="Not perfect, but OK";
            break;
        case 2:
        case 3:
            result.classList.add("bad");
            result.innerText="I think this doesn't fit for your screen";
            break;
        case 4:
            result.classList.add("nope");
            result.innerText="Change your monitor immediately!";
            break;
    }
    function CheckState(){
        const state=thisBody.getElementById("monitor-state");
        let problem=0;
        if(width<1000){
            state.innerText+="Width is too small.\n";
            problem++;
        }
        if(height<600){
            state.innerText+="Height is too small.\n";
            problem++;
        }
        if(width<1000 && height<600){
            state.innerText+="This OS doesn't look like mobile, isn't it?\n";
            problem++;
        }
        if(width/height<1.1){
            state.innerText+="I recommend to use horizontal screen...\n";
            problem++;
        }
        return problem;
    }
})();