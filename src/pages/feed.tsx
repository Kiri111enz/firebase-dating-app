import { useContext, useEffect } from 'react';
import { collection, query, where, doc, getDoc, getDocs } from 'firebase/firestore';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import { Filter } from 'stores/FilterStore';

const Feed: NextPageWithLayout = () => {
    const { auth, firestore } = useContext(AppContext);

    useEffect(() => {
        getDoc(doc(firestore, 'filters', auth.currentUser!.uid))
            .then((snapshot) => {
                const filter = snapshot.data() as Filter;
                getDocs(query(collection(firestore, 'profiles'),
                    where('gender', '==', filter.gender),
                    where('age', '<=', filter.maxAge),
                    where('age', '>=', filter.minAge),
                    where('city', '==', filter.city))
                ).then((querySnapshot) => querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                }));
            });
    }, []);

    return (
        <>Feed page</>
    );
};

Feed.getLayout = MainPageLayout;

export default Feed;