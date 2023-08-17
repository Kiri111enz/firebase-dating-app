import { useContext, useState, useEffect} from 'react';
import { AppContext } from 'pages/_app';
import { Profile } from 'stores/UserStore';
import { getDownloadURL, ref } from 'firebase/storage';

const usePhotoURL = (profile: Profile): string | undefined => {
    const { storage } = useContext(AppContext);
    const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);

    useEffect(() => {
        getDownloadURL(ref(storage, profile.photoPath))
            .then((url) => setPhotoURL(url))
            .catch(() => {
                setPhotoURL(undefined);
                console.log('Exception trying to download profile photo.', profile);
            });
    }, [profile]);

    return photoURL;
};

export default usePhotoURL;