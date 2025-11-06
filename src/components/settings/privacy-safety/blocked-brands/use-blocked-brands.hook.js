import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getBlockedBrands,
  blockBrand,
  unblockBrand,
  reset as usersReset,
} from "@/provider/features/users/users.slice";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  brand_name: yup.string().required("Brand name is required"),
  reason: yup.string().required("Reason is required"),
  notes: yup.string(),
});

const reasonOptions = [
  { value: "inappropriate_content", label: "Inappropriate Content" },
  { value: "payment_issues", label: "Payment Issues" },
  { value: "spam_harassment", label: "Spam/Harassment" },
  { value: "poor_communication", label: "Poor Communication" },
  { value: "unethical_practices", label: "Unethical Practices" },
  { value: "other", label: "Other" },
];

const getReasonColor = (reason) => {
  switch (reason) {
    case "inappropriate_content":
      return "bg-red-100 text-red-800";
    case "payment_issues":
      return "bg-orange-100 text-orange-800";
    case "spam_harassment":
      return "bg-purple-100 text-purple-800";
    case "poor_communication":
      return "bg-yellow-100 text-yellow-800";
    case "unethical_practices":
      return "bg-gray-100 text-gray-800";
    case "other":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-red-100 text-red-800";
    case "pending_review":
      return "bg-yellow-100 text-yellow-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Static table column definitions
const columns = [
  {
    key: "brandName",
    title: "Brand Name",
  },
  {
    key: "reason",
    title: "Reason",
  },
  {
    key: "dateBlocked",
    title: "Date Blocked",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "lastContactAttempt",
    title: "Last Contact Attempt",
  },
];

// Row actions for data table
const actions = [
  {
    key: "view",
    label: "View Details",
    icon: <Eye size={16} />,
  },
  {
    key: "unblock",
    label: "Unblock Brand",
    icon: <CheckCircle size={16} />,
  },
];

export default function useBlockedBrands() {
  const dispatch = useDispatch();
  const {
    getBlockedBrands: getState,
    blockBrand: blockState,
    unblockBrand: unblockState,
  } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [filterReason, setFilterReason] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      brand_name: "",
      reason: "",
      notes: "",
    },
  });

  useEffect(() => {
    dispatch(getBlockedBrands());
    return () => {
      dispatch(usersReset());
    };
  }, [dispatch]);

  const blockedBrandsList = getState?.data?.data || [];

  const mappedBlockedBrands = useMemo(() => {
    return (blockedBrandsList || []).map((brand) => ({
      id: brand.id,
      brandName: brand.brand_name,
      email: brand.email,
      reason: brand.reason,
      dateBlocked: brand.created_at,
      blockedBy: "user",
      status: brand.status,
      lastContactAttempt: brand.last_contact_attempt,
      notes: brand.notes,
    }));
  }, [blockedBrandsList]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleAddBrand = useCallback(
    async (brandData) => {
      await dispatch(blockBrand(brandData)).unwrap();
      setShowAddModal(false);
      dispatch(getBlockedBrands()); // Refresh list
    },
    [dispatch]
  );

  const handleUnblock = useCallback(
    async (email) => {
      await dispatch(unblockBrand({ email })).unwrap();
      dispatch(getBlockedBrands()); // Refresh list
    },
    [dispatch]
  );

  const handleBulkUnblock = useCallback(
    async (emails) => {
      for (const email of emails) {
        await handleUnblock(email);
      }
    },
    [handleUnblock]
  );

  // Define details modal handlers before any usage in dependencies
  const openDetails = useCallback((brand) => {
    setSelectedBrand(brand);
    setShowDetailsModal(true);
  }, []);

  const closeDetails = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedBrand(null);
  }, []);

  const handleSelectionChange = useCallback((selectedIds) => {
    setSelectedBlocks(selectedIds);
  }, []);

  const handleActionClick = useCallback(
    (actionKey, row) => {
      switch (actionKey) {
        case "view":
          openDetails(row);
          break;
        case "unblock":
          handleUnblock(row.email);
          break;
        case "delete":
          handleUnblock(row.email);
          break;
        default:
          break;
      }
    },
    [openDetails, handleUnblock]
  );

  const onSubmit = useCallback(
    async (data) => {
      await handleAddBrand({
        email: data.email,
        brand_name: data.brand_name,
        reason: data.reason,
        notes: data.notes,
      });
      form.reset();
    },
    [handleAddBrand, form]
  );

  const handleBulkUnblockClick = useCallback(() => {
    const emailsToUnblock = mappedBlockedBrands
      .filter((b) => selectedBlocks.includes(b.id))
      .map((b) => b.email)
      .filter(Boolean);
    handleBulkUnblock(emailsToUnblock);
  }, [mappedBlockedBrands, selectedBlocks, handleBulkUnblock]);

  const filteredData = useMemo(() => {
    return mappedBlockedBrands.filter((brand) => {
      const matchesSearch = brand.brandName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesReason = filterReason === "all" || brand.reason === filterReason;
      return matchesSearch && matchesReason;
    });
  }, [mappedBlockedBrands, searchTerm, filterReason]);

  const stats = useMemo(() => {
    const total = mappedBlockedBrands.length;
    const reasonCounts = mappedBlockedBrands.reduce((acc, b) => {
      acc[b.reason] = (acc[b.reason] || 0) + 1;
      return acc;
    }, {});

    return { total, reasonCounts };
  }, [mappedBlockedBrands]);

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
    form.reset();
  }, [form]);

  return {
    // Data
    filteredData,
    mappedBlockedBrands,
    stats,
    columns,
    actions,
    reasonOptions,
    getReasonColor,
    getStatusColor,
    // State
    searchTerm,
    showAddModal,
    selectedBlocks,
    filterReason,
    showDetailsModal,
    selectedBrand,
    isLoading: getState?.isLoading || blockState?.isLoading || unblockState?.isLoading,
    // Form
    form,
    // Setters
    setShowAddModal,
    setSelectedBlocks,
    setFilterReason,
    // Handlers
    handleSearchChange,
    handleAddBrand,
    handleUnblock,
    handleBulkUnblock,
    handleSelectionChange,
    handleActionClick,
    onSubmit,
    handleBulkUnblockClick,
    handleCloseAddModal,
    openDetails,
    closeDetails,
  };
}
