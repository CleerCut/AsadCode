"use client";

import { AlertCircle, Check, Edit2, Mail, Phone, Shield, Trash2 } from "lucide-react";

export default function ContactMethodCard({
  method,
  onEdit,
  onDeleteClick,
  onSetPrimary,
  onVerifyClick,
}) {
  const isPrimary = method.is_primary;
  const isVerified = method.is_verified;
  const isMainAccountEmail = method.is_main_account_email;

  return (
    <div
      className={`
      p-4 border rounded-lg transition-all duration-200
      ${isPrimary ? "border-indigo-200 bg-indigo-50" : "border-gray-200 bg-white"}
      hover:shadow-sm
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div
            className={`
            flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
            bg-blue-600}
          `}
          >
            {method.type === "email" ? (
              <Mail className={`h-4 w-4 text-blue-600`} />
            ) : (
              <Phone className="h-4 w-4 text-blue-600" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{method.value}</p>
            <div className="flex items-center space-x-2 mt-1">
              {isMainAccountEmail && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Account Email
                </span>
              )}
              {isPrimary && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Primary
                </span>
              )}
              {isVerified ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {!isVerified && !isMainAccountEmail && (
            <button
              onClick={() => onVerifyClick(method)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Verify
            </button>
          )}

          {!isPrimary && isVerified && !isMainAccountEmail && (
            <button
              onClick={() => onSetPrimary(method.id)}
              className="text-xs text-gray-600 hover:text-gray-800 font-medium"
            >
              Set Primary
            </button>
          )}

          {!isMainAccountEmail && (
            <button
              onClick={() => onEdit(method)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}

          {!isPrimary && !isMainAccountEmail && (
            <button
              onClick={() => onDeleteClick(method)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
