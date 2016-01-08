import { Observable } from 'rx';
import { Posts, reactiveDexieTableStream } from '../db';

const postsStream = Observable
    .merge(
        reactiveDexieTableStream(Posts, 'creating'),
        reactiveDexieTableStream(Posts, 'updating'),
        reactiveDexieTableStream(Posts, 'deleting')
        )
    .startWith('')
    .flatMap(() => Posts
        .orderBy('publishedDate')
        .reverse()
        .toArray()
    );

const markPostAsReadStream = (post) =>
    Posts.update(post, { read: 'true' });

export { postsStream, markPostAsReadStream };
