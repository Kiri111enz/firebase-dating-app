import React from 'react';
import { Card, ScrollArea, Text, Button } from '@mantine/core';
import { Profile } from 'stores/UserStore';
import usePhotoURL from 'hooks/usePhotoURL';

interface ProfileCardProps {
    imgClassName?: string
    imgOnLoad?: () => void
    profile: Profile
    onLike?: () => void
    onPass?: () => void
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imgClassName, imgOnLoad, profile, onLike, onPass }) => {
    const photoURL = usePhotoURL(profile);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <img className={imgClassName} src={photoURL} alt="" onLoad={imgOnLoad}/>
            </Card.Section>
            <Card.Section>
                <Text className="m-2 text-xl font-semibold">{`${profile.name}, ${profile.age}`}</Text>
                {profile.info &&
                    <ScrollArea mah="5rem">
                        <Text className="table-caption m-2 mt-0">{profile.info}</Text>
                    </ScrollArea>
                }
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