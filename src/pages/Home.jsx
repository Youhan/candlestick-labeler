import React from 'react';
import Container from '../components/layout/Container';
import { ListChartItems } from '../components/ListChartItems';

function Home() {
    return (
        <div className="mt-12">
            <Container>
                <h1 className="text-4xl font-bold">Home</h1>
                <p className="text-gray-500 text-sm">
                    All data is kept on your browser and is never sent to a
                    server. You can check developer tools {'>'} Applications
                    {'>'} IndexedDB to check the saved data.
                </p>
                <ListChartItems />
            </Container>
        </div>
    );
}

export default Home;
