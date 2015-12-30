import { h } from 'virtual-dom';
import { Observable } from 'rx';

import greetingViewSteam from './greeting';
import counterViewSteam from './counter';

const view = (greetingView, counterView) => {
    return <div className="container">
        { greetingView }
        { counterView }
    </div>;
};

const viewStream = () => Observable
    .combineLatest(
        counterViewSteam(),
        greetingViewSteam(),
        view);

export default viewStream;
