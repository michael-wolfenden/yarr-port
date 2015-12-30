import mainViewSteam from './components/main';
import render from './renderer';

import './styles/style.scss';

render(
    mainViewSteam(),
    document.getElementById('app')
);
