import feedsStream from './feeds';

const postsSteam = feedsStream
      .map(feed => feed.entries);

export default postsSteam;
