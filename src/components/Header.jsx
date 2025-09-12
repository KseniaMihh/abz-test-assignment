import '/src/styles/components/button.css'

const Header = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <header>
            <img className='logo' src='/Logo.svg' alt='logo' />
            <div className='header-btn'>
                <button
                    className="btn btn-scroll"
                    onClick={() => scrollToSection('users-section')}
                >
                    Users
                </button>
                <button
                    className="btn btn-scroll"
                    onClick={() => scrollToSection('form-section')}
                >
                    Sign up
                </button>
            </div>
        </header>
    );
};

export default Header;