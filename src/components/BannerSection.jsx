import React from 'react';

const BannerSection = () => {
    const scrollToSection = () => {
        const formSection = document.getElementById('form-section');
        if (formSection) {
            formSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <section className="banner-section">
            <div className="banner-background">
                <img src='/public/banner.svg' alt='Banner Image'/>
            </div>
            <div className="banner-content">
                <h1 className="banner-heading">
                    Test assignment for<br />
                    front-end developer
                </h1>

                <div className="banner-description">
                    <p>
                        What defines a good front-end developer is one that
                        has skilled knowledge of HTML, CSS, JS with a vast
                        understanding of User design thinking as they'll be
                        building web interfaces with accessibility in mind.
                        They should also be excited to learn, as the world of
                        Front-End Development keeps evolving.
                    </p>
                </div>

                <button
                    style={{justifySelf: 'center'}}
                    className="btn btn-scroll"
                    onClick={() => scrollToSection('form-section')}
                >
                    Sign up
                </button>
            </div>
        </section>
    );
};

export default BannerSection;