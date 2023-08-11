import React, { PropsWithChildren } from 'react';
import Footer from './Footer';

const Layout: React.FC<PropsWithChildren> = ({ children }) => (
    <div className="flex flex-col h-screen">
        <main className="grow flex items-center justify-center">
            {children}
        </main>
        <Footer />
    </div>
);

export default Layout;