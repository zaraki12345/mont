document.addEventListener("DOMContentLoaded", function(event) { 
    
    let button = document.querySelectorAll(".btn");
    let introBox = document.querySelectorAll(".intro__box");

    let getAllSiblings = function (element) {
        let siblings = [];
        let sibling = element.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== element) {
                siblings.push(sibling);
                sibling.classList.remove('btn-active');
            }
            sibling = sibling.nextSibling
        }
        return siblings;
    };

    let fade = function (element) {
        let op = 1;
        let timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 0);
    }

    let unfade = function (element) {
        let op = 0.1; 
        element.style.display = 'block';
        let timer = setInterval(function () {
            if (op >= 1){
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 0);
    }

    for (let i = 0 ; i < button.length; i++) {
        button[i].addEventListener("click", function() {
            let selectedtype = this.getAttribute('data-type');

            this.classList.add("btn-active");

            getAllSiblings(this);

            if(selectedtype === "all") {
                setTimeout(function(){
                    for (let i = 0 ; i < introBox.length; i++) {
                        unfade(introBox[i]);
                    }
                },500);
            } 
            else {
                for (let i = 0 ; i < introBox.length; i++) {
                    if( !(introBox[i].classList.contains(selectedtype)) ) {
                        fade(introBox[i]);
                    }
                    else {
                        unfade(introBox[i]);
                    }
                }
            }
        });
    }

});