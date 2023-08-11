import { useContext, useState, useEffect } from 'react';
import { Paper, TextInput, Text, Slider, Button, Radio, Group, Autocomplete, FileButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ref, getDownloadURL } from 'firebase/storage';
import cities from 'cities-list';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import { ProfileContext } from '../components/RequireAuth';

const Profile: NextPageWithLayout = () => {
    const { storage } = useContext(AppContext);
    const profile = useContext(ProfileContext);
    const form = useForm({
        initialValues: profile,
        validate: {
            name: (value) => {
                if (value.length < 2 || value.length > 16)
                    return 'Name must be 2 to 16 characters.';
                if (value.includes(' '))
                    return 'Name should not contain whitespaces.';
                return null;
            }, // @ts-ignore - cities[value] is valid
            city: (value) => cities[value] ? null : 'Incorrect city.',
        },
    });
    const [photoRef] = useState(ref(storage, form.values.photoPath));
    const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!photoURL && form.values.photoPath)
            getDownloadURL(photoRef).then((url) => setPhotoURL(url)).catch(() => void 0);
    }, [photoURL]);

    return (
        <Paper shadow="xs" className="h-fit m-10 py-2 pb-2 px-4 rounded-lg"
            component="form" onSubmit={form.onSubmit((values) => console.log(values))}>
            <div className="flex flex-row space-x-4">
                <div>
                    <Text className="mb-2">Name:</Text>
                    <TextInput {...form.getInputProps('name')} />

                    <Text className="mt-4 mb-2">Gender:</Text>
                    <Radio.Group {...form.getInputProps('gender')}>
                        <Group>
                            <Radio value="M" label="Male" />
                            <Radio value="F" label="Female" />
                        </Group>
                    </Radio.Group>

                    <Text className="mt-4 mb-2">Age: {form.values.age}</Text>
                    <Slider className="m-2" {...form.getInputProps('age')}/>

                    <Text className="mt-4 mb-2">City:</Text>
                    <Autocomplete placeholder="Start typing..." data={Object.keys(cities)}
                        {...form.getInputProps('city')} />
                </div>

                <div className="flex flex-col">
                    <Text className="mb-2">Photo:</Text>
                    <div className="grow">
                        <img className={`max-h-[13rem] ${photoURL ? '' : 'text-[#fa5252]'}`}
                            src={photoURL} alt="Select an image." />
                    </div>
                    <div className="text-center mt-2">
                        <FileButton onChange={(file) => setPhotoURL(file ? URL.createObjectURL(file) : undefined)}
                            accept="image/png,image/jpeg">
                            {(props) => <Button {...props}>Choose image</Button>}
                        </FileButton>
                    </div>
                </div>
            </div>

            {form.isDirty() &&
                <div className="text-center mt-2">
                    <Button type="submit">Update</Button>
                </div>
            }
        </Paper>
    );
};

Profile.getLayout = MainPageLayout;

export default Profile;