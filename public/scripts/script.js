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

let showButton = document.getElementById("show-button");
showButton.addEventListener("click", showOffers);

function showOffers() {
    let hiddenCard1 = document.getElementById("hidden-card1");
    let hiddenCard2 = document.getElementById("hidden-card2");
    let hiddenCard3 = document.getElementById("hidden-card3");
    if(hiddenCard1.style.display == "none") {
        hiddenCard1.style.display = "block";
        hiddenCard2.style.display = "block";
        hiddenCard3.style.display = "block";
        showButton.textContent = "See less offers";
    }
    else {
        hiddenCard1.style.display = "none";
        hiddenCard2.style.display = "none";
        hiddenCard3.style.display = "none";
        showButton.textContent = "See all offers";
    }
}
