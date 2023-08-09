import { NextPageWithLayout, MainPageLayout } from './_app';

const Likes: NextPageWithLayout = () => (
    <>Likes page</>
);

Likes.getLayout = MainPageLayout;

export default Likes;