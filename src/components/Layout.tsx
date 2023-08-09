import React, { PropsWithChildren} from 'react';
import Footer from './Footer';

const Layout: React.FC<PropsWithChildren> = ({ children }) => (
    <div className="absolute left-1/2 -translate-x-1/2 h-screen w-screen text-center">
        <main>{children}</main>
        <Footer />
    </div>
);

export default Layout;