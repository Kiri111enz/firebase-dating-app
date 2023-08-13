import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { SegmentedControl } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { AppContext } from 'pages/_app';

const Footer: React.FC = observer(() => {
    const { profileStore: { profile } } = useContext(AppContext);
    const router = useRouter();

    return (
        <SegmentedControl style={{ position: 'sticky' }} className="top-[100vh]" fullWidth
            value={router.pathname.substring(1)} onChange={(value) => router.push(value)} data={[
                { value: 'feed', label: 'Feed', disabled: !profile!.setUp },
                { value: 'likes', label: 'Likes', disabled: !profile!.setUp },
                { value: 'chats', label: 'Chats', disabled: !profile!.setUp },
                { value: 'profile', label: 'Profile' }
            ]}/>
    );
});

export default Footer;