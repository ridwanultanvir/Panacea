import React, { Component } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


function createData(time_past, oxygen_level, breathing_rate) {
    return { time_past: time_past, oxygen_level: oxygen_level, breathing_rate: breathing_rate }
}

let data = [];

export default function OxygenLevelBreathingRateGraph(props) {
    const theme = useTheme();

    let monitor_data = props.monitor_data;
    data = []
    if (monitor_data != null) {
        let length = monitor_data.length;
        if (length > 50) {
            for (let i = length - 1; i >= length - 50; i--) {
                data.push(createData(monitor_data[i].hours_past + '-' + monitor_data[i].minutes_past,
                    monitor_data[i].oxygen_level * 100, monitor_data[i].breathing_rate));
            }
        }
        else {
            for (let i = length - 1; i >= 0; i--) {
                data.push(createData(monitor_data[i].hours_past + 'H-' + monitor_data[i].minutes_past + 'M',
                    monitor_data[i].oxygen_level * 100, monitor_data[i].breathing_rate));
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
            <XAxis dataKey="time_past" stroke={theme.palette.text.secondary} />

            <YAxis stroke={theme.palette.text.secondary} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="oxygen_level" stroke="#db2e2e" dot={false} />
            <Line type="monotone" dataKey="breathing_rate" stroke="#352ac9" dot={false} />
        </LineChart>


    );

}
