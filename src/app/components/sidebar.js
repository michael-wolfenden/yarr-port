import { h } from 'virtual-dom';
import { Observable } from 'rx';

import filterWidgetViewStream from './sidebar-filter-widget';
import fetchNAddWidgetViewStream from './sidebar-fetch-n-add-widget';
import feedListViewStream, { selectedFeedUrlStream } from './sidebar-feed-list';
import { feedFiltersStream as filterWidgetFiltersStream } from './sidebar-filter-widget';

const feedFiltersStream = () =>
    Observable
        .combineLatest(
            filterWidgetFiltersStream().startWith(''),
            selectedFeedUrlStream().startWith(''),
            (filter, feedUrl) => {
                return { filter, feedUrl };
            }
        )
        .map(check => {
            let filter = {};

            switch (check.filter) {
            case 'read':
                filter.read = 'true'; break;
            case 'unread':
                filter.read = 'false'; break;
            default:
                filter = {}; break;
            }

            if (check.feedUrl) {
                filter.feedUrl = check.feedUrl;
            }

            return filter;
        });

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
export { feedFiltersStream };
