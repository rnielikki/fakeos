import { WindowObject } from "__lib__/index";
export default function(target:WindowObject){
    const imgs=require.context('__src__/resource/backgrounds',false,/.*(\.jpg)$/);
    const attachTarget=target.contentPage.shadowRoot!.querySelector(".bgchange-wrap");
    if(!attachTarget) return;
    const imgList=imgs.keys();
    for(let i=0;i<imgList.length;i++){
        const img=imgList[i];
        const imgElem=document.createElement("img");
        const imgSrc=require('__src__/resource/backgrounds'+img.substring(1));
        imgElem.src=imgSrc;
        imgElem.onclick=function(){
            const thisImg=this as HTMLImageElement;
            if(!thisImg) return;
            document.body.style.backgroundImage="url("+thisImg.src+")";
        }
        attachTarget.appendChild(imgElem);
    }
}