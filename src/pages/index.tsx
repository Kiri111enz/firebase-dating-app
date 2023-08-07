import RequireAuth from 'components/RequireAuth';
import { NextPage } from 'next';

const Home: NextPage = () => (
    <RequireAuth>
        aboba
    </RequireAuth>
);

export default Home;