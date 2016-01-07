import { Observable } from 'rx';
import Dexie from 'dexie';

const db = new Dexie('yarr');

db.version(1).stores({
    feeds: 'url, name',
    posts: 'link, title, author, publishedDate, categories, read, feedUrl',
});

db.open();

const feeds = db.feeds;
const posts = db.posts;

window.Posts = posts;
window.Feeds = feeds;

const reactiveDexieTableStream = (table, hookName) => {
    return Observable.create((obs) => {
        const dbListener = table.hook(hookName, (pk, obj, txn, update) => {
            // Can't use `arguments` because webpack.
            // there are 4 arguments for 'updating' op, otherwise there are 3.
            // in case of 'updating' first arg is 'modifications', and other three are same
            console.log('hookName', hookName);
            obs.onNext(pk, obj, txn, update);
        });

        return () => {
            table.hook(hookName).unsubscribe(dbListener);
        };
    });
};

reactiveDexieTableStream(db.feeds, 'deleting')
    .flatMap(feedUrl => {
        return db.posts.where('feedUrl').equals(feedUrl).delete();
    })
    .subscribe(
        x => console.log(`${x} posts deleted successfully in cascading delete operation.`),
        e => console.error('Error while cascading Posts delete', e)
    );

export { db, feeds as Feeds, posts as Posts, reactiveDexieTableStream };
