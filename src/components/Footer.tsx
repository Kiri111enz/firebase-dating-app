import React from 'react';
import { useRouter} from 'next/router';
import {SegmentedControl} from '@mantine/core';

const Footer: React.FC = () => {
    const router = useRouter();

    return (
        <SegmentedControl style={{ position: 'sticky' }} className="top-[100vh]" fullWidth
            value={router.pathname.substring(1)} onChange={(value) => router.push(value)} data={[
                { value: 'feed', label: 'Feed' },
                { value: 'likes', label: 'Likes' },
                { value: 'chats', label: 'Chats', },
                { value: 'profile', label: 'Profile' }
            ]}/>
    );
};

export default Footer;