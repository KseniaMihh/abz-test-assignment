import Header from "./components/Header.jsx";
import BannerSection from "./components/BannerSection.jsx";
import UsersSection from "./components/UsersSection.jsx";
import FormSection from "./components/FormSection.jsx";
import {useState} from "react";


const App = () => {
    const [refreshUsers, setRefreshUsers] = useState(0);

    const handleUserRegistered = () => {
        setRefreshUsers(prev => prev + 1);
    };

    return (
        <>
            <Header />
            <BannerSection />
            <UsersSection refreshTrigger={refreshUsers} />
            <FormSection onUserRegistered={handleUserRegistered} />
        </>
    );
};

export default App;