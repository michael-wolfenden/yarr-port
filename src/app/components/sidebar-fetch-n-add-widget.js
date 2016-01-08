import { h } from 'virtual-dom';
import { Observable } from 'rx';

import { clicksByClassStream, keyupsByClassStream } from '../events';
import { fetchAllFeedsStream, addFeedStream } from '../models/feeds';

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

    const fetchAllBtnClicksStream = clicksByClassStream('fetch-all-btn')
        .flatMap(fetchAllFeedsStream);

    const addNewFeedStream = keyupsByClassStream('new-feed-input')
        .do(e => {
            e.target.classList.remove('error');
            e.target.classList.remove('progress');
        })
        .filter(e => e.keyCode === 13)
        .map(e => e.target.value)
        .flatMap(feedUrl => addFeedStream(feedUrl))
        .catch(e => {
            const el = document.querySelector('.new-feed-input');
            el.classList.add('error');

            console.debug('Error while adding feed: ', e);

            return addFeedStream.retry();
        });

    addNewFeedStream.subscribe(x => console.log(x));
    fetchAllBtnClicksStream.subscribe(x => console.log(x));

    return Observable
        .combineLatest(
            addFeedInputStylesSteam,
            view
        );
};

export default viewStream;
