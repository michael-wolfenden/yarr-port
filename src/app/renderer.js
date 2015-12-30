import { h, diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';

const render = (viewStream, baseDOMNode) => {
    let view = null;
    let rootNode = null;

    const initialize = (newView) => {
        view = newView;
        rootNode = createElement(view);
        baseDOMNode.appendChild(rootNode);
    };

    const update = (newView) => {
        const patches = diff(view, newView);
        rootNode = patch(rootNode, patches);
        view = newView;
    };

    viewStream.subscribe(
        newView => view ? update(newView) : initialize(newView),
        error => console.warn('Error occured somewhere along Observable chain', error)
    );
};

export default render;
