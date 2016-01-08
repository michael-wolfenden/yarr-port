import { Observable } from 'rx';
import { ajax } from 'jquery';
import { Feeds, Posts, reactiveDexieTableStream } from '../db';

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

const addPostToDb = (post, feedUrl) => {
    post.read = 'false';
    post.publishedDate = new Date(post.publishedDate);
    post.feedUrl = feedUrl;

    return Posts.add(post);
};

const addFeedStream = (feedUrl) => Observable
    .of(feedUrl)
    .flatMap(fetchFeed)
    .flatMap(data => {
        const feed = data.responseData.feed;
        const entries = feed.entries;

        const dbFeed = Feeds.add({
            url: feed.feedUrl,
            name: feed.title,
            source: feed.link,
            description: feed.description,
        });

        return Observable
          .fromPromise(dbFeed)
          .flatMap(() => Observable.from(entries))
          .flatMap(post => addPostToDb(post, feed.feedUrl));
    });

Observable
    .fromPromise(Feeds.count())
    .flatMap(count => {
        const urls = count === 0 ? feedUrls : [];
        return Observable.from(urls);
    })
    .flatMap(addFeedStream)
    .subscribe(
        x => console.log('Successfully added', x),
        e => console.warn('Error while adding feed: ', e)
    );

const fetchAllFeedsStream = () => {
    const newPostStream = Observable
        .fromPromise(Feeds.toArray())             // take all the feeds as array
        .flatMap(feeds => Observable.from(feeds)) // convert the array to an Observable to get 1 feed at a time
        .flatMap(feed => fetchFeed(feed.url))
        .flatMap(data => {
            const feed = data.responseData.feed;
            const entries = feed.entries.map(e => {
                e.feedUrl = feed.url;
                return e;
            });

            return Observable.from(entries);        // return the new Posts as an Observable
        });                                         // which give 1 post at a time

    const addNewPostStream = newPostStream          // we don't want to add already present posts
        .flatMap(entry => Posts.get(entry.link))    // (dexie gives an error for that)
        .zip(
            newPostStream,                          // I am sure there's a better way of doing this
            (existing, newEntry) => {               // if you know, do tell me
                return { existing, newEntry };
            }
         )
        .flatMap(entry => {
            if (entry.existing) {
                return Observable.empty();
            }

            return addPostToDb(entry.newEntry, entry.newEntry.feedUrl);
        });

    return addNewPostStream;
};

const feedStream = Observable
      .merge(
        reactiveDexieTableStream(Feeds, 'creating'),
        reactiveDexieTableStream(Feeds, 'updating'),
        reactiveDexieTableStream(Feeds, 'deleting')
      )
      .startWith('')
      .flatMap(() => Feeds.toArray())
      .share();

export { feedStream, addFeedStream, fetchAllFeedsStream };
