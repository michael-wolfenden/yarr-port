import { Observable } from 'rx';
import h from 'virtual-dom/h';

const view = <h1>Hello World</h1>;

const viewStream = () => Observable.return(view);

export default viewStream;
