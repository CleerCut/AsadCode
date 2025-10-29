"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { AlertCircle, Mail, Phone, Plus } from "lucide-react";
import ContactMethodCard from "./components/contract-method.component";
import useEmailPhone from "./use-email-phone.hook";

export default function ContactMethodsPage() {
  const {
    emailMethods,
    phoneMethods,
    showEmailForm,
    showPhoneForm,
    editingMethod,
    showVerifyModal,
    methodToVerify,
    verificationCode,
    showDeleteModal,
    methodToDelete,
    emailForm,
    phoneForm,
    onSubmitAddEmail,
    onSubmitAddPhone,
    handleVerifyClick,
    handleVerifySubmit,
    handleCancelVerify,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleEdit,
    handleSetPrimary,
    handleOpenAddEmailForm,
    handleOpenAddPhoneForm,
    handleCloseEmailForm,
    handleClosePhoneForm,
    onUpdate,
    onSetPrimary,
    setVerificationCode,
  } = useEmailPhone();

  return (
    <DashboardLayout>
      {/* Verification Code Modal */}
      <ConfirmationDialog
        show={showVerifyModal}
        onClose={handleCancelVerify}
        onConfirm={handleVerifySubmit}
        message="Enter Verification Code"
        content={
          <div className="space-y-4">
            <div className="text-sm text-gray-600 text-left">
              Enter the verification code sent to <strong>{methodToVerify?.value}</strong>
            </div>
            <CustomInput
              label="Verification Code"
              name="code"
              type="text"
              placeholder="Enter code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              isRequired={true}
            />
          </div>
        }
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        show={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Delete Contact Method"
        content={
          <div className="text-sm text-gray-600 text-center">
            Are you sure you want to remove <strong>{methodToDelete?.value}</strong>? This action
            cannot be undone.
          </div>
        }
      />
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Email & Phone Numbers</h1>
        <p className="text-sm mt-1">Add or remove contact methods for your account </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between gap-6">
          {/* Email Addresses Section */}
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Email Addresses</h2>
                </div>

                <CustomButton
                  text="Add Email"
                  className="btn-primary"
                  icon={Plus}
                  onClick={handleOpenAddEmailForm}
                />
              </div>

              {/* Email List */}
              <div className="space-y-3 mb-6">
                {emailMethods.map((email) => (
                  <ContactMethodCard
                    key={email.id}
                    method={email}
                    onEdit={handleEdit}
                    onDeleteClick={handleDelete}
                    onSetPrimary={(id) => handleSetPrimary(id, "email")}
                    onVerifyClick={handleVerifyClick}
                  />
                ))}
              </div>

              {/* Add Email Form */}
              {showEmailForm && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    {editingMethod ? "Edit Email Address" : "Add New Email Address"}
                  </h3>
                  <form onSubmit={emailForm.handleSubmit(onSubmitAddEmail)} className="space-y-4">
                    <div className="max-w-md">
                      <CustomInput
                        label="Email Address"
                        name="email"
                        type="email"
                        register={emailForm.register}
                        errors={emailForm.formState.errors}
                        placeholder="Enter email address"
                        isRequired={true}
                        icon={Mail}
                      />
                    </div>

                    <div className="flex space-x-3">
                      {editingMethod ? (
                        <CustomButton
                          text="Update"
                          className="btn-primary"
                          onClick={emailForm.handleSubmit((data) =>
                            onUpdate({ id: editingMethod.id, email: data.email })
                          )}
                          disabled={emailForm.formState.isSubmitting}
                        />
                      ) : (
                        <CustomButton
                          text="Add Email"
                          className="btn-primary"
                          type="submit"
                          disabled={emailForm.formState.isSubmitting}
                        />
                      )}
                      <CustomButton
                        text="Cancel"
                        className="btn-secondary"
                        onClick={handleCloseEmailForm}
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Phone Numbers Section */}
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Phone Numbers</h2>
                </div>

                <CustomButton
                  text="Add Phone"
                  className="btn-primary"
                  icon={Plus}
                  onClick={handleOpenAddPhoneForm}
                />
              </div>

              {/* Phone List */}
              <div className="space-y-3 mb-6">
                {phoneMethods.map((phone) => (
                  <ContactMethodCard
                    key={phone.id}
                    method={phone}
                    onEdit={handleEdit}
                    onDeleteClick={handleDelete}
                    onSetPrimary={(id) => handleSetPrimary(id, "phone")}
                    onVerifyClick={handleVerifyClick}
                  />
                ))}
              </div>

              {/* Add Phone Form */}
              {showPhoneForm && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    {editingMethod ? "Edit Phone Number" : "Add New Phone Number"}
                  </h3>
                  <form onSubmit={phoneForm.handleSubmit(onSubmitAddPhone)} className="space-y-4">
                    <div className="max-w-md">
                      <CustomInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        register={phoneForm.register}
                        errors={phoneForm.formState.errors}
                        placeholder="Enter phone number"
                        isRequired={true}
                        icon={Phone}
                      />
                    </div>

                    <div className="flex space-x-3">
                      {editingMethod ? (
                        <CustomButton
                          text="Update"
                          className="btn-primary"
                          onClick={phoneForm.handleSubmit((data) =>
                            onUpdate({ id: editingMethod.id, phone: data.phone })
                          )}
                          disabled={phoneForm.formState.isSubmitting}
                        />
                      ) : (
                        <CustomButton
                          text="Add Phone"
                          className="btn-primary"
                          type="submit"
                          disabled={phoneForm.formState.isSubmitting}
                        />
                      )}
                      <CustomButton
                        text="Cancel"
                        className="btn-secondary"
                        onClick={handleClosePhoneForm}
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mr-3 flex-shrink-0">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Important Security Information
              </h3>
              <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                <li>• We'll send verification codes to new contact methods</li>
                <li>
                  • Primary contacts are used for account recovery and important notifications
                </li>
                <li>• You must have at least one verified contact method</li>
                <li>• Unverified contact methods will be automatically removed after 7 days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
