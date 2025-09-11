const Header = () => {
    return (
        <header>
            <img className='logo' src='/Logo.svg' alt='logo' />
            <div className='cta'>
                <button className='btn btn-primary'>Users</button>
                <button className='btn btn-primary'>Sign up</button>
            </div>
        </header>
    );
};

export default Header;