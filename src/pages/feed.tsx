import { NextPageWithLayout, MainPageLayout } from './_app';

const Feed: NextPageWithLayout = () => (
    <>Feed page</>
);

Feed.getLayout = MainPageLayout;

export default Feed;