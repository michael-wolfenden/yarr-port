import { h } from 'virtual-dom';

import postsStream from '../models/posts';
import { formatDate } from '../utils';

const postView = post =>
    <article className="post-item post">
      <header className="post-item-header">
        <h2 className="post-item-title">
          <a className="post-title" href={post.link}>{post.title}</a>
          </h2>
      </header>
      <section className="post-item-excerpt">
        {post.contentSnippet}
      </section>

      <footer className="post-item-footer">
        <ul className="post-item-meta-list">
          <li className="post-item-meta-item">
            <p><a href={post.link}>{post.author}</a>
            </p>
          </li>

          <li className="post-item-meta-item">
            <p>
              {formatDate(post.publishedDate)}
            </p>
          </li>

          <li className="post-item-meta-item">
            <p itemprop="articleSection">{post.categories.join(', ')}</p>
          </li>
        </ul>
      </footer>
    </article>;

const view = postsView =>
  <section className="post-list">
    {postsView}
  </section>;

const viewStream = () =>
    postsStream
        .map(posts => posts.map(postView))
        .reduce((acc, posts) => acc.concat(posts))
        .map(view);

export default viewStream;
