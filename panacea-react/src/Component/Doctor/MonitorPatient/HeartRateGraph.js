import React, { Component } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label
} from 'recharts';


function createData(time_past, heart_beat) {
    return { time_past: time_past, heart_beat: heart_beat }
}

let data = [];

export default function HeartBeatGraph(props) {
    const theme = useTheme();

    let monitor_data = props.monitor_data;
    data = []
    if (monitor_data != null) {
        let length = monitor_data.length;
        if (length > 50) {
            for (let i = 0; i < 50; i++) {
                data.push(createData(monitor_data[i].hours_past * 60 + monitor_data[i].minutes_past,
                    monitor_data[i].heart_beat));
            }
        }
        else {
            for (let i = 0; i < length; i++) {
                data.push(createData(monitor_data[i].hours_past * 60 + monitor_data[i].minutes_past,
                    monitor_data[i].heart_beat));
            }
        }
    }

    return (
        <LineChart
            width={1150}
            height={300}
            data={data}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time_past">
            </XAxis>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="heart_beat" stroke="#db2e2e" activeDot={{ r: 8 }} />
        </LineChart>
    );

}
