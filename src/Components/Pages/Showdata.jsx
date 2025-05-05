

import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import TasksPage from './TasksPage';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Showdata({ activeMenu, isDarkMode, recentActivities, filteredData, phonesearch , memoizedTotalOut , totalRecoverAmount }) {


    const data = {
        labels: ['Total Recovered Amount', 'Total Assign Amount'],
        datasets: [
            {
                data: [memoizedTotalOut,totalRecoverAmount ],
                backgroundColor: ['#4CAF50', '#FF9800'], 
                borderWidth: 0, 
            },
        ],
    };


    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        if (tooltipItem.dataIndex === 0) {
                            return `Total Recovered Amount: ${tooltipItem.raw}`;
                        }
                        return `Total Assign Amount: ${tooltipItem.raw}`;
                    },
                },
               
            },
            
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div>

            <div>
                {activeMenu === "dashboard" ? (
                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className={`lg:col-span-1 p-6 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                    Recent Activities
                                </h2>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className={`p-4 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                                        >
                                            <p className="font-medium">{activity.title}</p>
                                            <p className="text-sm mt-1 opacity-75">{activity.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                           
                            
                            <div className="lg:col-span-2 p-6 rounded-xl shadow-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
                                <div className="h-64 bg-white/10 rounded-lg p-4">
                                   
                                    <div className="flex items-center justify-center h-full ">
                                      
                                        
                                        <Doughnut data={data} options={options} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeMenu === "Clients" ? (
                    <div>
                        <h1>Clients Section</h1>
                    </div>
                ) : activeMenu === "Projects" ? (
                    <div>
                        <h1>Project Section</h1>
                    </div>
                ) : activeMenu === "tasks" ? (
                    <div>
                        <TasksPage filteredData={filteredData} isDarkMode={isDarkMode} phonesearch={phonesearch} />
                    </div>
                ) : activeMenu === "Analytics" ? (
                    <div>
                        <h1>Analytics Section</h1>
                    </div>
                ) : activeMenu === "Settings" ? (
                    <div>
                        <h1>Settings Section</h1>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Showdata;




















//  <div className={`lg:col-span-1 p-6 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
//                     <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
//                         Recent Activities
//                     </h2>
//                     <div className="space-y-4">
//                         {recentActivities.map((activity) => (
//                             <div
//                                 key={activity.id}
//                                 className={`p-4 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
//                             >
//                                 <p className="font-medium">{activity.title}</p>
//                                 <p className="text-sm mt-1 opacity-75">{activity.time}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div> 