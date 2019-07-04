import { WindowObject } from "__lib__/index";
export default function(target:WindowObject){
    const imgs=require.context('__src__/resource/backgrounds',false,/.*(\.jpg)$/);
    const attachTarget=target.contentPage.shadowRoot!.querySelector(".bgchange-imgs");
    if(!attachTarget) return;
    const imgList=imgs.keys();
    for(let i=0;i<imgList.length;i++){
        const img=imgList[i];
        const imgElem=document.createElement("div");
        const imgSrc=require('__src__/resource/backgrounds'+img.substring(1));
        imgElem.style.backgroundImage="url('"+imgSrc+"')";
        imgElem.dataset.bg=img.substring(2);
        imgElem.onclick=function(){
            const thisImg=this as HTMLElement;
            if(!thisImg) return;
            document.body.style.backgroundImage=thisImg.style.backgroundImage;
        }
        attachTarget.appendChild(imgElem);
    }
}