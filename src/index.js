import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import Comments from './Comments';
import TrendingSection from './fpl';
const pfoods = ReactDOM.createRoot(document.getElementById('popularfoods'));
const CommentsRec = ReactDOM.createRoot(document.getElementById('Comments'));
const fpl = ReactDOM.createRoot(document.getElementById('fpl'));

pfoods.render(
    <>
    <App/>
    </>
);
fpl.render (
    <TrendingSection/>
);
CommentsRec.render (
    <>
    <Comments/>
    </>
)
