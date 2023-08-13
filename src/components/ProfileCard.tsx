import React, { useContext, useState, useEffect } from 'react';
import { Card, Text, Button } from '@mantine/core';
import { ref, getDownloadURL } from 'firebase/storage';
import { AppContext } from 'pages/_app';
import { Profile } from 'stores/ProfileStore';

interface ProfileCardProps {
    profile: Profile
    maxH: string
    maxW: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, maxH, maxW }) => {
    const { storage } = useContext(AppContext);
    const [photoRef] = useState(ref(storage, profile.photoPath));
    const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);

    useEffect(() => {
        getDownloadURL(photoRef).then((url) => setPhotoURL(url)).catch(() => void 0);
    }, []);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <img className={`max-h-[${maxH}] max-w-[${maxW}]`} src={photoURL} alt="Idi nahui" />
            </Card.Section>
            <Card.Section>
                <Text className="m-2 text-xl font-semibold">{`${profile.name}, ${profile.age}`}</Text>
            </Card.Section>
            <Card.Section>
                <Button.Group>
                    <Button color="teal" fullWidth>Like</Button>
                    <Button color="red" fullWidth>Pass</Button>
                </Button.Group>
            </Card.Section>
        </Card>
    );
};

export default ProfileCard;