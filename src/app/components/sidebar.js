import { h } from 'virtual-dom';
import { Observable } from 'rx';

import filterWidgetViewStream from './sidebar-filter-widget';
import fetchNAddWidgetViewStream from './sidebar-fetch-n-add-widget';
import feedListViewStream from './sidebar-feed-list';

const view = (filterWidgetView, fetchNAddWidgetView, feedListView) =>
    <div className="sidebar-container">
        <div className="sidebar-brand">
            <h2 className="sidebar-brand">Yarr</h2>
        </div>

        {filterWidgetView}
        {fetchNAddWidgetView}
        {feedListView}
    </div>;

const viewStream = () =>
    Observable
        .combineLatest(
            filterWidgetViewStream(),
            fetchNAddWidgetViewStream(),
            feedListViewStream(),
            view
        );

export default viewStream;
