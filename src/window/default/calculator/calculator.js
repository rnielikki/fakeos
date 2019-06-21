        (function(){
            const thisBody=document.currentScript.parentElement.shadowRoot;
            console.log(this.parentElement);
            if(!thisBody) return;
            const display=thisBody.getElementById("calc-screen");
            const children=thisBody.getElementById("calc-btns").children;
            const count=children.length;
            let calcResult=0;
            let resultSwitch=false;
            let isFloat=false;
            for(let i=0;i<count;i++){
                children[i].addEventListener("click",addCalc);
            }
            function addCalc(e){
                const txt=e.target.innerText;
                const displayState=display.innerText;
                const opReg=new RegExp("[\\+\\-\\*\\/]","g");
                if(!isNaN(txt)){
                    if(resultSwitch===false && displayState!=="0"){
                        if(displayState[displayState.length-1]==="0" && isNaN(displayState[displayState.length-2]||0) && !isFloat){
                            display.innerText=displayState.slice(0,-1);
                        }
                        display.innerText+=txt;
                    }
                    else{
                        display.innerText=txt;
                        unmarkResult();
                    }
                }
                else{
                    switch(txt){
                        case "+":
                        case "-":
                        case "*":
                        case "/":
                            if(!isNaN(displayState[displayState.length-1])){
                                display.innerText+=txt;
                                unmarkResult();
                                isFloat=false;
                            }
                            break;
                        case ".":
                            if(!resultSwitch && !isFloat){
                                if(isNaN(displayState[displayState.length-1])){
                                    display.innerText+="0";
                                }
                                display.innerText+=txt;
                                isFloat=true;
                            }
                            break;
                        case "=":
                            calculation(displayState);
                            break;
                        case "C":
                            init();
                            break;
                        case "+-":
                            if(!isNaN(displayState) && displayState!=="0"){
                                display.innerText=(displayState[0]==="-"?display.innerText.substring(1):"-"+display.innerText);
                            }
                            break;
                        case "<-":
                            if(displayState!=="0" && displayState.length>0){
                                if(resultSwitch){
                                    init();
                                }
                                else{
                                    if(displayState[displayState.length-1]===".") isFloat=false;
                                    display.innerText=displayState.slice(0,-1);
                                }
                                
                            }
                            break;
                    }
                }
                function init(){
                     unmarkResult();
                     isFloat=false;
                     display.innerText="0";
                }
                function calculation(text){
                    let ifStartMinus="";
                    if(text[0]==="-"){
                        ifStartMinus="-";
                        text=text.substring(1);
                    }
                    const ops=text.match(opReg);
                    const nums=text.split(opReg);
                    //check if valid
                    if(nums.filter(num=>isNaN(num||"_")).length===0){
                        const calcResult=eval(ifStartMinus+text);
                        display.innerText=isNaN(calcResult)?"ERroR":calcResult;
                        markResult();
                        isFloat=false;
                    }
                }
                function markResult(){
                    display.style.fontSize="200%";
                    resultSwitch=true;
                }
                function unmarkResult(){
                    display.style.fontSize="100%";
                    resultSwitch=false;
                }
            }
        })();