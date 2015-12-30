import { h } from 'virtual-dom';
import { Observable } from 'rx';

import clicksByClassStream from '../events';

const view = () =>
    <ul className="sidebar-controls">
        <li className="sidebar-control filter-posts data-filter-all">All</li>
        <li className="sidebar-control filter-posts active data-filter-unread">Unread</li>
        <li className="sidebar-control filter-posts data-filter-read">Read</li>
    </ul>;

const viewStream = () => {
    const widgetClickStream = clicksByClassStream('filter-posts');

    widgetClickStream
        .map(e => e.target)
        .do(el => {
            document.querySelector('.filter-posts.active').classList.remove('active');
            el.classList.add('active');
        })
        .subscribe(e => console.log(e));

    return Observable
        .return(view());
};

export default viewStream;
