import { h } from 'virtual-dom';
import { Observable } from 'rx';

import { clicksByClassStream } from '../events';
import { postsStream, markPostAsReadStream } from '../models/posts';
import { formatDate } from '../utils';
import { Posts } from '../db';

const postView = post =>
<article className="post-item post">
    <header className="post-item-header">
        <h2 className="post-item-title">
            <a className="post-title" href= { post.link }> { post.title } </a>
        </h2>
    </header>
    <section className= "post-item-excerpt">
        { post.contentSnippet }
    </section>

    <footer className= "post-item-footer">
        <ul className="post-item-meta-list">
            <li className="post-item-meta-item">
                <p><a href={ post.link }>{ post.author }</a></p>
            </li>
            <li className= "post-item-meta-item">
                <p>{ formatDate(post.publishedDate) }</p>
            </li>
            <li className= "post-item-meta-item">
                <p itemprop="articleSection"> { post.categories.join(', ') } </p>
            </li>
        </ul>
    </footer>
</article>;

const view = postsView =>
<section className="post-list">
    { postsView }
</section>;

const viewStream = (feedFiltersStream) =>
    Observable
        .combineLatest(
            postsStream,
            feedFiltersStream(),
            (posts, filters) => posts.filter(post => {
                let result = true;
                const checks = Object.keys(filters);
                for (const key of checks) {
                    if (post[key] !== filters[key]) {
                        result = false;
                    }
                }

                return result;
            })
         )
        .map(posts => posts.map(postView))
        .map(view)
        .startWith(view());

const readPostStream = () => {
    return clicksByClassStream('post-title')
        .do(e => e.preventDefault())
        .map(e => e.target.href)
        .flatMap(link => Posts.get(link))
        .do(markPostAsReadStream)
        .startWith('');
};


export default viewStream;
export { readPostStream };
