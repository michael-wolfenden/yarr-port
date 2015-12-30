import { Observable } from 'rx';

const body = document.body;

const clickStream = Observable.fromEvent(body, 'click');

const clicksByClassStream = className =>
    clickStream
        .filter(e => {
            const classes = Array.from(e.target.classList);
            return classes.indexOf(className) >= 0;
        });

export default clicksByClassStream;
