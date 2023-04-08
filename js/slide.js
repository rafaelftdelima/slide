import debounce from './debounce.js';

export class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.distance = {
            finalPosition: 0,
            startX: 0,
            movement: 0
        }
        this.activeClass = 'actived';
    }

    init() {
        this.bindEvents();
        this.transition(true);
        this.addSlideEvents();
        this.slidesConfig();
        this.addEventResize();

        this.changeSlide(this.slideArray.length / 2);
        this.activePrevSlide();

        return this;
    }

    transition(active) {
        this.slide.style.transition = active ? 'transform 0.3s' : '';
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
        this.transition(false);
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
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if (this.distance.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.distance.movement < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlide(this.index.active);
        }
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

        this.activePrevSlide = this.activePrevSlide.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);

        this.resize = debounce(this.resize.bind(this), 200);
    }

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;

        return -(slide.offsetLeft - margin);
    }

    slidesConfig() {
        this.slideArray = [...this.slide.children].map((slide) => {
            const position = this.slidePosition(slide);

            return {
                position,
                slide
            }
        });
    }

    slideIndexNav(index) {
        const last = this.slideArray.length - 1;

        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index + 1 <= last ? index + 1 : undefined
        }
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];

        this.moveSlide(this.slideArray[index].position);
        this.slideIndexNav(index);
        this.distance.finalPosition = activeSlide.position;
        this.changeActiveClass();
    }

    changeActiveClass() {
        this.slideArray.forEach((slide) => {
            slide.slide.classList.remove(this.activeClass);
        });

        this.slideArray[this.index.active].slide.classList.add(this.activeClass);
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) {
            this.changeSlide(this.index.prev);
        }
    }

    activeNextSlide() {
        if (this.index.next !== undefined) {
            this.changeSlide(this.index.next);
        }
    }

    resize() {
        setTimeout(() => {
            this.slidesConfig();
            this.changeSlide(this.slideArray.length / 2);
        }, 1000);
    }

    addEventResize() {
        window.addEventListener('resize', this.resize);
    }
}

export class SlideNav extends Slide {
    addArrow(prev, next) {
        this.prevElement = document.querySelector(prev);
        this.nextElement = document.querySelector(next);

        this.addArrowEvent();
    }

    addArrowEvent() {
        this.prevElement.addEventListener('click', this.activePrevSlide);
        this.nextElement.addEventListener('click', this.activeNextSlide);
    }
}