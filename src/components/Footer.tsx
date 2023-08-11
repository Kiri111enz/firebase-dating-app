import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { SegmentedControl } from '@mantine/core';
import { ProfileContext } from './RequireAuth';

const Footer: React.FC = () => {
    const { profile } = useContext(ProfileContext);
    const router = useRouter();

    return (
        <SegmentedControl style={{ position: 'sticky' }} className="top-[100vh]" fullWidth
            value={router.pathname.substring(1)} onChange={(value) => router.push(value)} data={[
                { value: 'feed', label: 'Feed', disabled: !profile.setUp },
                { value: 'likes', label: 'Likes', disabled: !profile.setUp },
                { value: 'chats', label: 'Chats', disabled: !profile.setUp },
                { value: 'profile', label: 'Profile' }
            ]}/>
    );
};

export default Footer;