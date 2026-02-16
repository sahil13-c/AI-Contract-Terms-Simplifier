'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
    liability: '#ef4444',
    payment: '#f59e0b',
    intellectual_property: '#8b5cf6',
    termination: '#ec4899',
    confidentiality: '#3b82f6',
    indemnification: '#10b981',
};

const LABELS = {
    liability: 'Liability',
    payment: 'Payment',
    intellectual_property: 'IP Rights',
    termination: 'Termination',
    confidentiality: 'Confidentiality',
    indemnification: 'Indemnification',
};

export function RiskDistributionChart({ riskMetrics = [] }) {
    // Filter out zero scores and prepare data
    const data = riskMetrics
        .filter(metric => metric.score > 0)
        .map(metric => ({
            name: LABELS[metric.category] || metric.category,
            value: metric.score,
            category: metric.category,
        }));

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>No risk data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.category] || '#6366f1'} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value}%`, 'Risk Score']}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
