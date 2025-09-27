export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.distancia = {finalPosition: 0, startX: 0, movement: 0}
    }

    onStart(event) {
        let movetype;
        if(event.type === 'mousedown') {
            event.preventDefault();
            this.distancia.startX = event.clientX;
            movetype = 'mousemove';
        } else {
            this.distancia.startX = event.changedTouches[0].clientX;
            movetype = 'touchmove';
        };
        this.wrapper.addEventListener(movetype, this.onMove);
    }

    updatePosition(clientX) {
        this.distancia.movement = this.distancia.startX - clientX;
        return (this.distancia.finalPosition - this.distancia.movement) * 1.3;
    }

    moveSlide(distanciaX) {
        this.distancia.movePosition = distanciaX;
        this.slide.style.transform = `translate3d(${distanciaX}px, 0, 0)`;
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPostion = this.updatePosition(pointerPosition);
        this.moveSlide(finalPostion);
    }

    onEnd(event) {
        const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.distancia.finalPosition = this.distancia.movePosition;
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    // Slides Config
    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin);
    }

    slideConfig() {
        this.slidesArray = [...this.slide.children].map((element) => {
            const position = this.slidePosition(element);
            return {element, position};
        });
    }

    slideIndexNav(index) {
        const last = this.slidesArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1
        };
    }

    changeSlide(index) {
        const activeSlide = this.slidesArray[index].position;
        this.moveSlide(activeSlide);
        this.slideIndexNav(index);
        this.distancia.finalPosition = activeSlide.position;
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slideConfig();
        return this;
    }
}