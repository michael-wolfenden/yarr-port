import { h } from 'virtual-dom';
import { Observable } from 'rx';
import htmlParser from 'html2hscript';

import { formatDate } from '../utils';
import { clicksByClassStream } from '../events';

const view = (post) => {
    if (!post) return '';

    return <section className="post-container post-reader">
    <span className="close-reader-btn">&#10094;</span>
    <header className= "post-header">
        <ul className="post-meta-list">
            <li className="post-meta-item">
                <p>{ formatDate(post.publishedDate) } </p>
            </li>

            <li className= "post-meta-item">
                <p itemprop="articleSection"> { post.categories.join(', ') } </p>
            </li>
        </ul>

        <h1 itemprop= "name headline" className= "post-title">
            <a href={ post.link } title = "post.title"> { post.title } </a>
        </h1>
    </header>

    <div className= "post-body">
        { post.content }
    </div>
</section>;
};

const viewStream = (readPostStream) => {
    const closeButtonClickStream = clicksByClassStream('close-reader-btn');
    const htmlParserStream = Observable.fromNodeCallback(htmlParser);
    const postsStream = readPostStream().share();

    return postsStream
        .flatMap(post => {
            if (!post) return Observable.return('');
            post.content = `<div class="reader-post-wrapper">${post.content}</div>`;
            return htmlParserStream(post.content);
        })
        .zip(
            postsStream,
            (vContent, post) => {
                if (!post) return post;

                // this is a hack. the htmlParser produces a string, when needs to be `eval`ed with `h` in scope. So.
                window.h = h;
                const newContent = eval(vContent); // eslint-disable-line no-eval
                post.content = newContent;
                return post;
            }
        )
        .merge(closeButtonClickStream)
        .map(postOrClick => {
            if (postOrClick.type === 'click') return false;
            return postOrClick;
        })
        .startWith(false)
        .map(view);
};

export default viewStream;
