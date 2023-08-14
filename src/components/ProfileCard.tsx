import React, { useContext, useState, useEffect } from 'react';
import { Card, Text, Button } from '@mantine/core';
import { ref, getDownloadURL } from 'firebase/storage';
import { AppContext } from 'pages/_app';
import { Profile } from 'stores/ProfileStore';

interface ProfileCardProps {
    imgClassName?: string
    profile: Profile
    onLike?: () => void
    onPass?: () => void
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imgClassName, profile, onLike, onPass }) => {
    const { storage } = useContext(AppContext);
    const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);

    useEffect(() => {
        getDownloadURL(ref(storage, profile.photoPath))
            .then((url) => setPhotoURL(url))
            .catch(() => void 0);
    }, [profile]);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <img className={imgClassName} src={photoURL} alt="Idi nahui" />
            </Card.Section>
            <Card.Section>
                <Text className="m-2 text-xl font-semibold">{`${profile.name}, ${profile.age}`}</Text>
            </Card.Section>
            <Card.Section>
                <Button.Group>
                    <Button color="teal" fullWidth onClick={onLike}>Like</Button>
                    <Button color="red" fullWidth onClick={onPass}>Pass</Button>
                </Button.Group>
            </Card.Section>
        </Card>
    );
};

export default ProfileCard;