import { capitalizeFirstWord } from "@/common/utils/helper.utils";
import { expandedSidebarSections, setSidebarActiveItem } from "@/provider/features/auth/auth.slice";
import {
  Bell,
  Briefcase,
  CreditCard,
  LayoutDashboard,
  Mail,
  Settings,
  Shield,
  Target,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const commonNavItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: true,
    href: "/dashboard",
  },
  {
    label: "Notifications",
    icon: Bell,
    isActive: false,
    href: "/notifications",
  },
];

// Define nav items for Brand users
const brandNavItems = [
  ...commonNavItems,
  {
    label: "Settings",
    icon: Settings,
    isActive: false,
    children: [
      {
        label: "Account Settings",
        icon: User,
        children: [
          {
            label: "Personal Information",
            href: "/settings/account-settings/personal-information",
          },
          { label: "Security Settings", href: "/settings/account-settings/security-settings" },
          { label: "Email & Phone", href: "/settings/account-settings/email-phone" },
        ],
      },
      {
        label: "Brand Profile",
        icon: Briefcase,
        children: [
          { label: "Profile Information", href: "/settings/brand-profile/profile-information" },
          { label: "Social Links", href: "/settings/brand-profile/social-links" },
          { label: "Niche Tags", href: "/settings/brand-profile/niche-tags" },
        ],
      },
      {
        label: "Campaign Defaults",
        icon: Target,
        children: [
          {
            label: "Default Requirements",
            href: "/settings/campaign-defaults/default-campaign-requirement",
          },
          { label: "Payment Type", href: "/settings/campaign-defaults/preffered-payment-type" },
          { label: "Auto-Reply Template", href: "/settings/campaign-defaults/auto-reply-template" },
          { label: "Brief Template", href: "/settings/campaign-defaults/breif-template" },
        ],
      },
      {
        label: "Billing & Payments",
        icon: CreditCard,
        children: [
          { label: "Billing Methods", href: "/settings/payments/payout-methods" },
          { label: "Transaction History", href: "/settings/payments/payment-history" },
          { label: "Invoices & Receipts", href: "/settings/payments/invoice-receipt" },
        ],
      },
      {
        label: "Privacy & Safety",
        icon: Shield,
        children: [
          { label: "Blocking & Restrictions", href: "/settings/privacy-safety/blocked-brands" },
          { label: "Data Privacy", href: "/settings/privacy-safety/data-privacy" },
        ],
      },
      {
        label: "Communications",
        icon: Mail,
        children: [
          { label: "Email Preferences", href: "/settings/communications/email-preferrence" },
          // { label: "Push Notifications", href: "/" },
        ],
      },
    ],
  },
];

// Define nav items for Creator users
const creatorNavItems = [
  ...commonNavItems,
  {
    label: "Settings",
    icon: Settings,
    isActive: false,
    children: [
      {
        label: "Account Settings",
        icon: User,
        children: [
          {
            label: "Personal Information",
            href: "/settings/account-settings/personal-information",
          },
          { label: "Security Settings", href: "/settings/account-settings/security-settings" },
          { label: "Email & Phone", href: "/settings/account-settings/email-phone" },
        ],
      },
      {
        label: "Campaign Defaults",
        icon: Target,
        children: [
          {
            label: "Preferred Collaboration Type",
            href: "/settings/campaign-defaults/preferred-collaboration-type",
          },
          {
            label: "Saved Filter Settings",
            href: "/settings/campaign-defaults/saved-default-filter",
          },
        ],
      },
      {
        label: "Payments",
        icon: CreditCard,
        children: [
          { label: "Payout Methods", href: "/settings/payments/payout-methods" },
          { label: "Payment History", href: "/settings/payments/payment-history" },
          { label: "Invoices & Receipts", href: "/settings/payments/invoice-receipt" },
        ],
      },
      {
        label: "Privacy & Safety",
        icon: Shield,
        children: [
          { label: "Blocked Brands", href: "/settings/privacy-safety/blocked-brands" },
          { label: "Data Privacy", href: "/settings/privacy-safety/data-privacy" },
        ],
      },
      {
        label: "Communications",
        icon: Mail,
        children: [
          { label: "Email Preferences", href: "/settings/communications/email-preferrence" },
        ],
      },
    ],
  },
];

function useSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { isCreatorMode, sidebarActiveItem, sidebarSections } = useSelector(({ auth }) => auth);

  const [expandedSections, setExpandedSections] = useState(sidebarSections || {});
  const [activeItem, setActiveItem] = useState(sidebarActiveItem || "Dashboard");
  const navItems = isCreatorMode ? creatorNavItems : brandNavItems;

  useEffect(() => {
    setActiveItem(
      navItems?.map((item) => item.href === pathname)
        ? capitalizeFirstWord(pathname?.split("/")[1])
        : navItems?.[0]?.label
    );
    setExpandedSections(sidebarSections);
    setActiveItem(sidebarActiveItem);
  }, [pathname]);

  const toggleSection = (sectionPath) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionPath]: !prev[sectionPath],
    }));
    dispatch(expandedSidebarSections(expandedSections));
  };

  const handleItemClick = ({ hasChildren, currentPath, href, label }) => {
    toggleSection(currentPath);
    href && router.push(href);
    label && dispatch(setSidebarActiveItem(label));
    setActiveItem(label);
  };

  return {
    expandedSections,
    activeItem,
    navItems,
    handleItemClick,
  };
}

export default useSidebar;
