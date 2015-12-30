import { Observable } from 'rx';
import { ajax } from 'jquery';

const feedUrls = [
    'https://hacks.mozilla.org/category/es6-in-depth/feed/',
    'http://feeds.feedburner.com/JohnResig',
    'http://unisonweb.org/feed.xml',
];

const fetchFeed = (url) =>
    ajax({
        url: `http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=30&q=${url}`,
        dataType: 'jsonp',
    })
    .promise();

const feedStream = Observable
    .from(feedUrls)
    .flatMap(fetchFeed)
    .map(res => res.responseData.feed);

export default feedStream;
