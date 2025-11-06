import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { isCreatorMode } from "@/common/utils/users.util";
import { Ban, Building2, Calendar, CheckCircle, Plus, Shield } from "lucide-react";
import useBlockedBrands from "./use-blocked-brands.hook";

// Columns and actions moved to hook

const BlockedBrandsPage = () => {
  const creatorMode = isCreatorMode();

  const {
    filteredData,
    stats,
    columns,
    actions,
    reasonOptions,
    getReasonColor,
    getStatusColor,
    searchTerm,
    showAddModal,
    selectedBlocks,
    filterReason,
    showDetailsModal,
    selectedBrand,
    form,
    setShowAddModal,
    setSelectedBlocks,
    setFilterReason,
    handleSearchChange,
    handleUnblock,
    handleSelectionChange,
    handleActionClick,
    onSubmit,
    handleBulkUnblockClick,
    handleCloseAddModal,
    openDetails,
    closeDetails,
  } = useBlockedBrands();

  const customCellRenderer = {
    brandName: (value, row) => (
      <div className="flex items-center">
        <div className="p-2 bg-gray-100 rounded-lg mr-3">
          <Building2 className="h-4 w-4 text-gray-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            {console.log(row)}
            {row.email}
          </div>
        </div>
      </div>
    ),
    reason: (value) => {
      const reasonLabel = reasonOptions.find((r) => r.value === value)?.label || value;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReasonColor(value)}`}
        >
          {reasonLabel}
        </span>
      );
    },
    dateBlocked: (value) => (
      <div className="flex items-center">
        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-900">{new Date(value).toLocaleDateString()}</span>
      </div>
    ),
    status: (value) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(value)}`}
      >
        {value.replace("_", " ")}
      </span>
    ),
    lastContactAttempt: (value) => (
      <div className="text-sm text-gray-900">
        {value ? (
          new Date(value).toLocaleDateString()
        ) : (
          <span className="text-gray-400 italic">None</span>
        )}
      </div>
    ),
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">
          {creatorMode ? "Blocked Brands" : "Blocked Creators"}
        </h1>
        <p className="text-sm mt-1">
          {`Manage ${creatorMode ? "brands" : "creators"} that are blocked from contacting or hiring you`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total */}
        <div className="bg-white rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-red-100 rounded">
                <Ban className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-sm text-gray-700 truncate">Total Blocked</span>
            </div>
            <span className="text-base font-semibold text-gray-900">{stats.total}</span>
          </div>
        </div>

        {/* Per-reason counts (generic and modifiable) */}
        {reasonOptions.map((r) => (
          <div key={r.value} className="bg-white rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1.5 rounded ${getReasonColor(r.value)}`}>
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-sm text-gray-700 truncate">{r.label}</span>
              </div>
              <span className="text-base font-semibold text-gray-900">
                {stats.reasonCounts?.[r.value] || 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border">
        {/* Header Actions */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Blocked {creatorMode ? "Brands" : "Creators"} List
            </h3>
            <div className="flex space-x-3">
              <div className="w-full min-w-[230px]">
                <SimpleSelect
                  placeHolder="Select a reason"
                  options={[{ value: "all", label: "All Reasons" }, ...reasonOptions]}
                  onChange={(selected) => {
                    const value = typeof selected === "object" ? selected.value : selected;
                    setFilterReason(value);
                  }}
                />
              </div>

              {selectedBlocks.length > 0 && filteredData.length > 0 ? (
                <CustomButton
                  text={`Unblock (${selectedBlocks.length})`}
                  className="btn-secondary"
                  icon={CheckCircle}
                  onClick={handleBulkUnblockClick}
                />
              ) : null}

              <CustomButton
                text={`Block ${creatorMode ? "Brands" : "Creators"}`}
                className="btn-primary w-full"
                icon={Plus}
                onClick={() => setShowAddModal(true)}
              />
            </div>
          </div>
        </div>

        {/* CustomDataTable */}
        <CustomDataTable
          columns={columns}
          data={filteredData}
          selectable={true}
          selectedIds={selectedBlocks}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSelectionChange={handleSelectionChange}
          actions={actions}
          onActionClick={handleActionClick}
          customCellRenderer={customCellRenderer}
          emptyMessage={`No blocked ${creatorMode ? "brands" : "creators"} found. ${creatorMode ? "Brands" : "Creators"} you block will appear here.`}
          searchPlaceholder={`Search blocked ${creatorMode ? "brands" : "creators"}`}
        />
      </div>

      <Modal
        show={showAddModal}
        title={`Block New ${creatorMode ? "Brand" : "Creator"}`}
        onClose={handleCloseAddModal}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomInput
            label="Email"
            name="email"
            type="email"
            register={form.register}
            errors={form.formState.errors}
            placeholder="Enter email to block"
            required
          />

          <CustomInput
            label="Brand Name"
            name="brand_name"
            type="text"
            register={form.register}
            errors={form.formState.errors}
            placeholder="Enter brand name"
            required
          />

          <SimpleSelect
            label="Reason for Blocking"
            placeHolder="Select an option"
            options={reasonOptions}
            onChange={(selected) => {
              const value = typeof selected === "object" ? selected.value : selected;
              form.setValue("reason", value, { shouldValidate: true });
            }}
          />
          {form.formState.errors.reason && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.reason.message}</p>
          )}

          <CustomInput
            label="Notes (Optional)"
            name="notes"
            type="text"
            register={form.register}
            errors={form.formState.errors}
            placeholder="Additional notes"
          />

          <div className="flex space-x-3 pt-4">
            <CustomButton
              text="Cancel"
              type="button"
              className="btn-secondary flex-1"
              onClick={handleCloseAddModal}
            />
            <CustomButton
              text={`Block ${creatorMode ? "Brand" : "Creator"}`}
              type="submit"
              className="btn-primary flex-1"
              icon={Ban}
              disabled={
                !form.watch("email") ||
                !form.watch("brand_name") ||
                !form.watch("reason") ||
                form.formState.isSubmitting
              }
            />
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        show={showDetailsModal}
        title={selectedBrand ? selectedBrand.brandName : "Brand Details"}
        onClose={closeDetails}
      >
        {selectedBrand && (
          <div className="space-y-4">
            {/* Header with icon and badges inline */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="p-1.5 rounded bg-indigo-100">
                <Building2 className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {selectedBrand.brandName}
                </div>
                <a
                  href={`mailto:${selectedBrand.email}`}
                  className="text-xs text-indigo-600 hover:text-indigo-700 truncate block"
                >
                  {selectedBrand.email}
                </a>
              </div>
              <div className="flex gap-1.5">
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getReasonColor(selectedBrand.reason)}`}
                >
                  {reasonOptions.find((r) => r.value === selectedBrand.reason)?.label ||
                    selectedBrand.reason}
                </span>
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded capitalize ${getStatusColor(selectedBrand.status)}`}
                >
                  {selectedBrand.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Details - compact list */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Date Blocked</span>
                <span className="text-gray-900 font-medium">
                  {new Date(selectedBrand.dateBlocked).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Last Contact Attempt</span>
                <span className="text-gray-900 font-medium">
                  {selectedBrand.lastContactAttempt ? (
                    new Date(selectedBrand.lastContactAttempt).toLocaleDateString()
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedBrand.notes && (
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1.5">Notes</div>
                <div className="text-xs text-gray-900 leading-relaxed">{selectedBrand.notes}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <CustomButton text="Close" className="btn-cancel flex-1" onClick={closeDetails} />
              <CustomButton
                text="Unblock"
                className="btn-primary flex-1"
                icon={CheckCircle}
                onClick={() => {
                  handleUnblock(selectedBrand.email);
                  closeDetails();
                }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">How Blocking Works</h3>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>
                • Blocked {creatorMode ? "brands" : "creators"} cannot send you campaign invitations
                or direct messages
              </p>
              <p>• Your profile will not appear in their search results</p>
              <p>
                • Existing contracts with blocked {creatorMode ? "brands" : "creators"} remain valid
                until completion
              </p>
              <p>• You can unblock {creatorMode ? "brands" : "creators"} at any time</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlockedBrandsPage;
