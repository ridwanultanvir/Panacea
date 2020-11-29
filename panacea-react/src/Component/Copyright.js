import React from 'react';
import { Typography, Link } from '@material-ui/core';

export default function CopyRight() {
    return (
        <div style={{ margin: 70 }}>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://sadatshahriyar.pythonanywhere.com/">
                    Sadat Shahriyar
                </Link>{' '}
                {'& Jayanta Sadhu. '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </div>
    );
}