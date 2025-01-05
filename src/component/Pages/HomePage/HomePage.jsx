import { 
  Users, 
  Store,
  Package,
  Gavel,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors
);

const backendLink = "http://localhost:1234";

const HomePage = () => {
  const [stats, setStats] = useState({
    buyerCount: 0,
    sellerCount: 0,
    activeRfqCount: 0,
    endedRfqCount: 0,
  });
  const [sellerRegions, setSellerRegions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch basic stats
        const [buyerCount, sellerCount, activeRfqCount, endedRfqCount, sellersData] = await Promise.all([
          fetch(`${backendLink}/api/buyers/count`).then(res => res.json()),
          fetch(`${backendLink}/api/sellers/count`).then(res => res.json()),
          fetch(`${backendLink}/api/rfqs/count/active`).then(res => res.json()),
          fetch(`${backendLink}/api/rfqs/count/ended`).then(res => res.json()),
          fetch(`${backendLink}/api/sellers`).then(res => res.json()),
        ]);

        setStats({
          buyerCount: buyerCount.count || 0,
          sellerCount: sellerCount.count || 0,
          activeRfqCount: activeRfqCount.count || 0,
          endedRfqCount: endedRfqCount.count || 0,
        });

        // Process sellers data for region distribution
        const regions = sellersData.data.reduce((acc, seller) => {
          const region = seller.region || 'Unknown';
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        }, {});

        setSellerRegions(regions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: Object.keys(sellerRegions),
    datasets: [
      {
        data: Object.values(sellerRegions),
        backgroundColor: [
          '#4F46E5', // indigo
          '#7C3AED', // purple
          '#EC4899', // pink
          '#F59E0B', // amber
          '#10B981', // emerald
          '#3B82F6', // blue
          '#6366F1', // indigo
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-8 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Buyers Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 rounded-lg p-2">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Buyers</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{stats.buyerCount}</h3>
          </div>
        </div>

        {/* Sellers Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 rounded-lg p-2">
              <Store className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Sellers</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{stats.sellerCount}</h3>
          </div>
        </div>

        {/* Active RFQs Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 rounded-lg p-2">
              <Package className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Active RFQs</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeRfqCount}</h3>
          </div>
        </div>

        {/* Ended RFQs Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 rounded-lg p-2">
              <Gavel className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Ended RFQs</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{stats.endedRfqCount}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seller Region Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Seller Distribution by Region
            </h3>
            <div className="bg-purple-50 rounded-lg p-2">
              <Store className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="h-[300px]">
            {Object.keys(sellerRegions).length > 0 ? (
              <Pie data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No seller data available
              </div>
            )}
          </div>
        </div>

        {/* Additional chart or content can be added here */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Region Statistics
            </h3>
            <div className="bg-blue-50 rounded-lg p-2">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(sellerRegions).map(([region, count]) => (
              <div key={region} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: chartData.datasets[0].backgroundColor[
                         Object.keys(sellerRegions).indexOf(region)
                       ] }} 
                  />
                  <span className="text-sm font-medium text-gray-700">{region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                  <span className="text-xs text-gray-500">
                    ({((count / stats.sellerCount) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;