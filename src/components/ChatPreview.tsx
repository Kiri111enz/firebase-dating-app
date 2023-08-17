import React from 'react';
import { Avatar, Paper, Text } from '@mantine/core';
import { Profile } from 'stores/UserStore';
import usePhotoURL from 'hooks/usePhotoURL';

interface ChatPreviewProps {
    className?: string
    onClick?: () => void
    profile: Profile
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ className, onClick, profile }) => {
    const photoURL = usePhotoURL(profile);

    return (
        <Paper shadow="xs" radius="xs" className={`px-4 w-full ${className}`} onClick={onClick}>
            <div className="flex items-center py-2">
                <Avatar size="lg" radius="xl" src={photoURL} />

                <div className="ml-4">
                    <Text className="font-semibold">{profile.name}</Text>
                </div>
            </div>
        </Paper>
    );
};

export default ChatPreview;