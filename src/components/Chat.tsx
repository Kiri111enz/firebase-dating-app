import React from 'react';
import { ActionIcon} from '@mantine/core';
import { IconArrowNarrowLeft} from '@tabler/icons-react';
import { User } from 'stores/UserStore';

interface ChatProps {
    className?: string
    onClose?: () => void
    user: User
}

const Chat: React.FC<ChatProps> = ({ className, onClose, user }) => {
    return (
        <div className={className}>
            {user.profile.name}

            <ActionIcon color="blue" className="absolute top-1 left-1" onClick={onClose}>
                <IconArrowNarrowLeft size="2rem" />
            </ActionIcon>
        </div>
    );
};

export default Chat;