import { NextPageWithLayout, MainPageLayout } from './_app';

const Chats: NextPageWithLayout = () => (
    <>Chats page</>
);

Chats.getLayout = MainPageLayout;

export default Chats;