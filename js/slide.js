export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();

        return this;
    }

    start(event) {
        event.preventDefault();

        this.wrapper.addEventListener('mousemove', this.move);
    }

    move(event) {

    }

    end(event) {
        this.wrapper.removeEventListener('mousemove', this.move);
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.start);
        this.wrapper.addEventListener('mouseup', this.end);
    }

    bindEvents() {
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
    }
}