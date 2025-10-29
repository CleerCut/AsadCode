import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBlockedBrands,
  blockBrand,
  unblockBrand,
  reset as usersReset,
} from "@/provider/features/users/users.slice";

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

  useEffect(() => {
    dispatch(getBlockedBrands());
    return () => {
      dispatch(usersReset());
    };
  }, [dispatch]);

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
      // TODO: Implement bulk unblock API if needed
      console.log("Bulk unblock:", emails);
      for (const email of emails) {
        await handleUnblock(email);
      }
    },
    [handleUnblock]
  );

  const blockedBrandsList = getState?.data?.data || [];

  return {
    blockedBrands: blockedBrandsList,
    searchTerm,
    showAddModal,
    selectedBlocks,
    filterReason,
    isLoading: getState?.isLoading || blockState?.isLoading || unblockState?.isLoading,
    setSearchTerm,
    setShowAddModal,
    setSelectedBlocks,
    setFilterReason,
    handleSearchChange,
    handleAddBrand,
    handleUnblock,
    handleBulkUnblock,
  };
}
