import { useState } from 'react';
import { NextPage } from 'next';
import { SegmentedControl, Tabs } from '@mantine/core';
import RequireAuth from 'components/RequireAuth';

const Home: NextPage = () => {
    const [activeTab, setActiveTab] = useState('feed');

    return (
        <RequireAuth>
            <Tabs className="absolute left-1/2 -translate-x-1/2 h-screen w-screen text-center" value={activeTab}>
                <Tabs.Panel value="feed">
                    Feed content
                </Tabs.Panel>

                <Tabs.Panel value="likes">
                    Likes content
                </Tabs.Panel>
            
                <Tabs.Panel value="chats">
                    Chats content
                </Tabs.Panel>

                <Tabs.Panel value="profile">
                    Profile content
                </Tabs.Panel>
    
                <SegmentedControl style={{ position: 'sticky' }} className="top-[100vh]" fullWidth value={activeTab} onChange={setActiveTab} data={[
                    { value: 'feed', label: 'Feed' },
                    { value: 'likes', label: 'Likes' },
                    { value: 'chats', label: 'Chats', },
                    { value: 'profile', label: 'Profile' }
                ]}/>
            </Tabs>
        </RequireAuth>
    );
};

export default Home;