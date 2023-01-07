/**
 * @file ChartSingle.jsx
 * @description ChartSingle page.
 *
 * This component is a page that displays a single chart.
 * We need the id of the chart from url params
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import PreCode from '../components/PreCode';
import {
    useLoadChartData,
    useSaveChartData,
    useExportData,
    useCandleClick
} from '../hooks/useChartData';
import Chart from '../components/Chart';
import { Button } from '../components/Button';
import { ArrowDownTrayIcon, FolderPlusIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ChartSingle() {
    const { id } = useParams();
    const { meta, candles, markers, loading, error, setMarkers } =
        useLoadChartData(id);
    const {
        saveWork,
        status: saveWorkStatus,
        error: saveWorkError
    } = useSaveChartData(id, meta, candles, markers);
    const {
        exportData,
        status: exportDataStatus,
        error: exportDataError
    } = useExportData(id, candles, markers);

    const handleCandleClick = useCandleClick(meta, markers, setMarkers);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        console.error(error);
        return <div>Error: {error.message}</div>;
    }

    if (!candles) {
        return <div>No Data!</div>;
    }

    return (
        <>
            <Container className="py-10">
                <div className="flex items-center justify-between mb-0">
                    <div>
                        <h1 className="text-3xl font-bold">{meta.title}</h1>
                    </div>
                    <div className="flex space-x-2 bg-gray-800 p-2 rounded-md">
                        <Button onClick={saveWork}>
                            {saveWorkStatus === 'loading' ? (
                                <ArrowPathIcon className="w-5 h-5 animate-spin"></ArrowPathIcon>
                            ) : (
                                <FolderPlusIcon className="w-5 h-5"></FolderPlusIcon>
                            )}
                            <span>Save work</span>
                        </Button>
                        <Button onClick={exportData}>
                            {exportDataStatus === 'loading' ? (
                                <ArrowPathIcon className="w-5 h-5 animate-spin"></ArrowPathIcon>
                            ) : (
                                <ArrowDownTrayIcon className="w-5 h-5"></ArrowDownTrayIcon>
                            )}
                            <span>Export</span>
                        </Button>
                    </div>
                </div>
                {/* <PreCode>{JSON.stringify(chartData, null, 2)}</PreCode> */}
            </Container>
            <div className="bg-gray-800 rounded-lg w-full overflow-hidden border border-gray-800 shadow-md">
                <Chart
                    candles={candles}
                    markers={markers}
                    handleClick={handleCandleClick}
                />
            </div>
        </>
    );
}
