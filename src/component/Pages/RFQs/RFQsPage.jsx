import React, { useEffect, useState } from 'react';
// import StatusBadge from './components/StatusBadge';
import SearchAndFilters from './components/SearchAndFilters';
import RFQsList from './components/RFQsList';
import StatsHeader from './components/StatsHeader';
import QuotesSection from './components/QuotesSection';
import { LoadingState, EmptyState } from './components/LoadingAndEmptyStates';

const backendLink = "https://agricult-dashboard-new.onrender.com";

const RFQsPage = () => {
  const [loading, setLoading] = useState(true);
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [buyerDetails, setBuyerDetails] = useState({});
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const response = await fetch(`${backendLink}/api/rfqs`);
        const data = await response.json();
        const rfqsData = data.data || [];
        setRfqs(rfqsData);

        // Fetch buyer details for each RFQ
        const buyerPromises = rfqsData.map(rfq => 
          fetch(`${backendLink}/api/buyers/${rfq.buyer_id}`)
            .then(res => res.json())
            .then(data => ({ [rfq.buyer_id]: data.data }))
        );
        
        const buyersData = await Promise.all(buyerPromises);
        const buyersMap = buyersData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setBuyerDetails(buyersMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching RFQs:', error);
        setLoading(false);
      }
    };

    fetchRfqs();
  }, []);

  // Fetch quotes when an RFQ is selected
  useEffect(() => {
    const fetchQuotes = async () => {
      if (!selectedRfq) {
        setQuotes([]);
        return;
      }

      try {
        const response = await fetch(`${backendLink}/api/quotes/rfq/${selectedRfq.id}`);
        const data = await response.json();
        setQuotes(data.data || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        setQuotes([]);
      }
    };

    fetchQuotes();
  }, [selectedRfq]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleDateChange = (type, value) => {
    setDateRange(prev => ({ ...prev, [type]: value }));
  };

  const isWithinDateRange = (date) => {
    if (!dateRange.from && !dateRange.to) return true;
    
    const rfqDate = new Date(date);
    rfqDate.setHours(0, 0, 0, 0);
    
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      return rfqDate >= fromDate && rfqDate <= toDate;
    }
    
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      return rfqDate >= fromDate;
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      return rfqDate <= toDate;
    }
    
    return true;
  };

  const filteredRfqs = rfqs.filter(rfq => {
    // First apply status filter
    if (activeTab !== "all" && rfq.status !== activeTab) {
      return false;
    }

    // Apply date filter
    if (!isWithinDateRange(rfq.created_at)) {
      return false;
    }

    // Then apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const buyer = buyerDetails[rfq.buyer_id];
      const buyerBusinessName = buyer?.business_name?.toLowerCase() || '';
      
      return (
        rfq.id.toLowerCase().includes(query) ||
        rfq.grade?.toLowerCase().includes(query) ||
        rfq.quantity?.toString().startsWith(query) ||
        buyerBusinessName.includes(query) ||
        rfq.notes?.toLowerCase().includes(query) ||
        rfq.status?.toLowerCase().includes(query)
      );
    }

    return true;
  })
  // Sort by creation date in descending order (most recent first)
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // Optionally reset selected RFQ when searching
    if (selectedRfq && !value.trim().toLowerCase().includes(selectedRfq.id.toLowerCase())) {
      setSelectedRfq(null);
    }
  };

  const handleQuoteUpdate = async () => {
    // Refresh the quotes list
    if (selectedRfq) {
      const response = await fetch(`${backendLink}/api/quotes/rfq/${selectedRfq.id}`);
      const data = await response.json();
      setQuotes(data.data || []);
    }
  };

  const handleStatusUpdate = async (rfqId, newStatus) => {
    try {
      const response = await fetch(`${backendLink}/api/rfqs/${rfqId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update RFQ status');
      }

      const data = await response.json();
      
      // Update the local state to reflect the change
      setRfqs(prevRfqs => 
        prevRfqs.map(rfq => 
          rfq.id === rfqId ? { ...rfq, status: newStatus } : rfq
        )
      );

      // Show success message (you can implement your own notification system)
      console.log(`RFQ ${rfqId} status updated to ${newStatus}`);

    } catch (error) {
      console.error('Error updating RFQ status:', error);
      // Show error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <StatsHeader filteredRfqs={filteredRfqs} rfqs={rfqs} />

      <div className="mb-4">
        <SearchAndFilters 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          dateRange={dateRange}
          onDateChange={handleDateChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFQs List Section */}
        <main className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <LoadingState />
            ) : filteredRfqs.length > 0 ? (
              <RFQsList 
                rfqs={filteredRfqs} 
                selectedRfq={selectedRfq}
                setSelectedRfq={setSelectedRfq}
                formatDate={formatDate}
                buyerDetails={buyerDetails}
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchQuery ? (
                  <>
                    <p className="font-medium">No results found</p>
                    <p className="text-sm mt-1">
                      No RFQs match your search "{searchQuery}"
                    </p>
                  </>
                ) : (
                  <EmptyState />
                )}
              </div>
            )}
          </div>
        </main>

        {/* Quotes Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[calc(100vh-280px)] overflow-y-auto">
          <QuotesSection 
            selectedRfq={selectedRfq}
            quotes={quotes}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            onQuoteUpdate={handleQuoteUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default RFQsPage; 
