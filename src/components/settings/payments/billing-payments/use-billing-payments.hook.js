import { useState, useMemo, useCallback } from "react";

// Mock Stripe charge data - simulating what we'd get from Stripe API
const generateMockCharges = () => {
  return [
    {
      id: "ch_3QxYz1AbCdEfGhIj1",
      created: 1705276800, // Jan 14, 2026 timestamp
      amount: 500000, // $5000.00 in cents
      currency: "usd",
      receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xS0pKQk1BQkNEZWZnaGlqMRoA",
      description: "Campaign escrow payment",
      payment_method_details: {
        card: {
          last4: "4242",
          brand: "visa",
        },
      },
      metadata: {
        type: "escrow",
        campaign_id: "123456",
        brand_id: "78910",
      },
      campaign_name: "Summer Fashion Campaign 2026",
    },
    {
      id: "ch_3QxYz2BcDeFgHiJk2",
      created: 1705190400, // Jan 13, 2026
      amount: 15000, // $150.00 in cents
      currency: "usd",
      receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xS0pKQk1BQkNEZWZnaGlqMRoB",
      description: "Platform fee",
      payment_method_details: {
        card: {
          last4: "4242",
          brand: "visa",
        },
      },
      metadata: {
        type: "platform_fee",
        campaign_id: "123456",
        brand_id: "78910",
      },
      campaign_name: "Summer Fashion Campaign 2026",
    },
    {
      id: "ch_3QxYz3CdEfGhIjKl3",
      created: 1705104000, // Jan 12, 2026
      amount: 250000, // $2500.00 in cents
      currency: "usd",
      receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xS0pKQk1BQkNEZWZnaGlqMRoC",
      description: "Individual creator hire",
      payment_method_details: {
        card: {
          last4: "5555",
          brand: "mastercard",
        },
      },
      metadata: {
        type: "individual_hire",
        creator_id: "4444",
        brand_id: "78910",
      },
      creator_name: "Sarah Johnson",
    },
    {
      id: "ch_3QxYz4DeFgHiJkLm4",
      created: 1705017600, // Jan 11, 2026
      amount: 1000000, // $10000.00 in cents
      currency: "usd",
      receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xS0pKQk1BQkNEZWZnaGlqMRoD",
      description: "Campaign escrow payment",
      payment_method_details: {
        card: {
          last4: "1234",
          brand: "amex",
        },
      },
      metadata: {
        type: "escrow",
        campaign_id: "789012",
        brand_id: "78910",
      },
      campaign_name: "Tech Product Launch Q1",
    },
    {
      id: "ch_3QxYz5EfGhIjKlMn5",
      created: 1704931200, // Jan 10, 2026
      amount: 30000, // $300.00 in cents
      currency: "usd",
      receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xS0pKQk1BQkNEZWZnaGlqMRoE",
      description: "Platform fee",
      payment_method_details: {
        card: {
          last4: "1234",
          brand: "amex",
        },
      },
      metadata: {
        type: "platform_fee",
        campaign_id: "789012",
        brand_id: "78910",
      },
      campaign_name: "Tech Product Launch Q1",
    },
    {
      id: "ch_3QxYz6FgHiJkLmNo6",
      created: 1704844800, // Jan 9, 2026
      amount: 75000, // $750.00 in cents
      currency: "usd",
      receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xS0pKQk1BQkNEZWZnaGlqMRoF",
      description: "Individual creator hire",
      payment_method_details: {
        card: {
          last4: "8888",
          brand: "visa",
        },
      },
      metadata: {
        type: "individual_hire",
        creator_id: "5555",
        brand_id: "78910",
      },
      creator_name: "Mike Chen",
    },
    {
      id: "ch_3QxYz7GhIjKlMnOp7",
      created: 1704758400, // Jan 8, 2026
      amount: 200000, // $2000.00 in cents
      currency: "usd",
      receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xS0pKQk1BQkNEZWZnaGlqMRoG",
      description: "Campaign escrow payment",
      payment_method_details: {
        card: {
          last4: "9999",
          brand: "mastercard",
        },
      },
      metadata: {
        type: "escrow",
        campaign_id: "345678",
        brand_id: "78910",
      },
      campaign_name: "Holiday Marketing Campaign",
    },
    {
      id: "ch_3QxYz8HiJkLmNoPq8",
      created: 1704672000, // Jan 7, 2026
      amount: 50000, // $500.00 in cents
      currency: "usd",
      receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xS0pKQk1BQkNEZWZnaGlqMRoH",
      description: "Platform fee",
      payment_method_details: {
        card: {
          last4: "9999",
          brand: "mastercard",
        },
      },
      metadata: {
        type: "platform_fee",
        campaign_id: "345678",
        brand_id: "78910",
      },
      campaign_name: "Holiday Marketing Campaign",
    },
  ];
};

const useBillingPayments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real implementation, this would come from API
  const allCharges = useMemo(() => generateMockCharges(), []);

  // Format date from Unix timestamp
  const formatDate = useCallback((timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Convert cents to dollars
  const formatAmount = useCallback((amount, currency = "usd") => {
    const dollars = amount / 100;
    const currencySymbol = currency === "usd" ? "$" : currency.toUpperCase();
    return `${currencySymbol}${dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, []);

  // Format payment method
  const formatPaymentMethod = useCallback((paymentMethodDetails) => {
    if (!paymentMethodDetails?.card) {
      return "Payment method unavailable";
    }
    const { last4, brand } = paymentMethodDetails.card;
    const brandName = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "Card";
    return `Card ending in ${last4} (${brandName})`;
  }, []);

  // Get campaign/collaboration label based on metadata
  const getCampaignLabel = useCallback((charge) => {
    const metadata = charge.metadata || {};
    const type = metadata.type;

    switch (type) {
      case "escrow":
        return {
          label: charge.campaign_name || "Campaign",
          link: `/campaign/${metadata.campaign_id}`,
        };
      case "individual_hire":
        return {
          label: `Individual Hire – ${charge.creator_name || "Creator"}`,
          link: null,
        };
      case "platform_fee":
        return {
          label: `CleerCut Platform Fee – ${charge.campaign_name || "Campaign"}`,
          link: `/campaign/${metadata.campaign_id}`,
        };
      default:
        return {
          label: "CleerCut Payment – Unassigned",
          link: null,
        };
    }
  }, []);

  // Get payment type label
  const getPaymentType = useCallback((charge) => {
    const metadata = charge.metadata || {};
    const type = metadata.type;

    switch (type) {
      case "escrow":
        return "Escrow Payment";
      case "individual_hire":
        return "Individual Creator Hire";
      case "platform_fee":
        return "Platform Fee";
      default:
        return "Payment";
    }
  }, []);

  // Filter charges based on search term
  const filteredCharges = useMemo(() => {
    if (!searchTerm.trim()) {
      return allCharges;
    }

    const searchLower = searchTerm.toLowerCase();
    return allCharges.filter((charge) => {
      const campaignLabel = getCampaignLabel(charge);
      const paymentType = getPaymentType(charge);
      const amount = formatAmount(charge.amount, charge.currency);
      const paymentMethod = formatPaymentMethod(charge.payment_method_details);

      return (
        campaignLabel.label.toLowerCase().includes(searchLower) ||
        paymentType.toLowerCase().includes(searchLower) ||
        amount.toLowerCase().includes(searchLower) ||
        paymentMethod.toLowerCase().includes(searchLower)
      );
    });
  }, [allCharges, searchTerm, getCampaignLabel, getPaymentType, formatAmount, formatPaymentMethod]);

  // Paginate charges
  const paginatedCharges = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCharges.slice(startIndex, endIndex);
  }, [filteredCharges, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredCharges.length / itemsPerPage);
  }, [filteredCharges.length, itemsPerPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  return {
    charges: paginatedCharges,
    allCharges: filteredCharges,
    currentPage,
    totalPages,
    itemsPerPage,
    searchTerm,
    formatDate,
    formatAmount,
    formatPaymentMethod,
    getCampaignLabel,
    getPaymentType,
    handlePageChange,
    handleSearchChange,
  };
};

export default useBillingPayments;
