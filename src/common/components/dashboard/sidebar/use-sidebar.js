import { capitalizeFirstWord } from "@/common/utils/helper.utils";
import { setSidebarToggleItem } from "@/provider/features/auth/auth.slice";
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
          { label: "Profile Information", href: "/brand/profile" },
          { label: "Social Links", href: "/brand/social" },
          { label: "Niche Tags", href: "/brand/niches" },
        ],
      },
      {
        label: "Campaign Defaults",
        icon: Target,
        children: [
          { label: "Default Requirements", href: "/campaigns/defaults" },
          { label: "Payment Type", href: "/campaigns/payment" },
          { label: "Auto-Reply Template", href: "/campaigns/templates" },
          { label: "Brief Template", href: "/campaigns/briefs" },
        ],
      },
      {
        label: "Billing & Payments",
        icon: CreditCard,
        children: [
          { label: "Billing Methods", href: "/billing/methods" },
          { label: "Transaction History", href: "/billing/history" },
          { label: "Invoices & Receipts", href: "/billing/invoices" },
        ],
      },
      {
        label: "Privacy & Safety",
        icon: Shield,
        children: [
          { label: "Blocking & Restrictions", href: "/privacy/blocking" },
          { label: "Data Privacy", href: "/privacy/data" },
        ],
      },
      {
        label: "Communications",
        icon: Mail,
        children: [
          { label: "Email Preferences", href: "/communications/email" },
          { label: "Push Notifications", href: "/communications/push" },
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
          { label: "Collaboration Type", href: "/campaigns/collaboration" },
          { label: "Filter Settings", href: "/campaigns/filters" },
        ],
      },
      {
        label: "Payments",
        icon: CreditCard,
        children: [
          { label: "Payout Methods", href: "/payments/methods" },
          { label: "Payment History", href: "/payments/history" },
          { label: "Invoices & Receipts", href: "/payments/invoices" },
        ],
      },
      {
        label: "Privacy & Safety",
        icon: Shield,
        children: [
          { label: "Blocked Brands", href: "/privacy/blocked" },
          { label: "Data Privacy", href: "/privacy/data" },
        ],
      },
      {
        label: "Communications",
        icon: Mail,
        children: [{ label: "Email Preferences", href: "/communications/email" }],
      },
    ],
  },
];

function useSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { isCreatorMode, sidebarToggleItem } = useSelector(({ auth }) => auth);

  const [expandedSections, setExpandedSections] = useState({});
  const [activeItem, setActiveItem] = useState(sidebarToggleItem || "Dashboard");
  const navItems = isCreatorMode ? creatorNavItems : brandNavItems;

  useEffect(() => {
    setActiveItem(
      navItems?.map((item) => item.href === pathname)
        ? capitalizeFirstWord(pathname?.split("/")[1])
        : navItems?.[0]?.label
    );
  }, [pathname]);

  const toggleSection = (sectionPath) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionPath]: !prev[sectionPath],
    }));
  };

  const handleItemClick = ({ hasChildren, currentPath, href, label }) => {
    toggleSection(currentPath);
    href && router.push(href);
    label && dispatch(setSidebarToggleItem(label));
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
