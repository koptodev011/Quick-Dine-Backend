// controllers/dashboardController.js

export const getDashboardData = async (req, res) => {
  try {
    // Dummy data for graphs
    const dashboardData = {
      // Monthly Revenue Chart
      revenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [45000, 52000, 48000, 58000, 63000, 57000, 65000, 71000, 68000, 73000, 75000, 82000],
            borderColor: '#4CAF50',
            tension: 0.4
          }
        ]
      },

      // Daily Orders Chart
      orderData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Orders',
            data: [150, 230, 180, 290, 320, 350, 280],
            backgroundColor: '#2196F3',
            borderRadius: 8
          }
        ]
      },

      // Popular Items Pie Chart
      popularItems: {
        labels: ['Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert'],
        datasets: [
          {
            data: [35, 25, 20, 15, 5],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }
        ]
      },

      // Summary Cards
      summaryData: {
        totalRevenue: 687000,
        totalOrders: 1800,
        averageOrderValue: 382,
        customerSatisfaction: 4.5
      },

      // Recent Orders
      recentOrders: [
        { id: 1, customer: 'John Doe', items: 3, total: 450, status: 'Completed', time: '15 mins ago' },
        { id: 2, customer: 'Jane Smith', items: 2, total: 280, status: 'Processing', time: '30 mins ago' },
        { id: 3, customer: 'Mike Johnson', items: 4, total: 620, status: 'Completed', time: '45 mins ago' },
        { id: 4, customer: 'Sarah Wilson', items: 1, total: 150, status: 'Pending', time: '1 hour ago' },
        { id: 5, customer: 'Tom Brown', items: 3, total: 380, status: 'Completed', time: '2 hours ago' }
      ],

      // Peak Hours Data
      peakHoursData: {
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        datasets: [
          {
            label: 'Orders',
            data: [20, 45, 75, 55, 85, 40],
            borderColor: '#FF9800',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(255, 152, 0, 0.1)'
          }
        ]
      }
    };

    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      data: dashboardData
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ 
      message: "Error fetching dashboard data", 
      error: error.message 
    });
  }
};
