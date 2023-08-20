import { useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ActionIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustments } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ProfileFeed from 'components/ProfileFeed';
import Filter from 'components/Filter';

const Feed: NextPageWithLayout = observer(() => {
    const { firestore, userStore } = useContext(AppContext);
    const [filterOpened, { open, close }] = useDisclosure(false);

    return (
        <>
            <ProfileFeed fetchCandidates={() => getDocs(query(collection(firestore, 'users'),
                where('profile.gender', 'in', userStore.user!.filter.genders),
                where('profile.age', '<=', userStore.user!.filter.maxAge),
                where('profile.age', '>=', userStore.user!.filter.minAge),
                where('profile.city', '==', userStore.user!.filter.city)
            ))} deps={[userStore.user?.filter]} />

            <ActionIcon color="blue" className="absolute top-1 left-1" onClick={open}>
                <IconAdjustments size="2rem"/>
            </ActionIcon>

            <Modal opened={filterOpened} onClose={close} title="Filter" centered>
                <Filter close={close} />
            </Modal>
        </>
    );
});

Feed.getLayout = MainPageLayout;

export default Feed;