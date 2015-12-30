import { h } from 'virtual-dom';
import { Observable } from 'rx';

import clicksByClassStream from '../events';

const view = addFeedInputStyles =>
    <ul className="sidebar-controls">
        <li className="sidebar-control fetch-all-btn">Fetch All Feeds</li>

        <li className="sidebar-control new-feed-btn">Add New Feed
            <input className="new-feed-input" style={addFeedInputStyles} type="url" required />
        </li>
  </ul>;

const viewStream = () => {
    const addFeedInputStylesSteam = clicksByClassStream('new-feed-btn')
        .startWith(false)
        .scan(acc => !acc)
        .map(show => show
            ? { display: 'inline-block' }
            : { display: 'none' });

    return Observable
        .combineLatest(
            addFeedInputStylesSteam,
            view
        );
};

export default viewStream;
