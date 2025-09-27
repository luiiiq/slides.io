export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.distancia = {finalPosition: 0, startX: 0, movement: 0}
    }

    onStart(event) {
        event.preventDefault();
        this.wrapper.addEventListener('mousemove', this.onMove);
        this.distancia.startX = event.clientX;
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
        const finalPostion = this.updatePosition(event.clientX);
        this.moveSlide(finalPostion);
    }

    onEnd() {
        this.wrapper.removeEventListener('mousemove', this.onMove);
        this.distancia.finalPosition = this.distancia.movePosition;
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        return this;
    }
}