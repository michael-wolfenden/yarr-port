import { h } from 'virtual-dom';
import { Observable } from 'rx';

const view = count => <h1>{count.toString()}</h1>;

const viewStream = () => Observable
    .interval(1000)
    .map(n => n + 1)
    .startWith(0)
    .map(count => view(count));

export default viewStream;
