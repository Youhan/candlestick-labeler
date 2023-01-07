import React from 'react';
import Container from './Container';

function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 w-full flex-shrink-0 py-10">
            <Container>
                <p className="text-gray-500">
                    &copy; {new Date().getFullYear()} - Inferese{' '}
                </p>
            </Container>
        </footer>
    );
}

export default Footer;
