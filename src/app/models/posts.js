import { Observable } from 'rx';
import { Posts, reactiveDexieTableStream } from '../db';

const postsSteam = Observable
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

export default postsSteam;
