import React from 'react';
import { createChart, ColorType } from 'lightweight-charts';

function Chart({ candles, markers, handleClick }) {
    const chartContainerRef = React.useRef();

    const [currentVisibleLogicalRange, setCurrentVisibleLogicalRange] =
        React.useState(null);

    React.useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth
            });
        };

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 800,
            layout: {
                backgroundColor: '#131722',
                lineColor: '#2B2B43',
                textColor: '#5d596a'
            },
            grid: {
                vertLines: {
                    color: '#242328'
                },
                horzLines: {
                    color: '#242328'
                }
            },
            crosshair: {
                vertLine: {
                    color: '#2e2c33',
                    labelBackgroundColor: '#242328'
                },
                horzLine: {
                    color: '#2e2c33',
                    labelBackgroundColor: '#242328'
                }
            }
        });

        // here we set the visible logical range to the one we have in state
        // this is needed to keep the chart visible range after component re-renders
        if (currentVisibleLogicalRange) {
            chart
                .timeScale()
                .setVisibleLogicalRange(currentVisibleLogicalRange);
        }

        // subscribe to visible logical range change event
        chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
            // save the visible logical range to the state
            setCurrentVisibleLogicalRange(logicalRange);
        });

        // subscribe to click event
        chart.subscribeClick((param) => {
            handleClick(param);
        });

        const candleSeries = chart.addCandlestickSeries();

        // add candles
        if (candles) candleSeries.setData(candles);

        // add markers
        if (markers && candleSeries) candleSeries.setMarkers(markers);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove();
        };
    }, [markers, candles]);

    return <div ref={chartContainerRef} />;
}

export default Chart;
