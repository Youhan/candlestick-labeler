/**
 * This component shows a form to create a new chart item
 * fields are title, numClasses and csvfile as an upload form
 * after submitting the form,
 * - it parses the content of the csv file into JSON object using papaparse
 * - then it create a new object the the form below:
 * {
 *      id: 'inf-chart-<timestamp>',
 *      meta: {
 *          title: 'title from the form',
 *          numClasses: 'numClasses from the form',
 *      },
 *      data: {
 *          candles: [
 *              {
 *                  time: 'time from the csv file',
 *                  open: 'open from the csv file',
 *                  high: 'high from the csv file',
 *                  low: 'low from the csv file',
 *                  close: 'close from the csv file'
 *              }, ...
 *          ],
 *          markers: [
 *              {
 *                  time: 'time from the csv file',
 *                  text: 'label from the csv file',
 *                  position: 'aboveBar',
 *                  color: 'white'
 *              }, ...
 *         ]
 *     }
 * }
 * - it saves the data to localforage with a key of 'inf-chart-<timestamp>'
 */

import React, { useState } from 'react';
import localforage from 'localforage';
import { useForm } from 'react-hook-form';
import Papa from 'papaparse';
import { Button } from '../components/Button';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

function FormNewItem({ handleItemAdded }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        const { title, numClasses, csvfile } = data;

        const file = csvfile[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
            const csv = e.target.result;
            const result = Papa.parse(csv, { header: true });

            const { data } = result;
            const candles = data
                .filter((item) => item.time)
                .map((item) => {
                    // remove possible spaces in all keys
                    Object.keys(item).forEach((key) => {
                        item[key.replace(/\s/g, '')] = item[key];
                    });
                    return {
                        time: new Date(parseInt(item.time, 10)).getTime(),
                        open: parseFloat(item.open),
                        high: parseFloat(item.high),
                        low: parseFloat(item.low),
                        close: parseFloat(item.close)
                    };
                });
            const markers = data.map((item) => {
                return {
                    time: new Date(parseInt(item.time, 10)).getTime(),
                    text: item.label || 'C1',
                    position: 'aboveBar',
                    color: 'white'
                };
            });
            const chartItem = {
                id: `inf-chart-${Date.now()}`,
                meta: {
                    title,
                    numClasses
                },
                data: {
                    candles,
                    markers
                }
            };
            const item = await localforage.setItem(chartItem.id, chartItem);

            handleItemAdded();
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-8 my-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                        <label
                            for="title"
                            class="block text-sm font-medium text-gray-500"
                        >
                            Title
                        </label>
                        <div class="mt-1">
                            <input
                                required
                                id="title"
                                type="text"
                                defaultValue=""
                                {...register('title')}
                                class="block w-full rounded shadow-sm dark:bg-gray-700 dark:text-gtay-300"
                            />
                        </div>
                    </div>
                    <div class="sm:col-span-3">
                        <label
                            for="numClasses"
                            class="block text-sm font-medium text-gray-500"
                        >
                            Number of Classes
                        </label>
                        <div class="mt-1">
                            <input
                                required
                                id="numClasses"
                                min={2}
                                max={10}
                                type="number"
                                defaultValue={2}
                                {...register('numClasses')}
                                class="block w-full rounded shadow-sm dark:bg-gray-700 dark:text-gtay-300"
                            />
                        </div>
                    </div>
                    <div class="sm:col-span-6">
                        <label
                            for="csvfile"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-500"
                        >
                            CSV file
                        </label>
                        <div>
                            <p className="text-sm text-gray-500">
                                The CSV file should contain{' '}
                                <code className="text-gray-400">time</code>,{' '}
                                <code className="text-gray-400">open</code>,{' '}
                                <code className="text-gray-400">high</code>,{' '}
                                <code className="text-gray-400">low</code>,{' '}
                                <code className="text-gray-400">close</code> and{' '}
                                <code className="text-gray-400">label</code>{' '}
                                columns.
                            </p>
                            <p className="text-sm text-gray-500">
                                time data should be in unix timestamp in
                                seconds. e.g.{' '}
                                <code className="text-gray-400">
                                    1628744399
                                </code>
                            </p>
                        </div>
                        <div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700 px-6 pt-5 pb-6">
                            <div class="space-y-1 text-center">
                                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div class="flex items-center text-sm text-gray-500">
                                    <label
                                        for="csvfile"
                                        class="relative cursor-pointer rounded-md bg-white dark:bg-gray-300 py-2 px-3 font-medium text-violet-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-500 focus-within:ring-offset-2 hover:text-violet-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            required
                                            accept=".csv"
                                            id="csvfile"
                                            {...register('csvfile')}
                                            type="file"
                                            class="sr-only"
                                        />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500">CSV File</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </div>
    );
}

export default FormNewItem;
