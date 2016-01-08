import { Observable } from 'rx';

const body = document.body;

const clickStream = Observable
    .fromEvent(body, 'click')
    .share();

const filterClassName = (className, e) => {
    const classes = Array.from(e.target.classList);
    return classes.indexOf(className) >= 0;
};

const clicksByClassStream = className =>
    clickStream
        .filter(e => {
            const classes = Array.from(e.target.classList);
            return classes.indexOf(className) >= 0;
        });

const keyupsByClassStream = (className) =>
    Observable
        .fromEvent(body, 'keyup')
        .share()
        .filter(e => filterClassName(className, e));

export { clicksByClassStream, keyupsByClassStream };
