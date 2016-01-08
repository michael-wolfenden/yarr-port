import { h } from 'virtual-dom';
import { Observable } from 'rx';

import postsListViewStream, { readPostStream } from './posts-list';
import sidebarViewStream, { feedFiltersStream } from './sidebar';
import readerViewStream from './reader';

const view = (postsListView, sidebarView, readerView) =>
    <div id="container" className="container">
        <div className="surface">
        <div className="surface-container">
            <div className="content">
            <aside className="cover">{sidebarView}</aside>
            <div className="reader">{readerView}</div>
            <div className="wrapper">
                <div className="wrapper-container">{postsListView}</div>
            </div>
            </div>
        </div>
        </div>
    </div>;

const viewStream = () =>
    Observable
        .combineLatest(
            postsListViewStream(feedFiltersStream),
            sidebarViewStream(),
            readerViewStream(readPostStream),
            view
        );

export default viewStream;
