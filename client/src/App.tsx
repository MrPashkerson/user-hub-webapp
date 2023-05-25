import React, {FC, useContext, useEffect} from 'react';
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import MainPage from "./components/MainPage";

const App: FC = () => {
    const { store } = useContext(Context);

    useEffect(() => {
        if(localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    useEffect(() => {
        if (store.isAuth) {
            store.setIsLoginFormActive(true);
        }
    }, [store.isAuth]);

    if (store.isLoading) {
        return <div></div>;
    }

    if (!store.isAuth) {
        return (
            <div>
                {store.isLoginFormActive ?
                    (<LoginForm switchToRegister={() => store.setIsLoginFormActive(false)} />) :
                        (<RegistrationForm switchToLogin={() => store.setIsLoginFormActive(true)} />)}
            </div>
        )
    }


    return (
        <div>
            <MainPage/>
        </div>
    )
}

export default observer(App);
