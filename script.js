var indexSlide = 0;
function autoSlideShow() {
    var i;
    const image = document.querySelectorAll(".banner");
    for(i = 0; i < image.length; i++) {
        image[i].style.display = "none";
    }
    indexSlide++;
    if(indexSlide > image.length){
        indexSlide = 1;
    }
    image[indexSlide - 1].style.display = "block";
}

autoSlideShow();

setInterval(autoSlideShow, 4500);