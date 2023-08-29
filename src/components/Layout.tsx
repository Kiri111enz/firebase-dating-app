import React, { PropsWithChildren } from 'react';
import Footer from './Footer';

const Layout: React.FC<PropsWithChildren> = ({ children }) => (
    <div className="flex flex-col h-[100dvh]">
        <main className="grow overflow-auto flex items-center justify-center">
            {children}
        </main>
        <Footer className="shrink-0" />
    </div>
);

export default Layout;