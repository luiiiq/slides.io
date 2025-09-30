export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.distancia = {finalPosition: 0, startX: 0, movement: 0}
    }

    transition(active) {
        if (active === true) {
            this.slide.style.transition = 'transform 0.3s';
        } else {
            this.slide.style.transition = '';
        }
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
        this.transition(false);
    }

    updatePosition(clientX) {
        this.distancia.movement = this.distancia.startX - clientX;
        const speed = 1.3;
        const deslocamento = this.distancia.movement * speed;
        return (this.distancia.finalPosition - deslocamento);
    }

    moveSlide(distanciaX) {
        const max = 0;      // início
        const wrapperLargura = this.wrapper.offsetWidth;
        const slideLargura = this.slide.scrollWidth;
        const min = (wrapperLargura - slideLargura) - 10; // fim
        const limite = Math.max(Math.min(distanciaX, max), min);

        this.distancia.movePosition = limite;
        this.slide.style.transform = `translate3d(${limite}px, 0, 0)`;
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
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if(this.distancia.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if(this.distancia.movement < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlide(this.index.active)
        };
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
        this.distancia.finalPosition = activeSlide;
    }

    activePrevSlide() {
        if(this.index.prev !== undefined) {
            this.changeSlide(this.index.prev);
        };
    }

    activeNextSlide() {
        if(this.index.next !== undefined) {
            this.changeSlide(this.index.next);
        };
    }

    init() {
        this.bindEvents();
        this.transition(true);
        this.addSlideEvents();
        this.slideConfig();
        return this;
    }
}