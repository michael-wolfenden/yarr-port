import { h } from 'virtual-dom';

import { clicksByClassStream } from '../events';
import { feedStream } from '../models/feeds';

const nodeView = (feed, extraClasses) =>
  <li className="sidebar-feedlist-item">
    <a className={extraClasses + ' sidebar-feed'} href={feed.url}>{feed.name}</a>
  </li>;

const view = feedViews =>
    <ul className="sidebar-feedlist">
        {nodeView({ url: 'all-feeds', name: 'All' }, 'active')}
        {feedViews}
    </ul>;

const selectedFeedUrlStream = () =>
    clicksByClassStream('sidebar-feed')
        .do(e => e.preventDefault())
        .map(e => e.target.href.split('/').reverse()[0] === 'all-feeds'
            ? null
            : e.target.href);

const viewStream = () => {
    clicksByClassStream('sidebar-feed')
        .do(e => e.preventDefault())
        .do(e => {
            const activeEl = document.querySelector('.sidebar-feed.active');
            if (activeEl) activeEl.classList.remove('active');

            e.target.classList.add('active');
        })
        .subscribe();

    return feedStream
        .startWith([])
        .map(feeds => feeds.map(nodeView))
        .map(view);
};

export default viewStream;
export { selectedFeedUrlStream };
