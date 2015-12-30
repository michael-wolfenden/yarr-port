import { h } from 'virtual-dom';
import { Observable } from 'rx';

const view = () =>
    <div className="sidebar-container">
        <div className="sidebar-brand">
            <h2 className="sidebar-brand">Yarr</h2>
        </div>
    </div>;

const viewStream = () =>
    Observable
        .return(view());

export default viewStream;
