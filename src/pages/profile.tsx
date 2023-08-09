import { NextPageWithLayout, MainPageLayout } from './_app';

const Profile: NextPageWithLayout = () => (
    <>Profile page</>
);

Profile.getLayout = MainPageLayout;

export default Profile;