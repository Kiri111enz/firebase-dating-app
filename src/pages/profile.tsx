import { useContext, useState, useEffect } from 'react';
import { Paper, TextInput, Text, Slider, Button, Radio, Group, Autocomplete, FileButton, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import cities from 'cities-list';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import { ProfileContext, Profile } from 'components/RequireAuth';

export interface Filter {
    gender: string
    minAge: number
    maxAge: number
    city: string
}

const getDefaultFilter = (profile: Profile): Filter => ({
    gender: profile.gender === 'M' ? 'F' : 'M',
    minAge: profile.age - 5,
    maxAge: profile.age + 5,
    city: profile.city
});

const Profile: NextPageWithLayout = () => {
    const { auth, firestore, storage } = useContext(AppContext);
    const { profile, profileRef } = useContext(ProfileContext);
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
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!photoURL)
            getDownloadURL(photoRef).then((url) => setPhotoURL(url)).catch(() => void 0);
    }, [photoURL]);

    const updateProfile = async (values: Profile): Promise<void> => {
        setUploading(true);
        if (file)
            await uploadBytes(ref(storage, form.values.photoPath), file);
        if (!values.setUp) {
            values.setUp = true;
            await setDoc(doc(firestore, 'filters', auth.currentUser!.uid), getDefaultFilter(values));
        }
        await updateDoc(profileRef!, {...values});
        window.location.reload();
    };

    if (uploading)
        return <Loader />;

    return (
        <Paper shadow="xs" className="h-fit m-10 py-2 pb-2 px-4 rounded-lg"
            component="form" onSubmit={form.onSubmit((values) => updateProfile(values))}>
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
                        <FileButton onChange={(file) => {
                            setFile(file);
                            setPhotoURL(file ? URL.createObjectURL(file) : undefined);
                        }}
                        accept="image/png,image/jpeg">
                            {(props) => <Button {...props}>Choose image</Button>}
                        </FileButton>
                    </div>
                </div>
            </div>

            {(form.isDirty() || file) &&
                <div className="text-center mt-2">
                    <Button type="submit">Update</Button>
                </div>
            }
        </Paper>
    );
};

Profile.getLayout = MainPageLayout;

export default Profile;