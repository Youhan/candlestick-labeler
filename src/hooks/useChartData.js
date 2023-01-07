/**
 * This is a custom hook that returns the chart data along with loading and error states.
 * It fetches the data from localforage using the key provided.
 */

import { useCallback, useEffect, useState } from 'react';
import localforage from 'localforage';

const statusEnum = {
    idle: 'idle',
    loading: 'loading',
    done: 'done'
};

export function useLoadChartData(key) {
    const [candles, setCandles] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const fetchedData = await localforage.getItem(key);
            const { meta, data } = fetchedData;
            setCandles(data.candles);
            setMarkers(data.markers);
            setMeta(meta);
            setLoading(false);
        } catch (error) {
            setError(true);
        }
    }, [key]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        meta,
        candles,
        markers,
        loading,
        error,
        setMarkers
    };
}

export function useSaveChartData(key, meta, candles, markers) {
    const [status, setStatus] = useState(statusEnum.idle);
    const [error, setError] = useState(null);

    const saveWork = useCallback(async () => {
        setStatus('loading');
        try {
            const data = {
                id: key,
                meta,
                data: {
                    candles,
                    markers
                }
            };
            await localforage.setItem(key, data);
            setStatus(statusEnum.done);
        } catch (error) {
            setError(error);
        }
    }, [candles, key, markers, meta]);
    return { saveWork, status, error };
}

export function useExportData(key, candles, markers) {
    const [status, setStatus] = useState(statusEnum.idle);
    const [error, setError] = useState(null);

    const exportData = useCallback(async () => {
        setStatus(statusEnum.loading);
        try {
            const headerRow = 'time, open, high, low, close, class';
            const csvData = candles.map((candle, index) => {
                const marker = markers[index];
                const markerText = marker ? marker.text : '';
                return `${candle.time}, ${candle.open}, ${candle.high}, ${candle.low}, ${candle.close}, ${markerText}`;
            });
            csvData.unshift(headerRow);
            const csvContent = `data:text/csv;charset=utf-8,${csvData.join(
                '\n'
            )}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `${key}.csv`);
            document.body.appendChild(link);
            link.click();
            setStatus(statusEnum.done);
        } catch (error) {
            setError(error);
        }
    }, [candles, key, markers]);
    return { exportData, status, error };
}

export function useCandleClick(meta, markers, setMarkers) {
    const handleCandleClick = useCallback(
        (param) => {
            const time = param.time;
            const marker = markers.find((m) => m.time === time);

            // if there is no marker at the clicked time, add a new one
            if (!marker) {
                markers.push({
                    time,
                    color: 'white',
                    position: 'aboveBar',
                    text: 'C1'
                });
                // sort markers by time
                markers.sort((a, b) => a.time - b.time);
                return;
            }

            // else we rotate C1 -> C2 -> C3 -> C1 based on meta.numClasses
            else {
                const numClasses = meta.numClasses;
                const classes = ['C1', 'C2', 'C3'];
                const classIndex = classes.indexOf(marker.text);
                const nextClassIndex = (classIndex + 1) % numClasses;
                marker.text = classes[nextClassIndex];
            }

            // update markers
            setMarkers([...markers]);
        },
        [markers]
    );

    return handleCandleClick;
}
