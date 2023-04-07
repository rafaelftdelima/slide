export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.distance = {
            finalPosition: 0,
            startX: 0,
            movement: 0
        }
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();

        return this;
    }

    moveSlide(distanceX) {
        this.distance.movePosition = distanceX;
        this.slide.style.transform = `translate3d(${distanceX}px, 0, 0)`;
    }

    updatePosition(clientX) {
        this.distance.movement = (this.distance.startX - clientX) * 1.6;

        return this.distance.finalPosition - this.distance.movement;
    }

    start(event) {
        event.preventDefault();

        this.distance.startX = event.clientX;
        this.wrapper.addEventListener('mousemove', this.move);
    }

    move(event) {
        const finalPosition = this.updatePosition(event.clientX);
        this.moveSlide(finalPosition);
    }

    end(event) {
        this.wrapper.removeEventListener('mousemove', this.move);
        this.distance.finalPosition = this.distance.movePosition;
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.start);
        this.wrapper.addEventListener('mouseup', this.end);
    }

    bindEvents() {
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
    }
}