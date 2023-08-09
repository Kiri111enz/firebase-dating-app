import React, { useContext } from 'react';
import { useRouter} from 'next/router';
import { SegmentedControl } from '@mantine/core';
import { ProfileContext } from './RequireAuth';

const Footer: React.FC = () => {
    const { profileSetUp } = useContext(ProfileContext);
    const router = useRouter();

    return (
        <SegmentedControl style={{ position: 'sticky' }} className="top-[100vh]" fullWidth
            value={router.pathname.substring(1)} onChange={(value) => router.push(value)} data={[
                { value: 'feed', label: 'Feed', disabled: !profileSetUp },
                { value: 'likes', label: 'Likes', disabled: !profileSetUp },
                { value: 'chats', label: 'Chats', disabled: !profileSetUp },
                { value: 'profile', label: 'Profile' }
            ]}/>
    );
};

export default Footer;