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
        let moveType;

        if (event.type === 'mousedown') {
            event.preventDefault();

            this.distance.startX = event.clientX;
            moveType = 'mousemove';
        } else {
            this.distance.startX = event.changedTouches[0].clientX;
            moveType = 'touchmove';
        }
        
        this.wrapper.addEventListener(moveType, this.move);
    }

    move(event) {
        let pointerPosition;

        if (event.type === 'mousemove') {
            pointerPosition = event.clientX;
        } else {
            pointerPosition = event.changedTouches[0].clientX;
        }

        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    end(event) {
        let moveType;

        if (event.type === 'mouseup') {
            moveType = 'mousemove';
        } else {
            moveType = 'touchmove';
        }

        this.wrapper.removeEventListener(moveType, this.move);
        this.distance.finalPosition = this.distance.movePosition;
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.start);
        this.wrapper.addEventListener('touchstart', this.start);
        this.wrapper.addEventListener('mouseup', this.end);
        this.wrapper.addEventListener('touchend', this.end);
    }

    bindEvents() {
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
    }
}