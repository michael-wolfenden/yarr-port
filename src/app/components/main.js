import { h } from 'virtual-dom';
import { Observable } from 'rx';

import postsListViewStream from './posts-list';
import sidebarViewStream from './sidebar';

const view = (postsListView, sidebarView) =>
    <div id="container" className="container">
        <div className="surface">
        <div className="surface-container">
            <div className="content">
            <aside className="cover">{sidebarView}</aside>
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
            postsListViewStream(),
            sidebarViewStream(),
            view
        );

export default viewStream;
