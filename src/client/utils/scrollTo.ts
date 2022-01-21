// https://github.com/ant-design/ant-design/blob/master/components/_util/scrollTo.ts

import raf from 'rc-util/lib/raf';
import getScroll, { isWindow } from './getScroll';
import { easeInOutCubic } from './easings';

export type OptionsType = {
  duration?: number;
  threshold?: number;
};

export default function scrollTo(
  target: HTMLElement,
  container: HTMLElement | Window | Document,
  options?: OptionsType,
) {
  const { duration = 450, threshold = 0 } = options;
  const scrollTop = getScroll(container, true);
  const startTime = Date.now();
  let y =
    target.getBoundingClientRect().y -
    ((container instanceof HTMLElement &&
      container.getBoundingClientRect().y) ||
      0) +
    scrollTop -
    threshold;

  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScrollTop = easeInOutCubic(
      time > duration ? duration : time,
      scrollTop,
      y,
      duration,
    );
    if (isWindow(container)) {
      (container as Window).scrollTo(window.pageXOffset, nextScrollTop);
    } else if (
      container instanceof HTMLDocument ||
      container.constructor.name === 'HTMLDocument'
    ) {
      (container as HTMLDocument).documentElement.scrollTop = nextScrollTop;
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop;
    }
    if (time < duration) {
      raf(frameFunc);
    }
  };
  raf(frameFunc);
}
