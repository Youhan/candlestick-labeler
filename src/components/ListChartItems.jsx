/**
 * This component lists all the chart items
 * it loads all the items from localforage
 * loops through them and displays them as <ChartListItem /> passing the data as props
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';
import { Button } from '../components/Button';
import FormNewItem from './FormNewItem';

export function ListChartItems() {
    const [chartItems, setChartItems] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const loadItems = async () => {
        const keys = await localforage.keys();
        // filter keys starting with 'inf-chart-'
        const filteredKeys = keys.filter((key) => {
            return key.startsWith('inf-chart-');
        });
        const values = await Promise.all(
            filteredKeys.map((key) => {
                return localforage.getItem(key);
            })
        );
        setChartItems(values);
    };

    // load all the items from localforage
    useEffect(() => {
        loadItems();
    }, []);

    /**
     * Get the id from the item and delete it from localforage
     * Ask the user for confirmation
     */
    const deleteItem = async (item) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this item?'
        );
        if (confirmed) {
            localforage.removeItem(item.id).then(() => {
                loadItems();
            });
        }
    };
    return (
        <div className="mt-8">
            <div className="flex items-center justify-between rounded-md p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div></div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => {
                            setShowForm((prev) => !prev);
                        }}
                    >
                        Create new
                    </Button>
                </div>
            </div>
            {showForm && (
                <FormNewItem
                    handleItemAdded={() => {
                        setShowForm(false);
                        loadItems();
                    }}
                ></FormNewItem>
            )}
            {chartItems.length === 0 && (
                <div className="mt-4 grid place-items-center border-2 border-gray-800 border-dashed p-16 rounded-md">
                    <p>No charts found</p>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4 mt-12">
                {chartItems.map((chartItem) => {
                    return (
                        <div
                            key={chartItem.id}
                            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <Link
                                        to={`/chart/${chartItem.id}`}
                                        className="text-lg text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    >
                                        {chartItem.meta.title}
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        onClick={() => {
                                            deleteItem(chartItem);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
