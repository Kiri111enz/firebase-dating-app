import React, { useContext } from 'react';
import { Text, Slider, Checkbox, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AppContext } from 'pages/_app';

const Filter: React.FC<{ close: () => void}> = ({ close }) => {
    const { userStore } = useContext(AppContext);
    const form = useForm({
        initialValues: {
            ...userStore.user!.filter,
            genders: [...userStore.user!.filter.genders]
        },
        validate: {
            maxAge: (value, values) => value >= values.minAge ? null : 'Incorrect max age.',
            genders: (value) => value.length === 0 ? 'Choose at least one.' : null
        }
    });

    return (
        <form onSubmit={form.onSubmit((values) => userStore.updateFilter(values).then(() => close()))}>
            <div className="flex items-center pt-8">
                <Text className="whitespace-nowrap mr-2">Min age:</Text>
                <Slider labelAlwaysOn className="w-[20rem]" {...form.getInputProps('minAge')} />
            </div>
            <div className="flex items-center pt-10">
                <Text className="whitespace-nowrap mr-2">Max age:</Text>
                <Slider labelAlwaysOn className="w-[20rem]" {...form.getInputProps('maxAge')} />
            </div>
            <Checkbox.Group className="mt-4" {...form.getInputProps('genders')}>
                <Text>You are interested in:</Text>
                <Group mt="xs">
                    <Checkbox value="F" label="Females" />
                    <Checkbox value="M" label="Males" />
                </Group>
            </Checkbox.Group>

            {form.isDirty() &&
                <div className="text-center mt-4">
                    <Button disabled={!form.isValid()} type="submit">Update</Button>
                </div>
            }
        </form>
    );
};

export default Filter;