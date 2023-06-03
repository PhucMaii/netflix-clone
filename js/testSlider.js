const buttons = document.querySelectorAll('[data-carousel-button]');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const offset = button.dataset.carouselButton === 'next' ? 1 : -1;
        const slides = button.closest("[data-carousel]").querySelector("[data-slides]");

        const activeSlide = document.querySelector('[data-active]');
        let newIndex = [...slides.children].indexOf(activeSlide) + offset;
        if(newIndex < 0) {
            newIndex = slides.children.length - 1;
        } 
        if(newIndex >= slides.children.length) {
            newIndex = 0;
        }

        slides.children[newIndex].dataset.active = true;
        delete activeSlide.dataset.active;
    })
})

let translateX = 0;
// Get the width of screen
const windowLength = window.innerWidth; 
// Get the number of images are showed on screen
let numberOfImagesOnScreen = Math.floor(windowLength / 210); 

const movieCardContainer = document.querySelector('.movie-card-container');
const movieCard = movieCardContainer.querySelectorAll('.movie-card');
const movieArr = Array.from(movieCard);

const nextButton = document.querySelector('.slide-controller.next');
const prevButton = document.querySelector('.slide-controller.prev');


function next() {
    prevButton.style.display = 'block';
    // one image has width of 210 so this will move to next two items
    translateX += 420;
    console.log(translateX);
    // Assume I only have 10 movies for any specific category
    if(numberOfImagesOnScreen > 10) {
        translateX -= 420;
      
        nextButton.style.display = 'none';  
    }

    numberOfImagesOnScreen += 2;
    movieArr.forEach(movie => {
        movie.style.transform = `translateX(-${translateX}px)`;
    })
}


function prev() {
    nextButton.style.display = 'block';
    translateX -= 420;
    console.log(translateX);
    if(translateX < 0) {
        translateX = 0;

        // reset number of images on screen if the slide return to the original place
        numberOfImagesOnScreen = Math.floor(windowLength / 210);   
        prevButton.style.display = 'none'
    }
    movieArr.forEach(movie => {
        movie.style.transform =  `translateX(-${translateX}px)`;
    })
}
