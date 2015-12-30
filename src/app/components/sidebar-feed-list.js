import { h } from 'virtual-dom';

import clicksByClassStream from '../events';
import feedsStream from '../models/feeds';

const nodeView = (feed, extraClasses) =>
  <li className="sidebar-feedlist-item">
    <a className={extraClasses + ' sidebar-feed'} href={feed.url}>{feed.name}</a>
  </li>;

const view = feedViews =>
    <ul className="sidebar-feedlist">
        {nodeView({ url: 'all-feeds', name: 'All' }, 'active')}
        {feedViews}
    </ul>;

const viewStream = () => {
    clicksByClassStream('sidebar-feed')
        .do(e => e.preventDefault())
        .do(e => {
            const activeEl = document.querySelector('.sidebar-feed.active');
            if (activeEl) activeEl.classList.remove('active');

            e.target.classList.add('active');
        })
        .subscribe();

    return feedsStream
        .map(feed => {
            return { url: feed.feedUrl, name: feed.title };
        })
        .toArray()
        .startWith([])
        .do(x => console.log(x))
        .map(feeds => feeds.map(nodeView))
        .map(view);
};

export default viewStream;
