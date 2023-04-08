import { SlideNav } from './slide.js';

const slideNav = new SlideNav('.slide', '.wrapper');

slideNav.init();
slideNav.addArrow('.prev', '.next');