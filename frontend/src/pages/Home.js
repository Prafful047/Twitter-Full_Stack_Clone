import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import auth from '../firebase.init';
import {Outlet} from 'react-router-dom';
import Widgets from './Widgets/Widjets';
import {signOut} from 'firebase/auth';
import { useAuthState} from 'react-firebase-hooks/auth';
import useLoggedInUser from '../hooks/useLoggedInUser';


const Home = () => {

    const user = useAuthState(auth)

    const handleLogout = () => {
        signOut(auth);
    }

    return(
        <div className='app'>
            <Sidebar handleLogout={handleLogout} user={user} />
            <Outlet />
            <Widgets />
        </div>
    )
};

export default Home;