import { h } from 'virtual-dom';
import { Observable } from 'rx';

import { clicksByClassStream } from '../events';
import { dataAttrAsClass } from '../utils';

const view = () =>
    <ul className="sidebar-controls">
        <li className="sidebar-control filter-posts data-filter-all">All</li>
        <li className="sidebar-control filter-posts active data-filter-unread">Unread</li>
        <li className="sidebar-control filter-posts data-filter-read">Read</li>
    </ul>;

const feedFiltersStream = () => {
    const widgetClickStream = clicksByClassStream('filter-posts');

    return widgetClickStream
        .map(e => e.target)
        .map(el => dataAttrAsClass('filter', el));
};

const viewStream = () => {
    const widgetClickStream = clicksByClassStream('filter-posts');

    widgetClickStream
        .map(e => e.target)
        .do(el => {
            document.querySelector('.filter-posts.active').classList.remove('active');
            el.classList.add('active');
        })
        .subscribe();

    return Observable
        .return(view());
};

export default viewStream;
export { feedFiltersStream };
