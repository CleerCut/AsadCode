"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import DemoCampaignBanner from "@/common/components/demo-campaign-banner/demo-campaign-banner.component";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import { CAMPAIGN_TYPE_MAP, HIDE_CREATOR_RATING_UI } from "@/common/utils/campaign.utils";
import { Download } from "lucide-react";
import useCompletedCampaignReport from "./use-completed-campaign-report.hook";

function CreatorCell({ name, avatarUrl }) {
  const initial = String(name || "C").trim().charAt(0).toUpperCase() || "C";
  return (
    <span className="inline-flex items-center gap-2.5">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full border border-[#E5E4DF] object-cover object-top"
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E4DF] bg-[#DCE4EC] text-[11px] font-semibold text-[#16273F]">
          {initial}
        </span>
      )}
      <span className="font-medium text-[#16273F]">{name || "Creator"}</span>
    </span>
  );
}

function MetricCard({ label, value, underline, subtitle }) {
  return (
    <div
      className={`rounded-xl border border-[#E8E6E1] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(22,39,63,0.04)] ${
        underline ? "border-b-[3px] border-b-primary" : ""
      }`}
    >
      <p className="text-[11px] font-medium text-[#8A8985]">{label}</p>
      <p
        className="mt-1.5 text-2xl font-bold tracking-tight text-[#16273F]"
        title={value === "—" ? "Unavailable" : undefined}
      >
        {value}
      </p>
      {subtitle ? <p className="mt-1 text-[11px] text-[#8A8985]">{subtitle}</p> : null}
    </div>
  );
}

function AudienceBarRow({ label, value, barClassName = "bg-primary" }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[12.5px]">
        <span className="truncate text-[#5A5955]">{label}</span>
        <span className="shrink-0 font-semibold tabular-nums text-[#16273F]">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#ECEAE6]">
        <div
          className={`h-full rounded-full ${barClassName}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function AudienceColumn({ title, rows, emptyLabel = "No data", getBarClassName }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-[#16273F]">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-xs text-[#8A8985]">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <AudienceBarRow
              key={row.label}
              label={row.label}
              value={row.value}
              barClassName={getBarClassName ? getBarClassName(row) : "bg-[#5B6CFF]"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PairedBox({ primaryLabel, primary, secondaryLabel, secondary }) {
  return (
    <div className="rounded-[10px] border border-[#EDECE7] bg-[#FCFCFB] px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A8985]">
        {primaryLabel}
      </p>
      <p className="mt-1 text-xl font-bold text-[#16273F]">{primary}</p>
      <div className="my-2 border-t border-[#E5E4DF]" />
      <p className="text-xs leading-snug text-[#8A8985]">
        {secondaryLabel}: <span className="font-semibold text-[#5A5955]">{secondary}</span>
      </p>
    </div>
  );
}

function ReportTable({ columns, rows }) {
  return (
    <div className="-mx-1 overflow-x-auto overscroll-x-contain sm:mx-0">
      <table className="w-max min-w-full border-collapse text-left text-[13px]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap border-y border-[#E5E4DF] bg-[#FAFAF8] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A8985] ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id || row.creatorId || idx} className="border-b border-[#EDECE7] last:border-b-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-3 tabular-nums text-[#16273F] ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverviewSection({ overview, formatCurrency, formatNumber, formatPercent }) {
  if (!overview) return null;

  const genderRows = (overview.genderSplit || [])
    .map((row) => ({ label: row.label, value: Number(row.value) || 0 }))
    .filter((row) => row.label);
  const ageRows = (overview.ageDistribution || [])
    .map((row) => ({ label: row.label, value: Number(row.value) || 0 }))
    .filter((row) => row.label);
  const locationRows = (overview.topCountries || [])
    .map((row) => ({ label: row.label, value: Number(row.value) || 0 }))
    .filter((row) => row.label)
    .slice(0, 3);

  const hasAudienceData =
    genderRows.some((r) => r.value > 0) ||
    ageRows.some((r) => r.value > 0) ||
    locationRows.some((r) => r.value > 0);

  const costPerEngagementLabel =
    overview.costPerEngagement == null
      ? null
      : `${formatCurrency(overview.costPerEngagement, { maxFractionDigits: 2 })} per engagement`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <MetricCard
          label="Total cost"
          value={formatCurrency(overview.totalCost)}
          underline
        />
        <MetricCard
          label="Total posts"
          value={formatNumber(overview.totalPosts, { compact: true })}
          underline
        />
        <MetricCard
          label="Total views"
          value={formatNumber(overview.totalViews, { compact: true })}
          underline
        />
        <MetricCard
          label="Earned media value"
          value={formatCurrency(overview.earnedMediaValue, { compact: true })}
          underline
        />
        <MetricCard label="Likes" value={formatNumber(overview.likes, { compact: true })} />
        <MetricCard
          label="Comments"
          value={formatNumber(overview.comments, { compact: true })}
        />
        <MetricCard
          label="Avg engagement rate"
          value={formatPercent(overview.avgEngagementRate)}
        />
        <MetricCard
          label="Cost per view"
          value={formatCurrency(overview.costPerView)}
          subtitle={costPerEngagementLabel}
        />
      </div>

      <section>
        <h2 className="text-[17px] font-bold text-[#16273F]">Audience</h2>
        {!hasAudienceData ? (
          <p className="mt-4 text-xs text-[#8A8985]">No data</p>
        ) : (
          <div className="mt-5 grid gap-8 sm:grid-cols-3">
            <AudienceColumn
              title="Gender"
              rows={genderRows.filter((r) => r.value > 0)}
              getBarClassName={(row) =>
                String(row.label).toLowerCase().includes("female")
                  ? "bg-primary"
                  : "bg-[#D5D3CE]"
              }
            />
            <AudienceColumn
              title="Age"
              rows={ageRows.filter((r) => r.value > 0)}
              getBarClassName={() => "bg-[#7B8CFF]"}
            />
            <AudienceColumn
              title="Top locations"
              rows={locationRows.filter((r) => r.value > 0)}
              getBarClassName={() => "bg-[#5B6CFF]"}
            />
          </div>
        )}
        <p className="mt-6 text-[11.5px] leading-relaxed text-[#8A8985]">
          Audience data from creators&apos; connected accounts.
        </p>
      </section>
    </div>
  );
}

function Unavailable() {
  return <span className="italic text-[#8A8985]">Unavailable</span>;
}

function SalesRoiSection({ sales, formatCurrency, formatNumber, formatDate }) {
  if (!sales) return null;
  const conversionSecondary =
    sales.blendedConversionLabel === "conversion"
      ? `${sales.blendedConversionValue ?? 0}%`
      : formatNumber(sales.blendedConversionValue);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <PairedBox
          primaryLabel="Total sales"
          primary={formatCurrency(sales.totalSales)}
          secondaryLabel="Blended AOV"
          secondary={formatCurrency(sales.blendedAov)}
        />
        <PairedBox
          primaryLabel="Total orders"
          primary={formatNumber(sales.totalOrders)}
          secondaryLabel={
            sales.blendedConversionLabel === "conversion" ? "Blended conversion" : "Units sold"
          }
          secondary={conversionSecondary}
        />
        <PairedBox
          primaryLabel="ROI"
          primary={sales.roi == null ? <Unavailable /> : `${sales.roi}x`}
          secondaryLabel="Cost per sale"
          secondary={
            sales.costPerSale == null ? <Unavailable /> : formatCurrency(sales.costPerSale)
          }
        />
        <PairedBox
          primaryLabel="Total cost"
          primary={formatCurrency(sales.totalCost)}
          secondaryLabel="Cost per creator"
          secondary={formatCurrency(sales.costPerCreator)}
        />
        <PairedBox
          primaryLabel="Payouts"
          primary={formatCurrency(sales.payouts)}
          secondaryLabel="Product cost"
          secondary={formatCurrency(sales.productCost)}
        />
      </div>

      <p className="text-[11.5px] leading-snug text-[#8A8985]">{sales.costBasisNote}</p>

      <div>
        <h3 className="mb-3 text-base font-bold text-[#16273F]">Sales by creator</h3>
        <ReportTable
          columns={[
            {
              key: "creatorName",
              label: "Creator",
              render: (r) => <CreatorCell name={r.creatorName} avatarUrl={r.avatarUrl} />,
            },
            {
              key: "revenue",
              label: "Revenue",
              align: "right",
              render: (r) => formatCurrency(r.revenue),
            },
            { key: "aov", label: "AOV", align: "right", render: (r) => formatCurrency(r.aov) },
            {
              key: "orders",
              label: "Orders",
              align: "right",
              render: (r) => formatNumber(r.orders),
            },
            {
              key: "conversion",
              label: "Conversion",
              align: "right",
              render: (r) =>
                r.conversionLabel === "conversion"
                  ? `${r.conversionValue ?? 0}%`
                  : `Units sold: ${formatNumber(r.conversionValue)}`,
            },
            {
              key: "roi",
              label: "ROI",
              align: "right",
              render: (r) => (r.roi == null ? <Unavailable /> : `${r.roi}x`),
            },
            {
              key: "costPerSale",
              label: "Cost/sale",
              align: "right",
              render: (r) =>
                r.costPerSale == null ? <Unavailable /> : formatCurrency(r.costPerSale),
            },
          ]}
          rows={sales.creators || []}
        />
      </div>

      {sales.topProducts?.length ? (
        <div>
          <h3 className="mb-3 text-base font-bold text-[#16273F]">Top products</h3>
          <ReportTable
            columns={[
              { key: "productLabel", label: "Product" },
              {
                key: "quantity",
                label: "Quantity",
                align: "right",
                render: (r) => formatNumber(r.quantity),
              },
              {
                key: "revenue",
                label: "Revenue",
                align: "right",
                render: (r) => formatCurrency(r.revenue),
              },
            ]}
            rows={sales.topProducts}
          />
        </div>
      ) : null}

      <div className="space-y-1 text-[11.5px] leading-relaxed text-[#8A8985]">
        <p>Engagement data as of {formatDate(sales.engagementAsOf)} (Phyllo, refreshes ~daily).</p>
        <p>
          Sales data as of {formatDate(sales.salesAsOf)} (Shopify sync, refreshes periodically).
        </p>
        <p>{sales.refundDisclaimer}</p>
      </div>
    </div>
  );
}

function CreatorsContentSection({
  section,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
}) {
  if (!section) return null;
  const platformColumns = [
    { key: "platform", label: "Platform" },
    { key: "posts", label: "Posts", align: "right", render: (r) => formatNumber(r.posts) },
    {
      key: "avgViews",
      label: "Avg views",
      align: "right",
      render: (r) => formatNumber(r.avgViews),
    },
    {
      key: "avgEngagementRate",
      label: "Avg eng. rate",
      align: "right",
      render: (r) => formatPercent(r.avgEngagementRate),
    },
  ];
  if (section.showShareOfViews) {
    platformColumns.push({
      key: "shareOfViews",
      label: "Share of views",
      align: "right",
      render: (r) => formatPercent(r.shareOfViews),
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-base font-bold text-[#16273F]">Top performing creators</h3>
        <ReportTable
          columns={[
            {
              key: "creatorName",
              label: "Creator",
              render: (r) => <CreatorCell name={r.creatorName} avatarUrl={r.avatarUrl} />,
            },
            {
              key: "followers",
              label: "Followers",
              align: "right",
              render: (r) => formatNumber(r.followers),
            },
            {
              key: "posts",
              label: "Posts",
              align: "right",
              render: (r) => formatNumber(r.posts),
            },
            {
              key: "views",
              label: "Views",
              align: "right",
              render: (r) => formatNumber(r.views),
            },
            {
              key: "engagementRate",
              label: "Eng. rate",
              align: "right",
              render: (r) => formatPercent(r.engagementRate),
            },
            {
              key: "costPerEngagement",
              label: "Cost/eng.",
              align: "right",
              render: (r) => formatCurrency(r.costPerEngagement),
            },
          ]}
          rows={section.topCreators || []}
        />
      </div>

      <div>
        <h3 className="mb-3 text-base font-bold text-[#16273F]">Platform breakdown</h3>
        <ReportTable columns={platformColumns} rows={section.platformBreakdown || []} />
      </div>

      <div>
        <h3 className="mb-3 text-base font-bold text-[#16273F]">Best performing content</h3>
        <ReportTable
          columns={[
            { key: "platform", label: "Platform" },
            {
              key: "creatorName",
              label: "Creator",
              render: (r) => <CreatorCell name={r.creatorName} avatarUrl={r.avatarUrl} />,
            },
            {
              key: "views",
              label: "Views",
              align: "right",
              render: (r) => formatNumber(r.views),
            },
            {
              key: "engagementRate",
              label: "Eng. rate",
              align: "right",
              render: (r) => formatPercent(r.engagementRate),
            },
            {
              key: "date",
              label: "Date",
              align: "right",
              render: (r) => formatDate(r.date),
            },
          ]}
          rows={section.bestPerformingContent || []}
        />
      </div>
    </div>
  );
}

function RehireSection({ rehire, formatCurrency }) {
  if (!rehire) return null;
  const suppressScore = Boolean(rehire.suppressNumericScore);

  const columns = [
    {
      key: "creatorName",
      label: "Creator",
      render: (r) => <CreatorCell name={r.creatorName} avatarUrl={r.avatarUrl} />,
    },
    { key: "paymentLabel", label: "Payment" },
    {
      key: "score",
      label: "Score",
      align: "right",
      render: (r) => {
        if (suppressScore) {
          return <span className="italic text-[#8A8985]">Not ranked</span>;
        }
        if (r.insufficientData) {
          return <span className="italic text-[#8A8985]">Insufficient data</span>;
        }
        return r.score;
      },
    },
    {
      key: "cost",
      label: "Cost/view",
      align: "right",
      render: (r) => (
        <span>
          {formatCurrency(r.costPerView)}
          <span className="block text-[10px] text-[#8A8985]">
            Cost/eng. {formatCurrency(r.costPerEngagement)}
          </span>
        </span>
      ),
    },
    { key: "onTimeLabel", label: "On-time" },
    {
      key: "revisions",
      label: "Revisions",
      align: "right",
      render: (r) => (r.revisions == null ? "-" : r.revisions),
    },
    {
      key: "avgResponseHours",
      label: "Avg response",
      align: "right",
      render: (r) => (r.avgResponseHours == null ? "-" : `${r.avgResponseHours}h`),
    },
  ];

  if (!HIDE_CREATOR_RATING_UI) {
    columns.push({
      key: "rating",
      label: "Rating*",
      align: "right",
      render: (r) => (r.rating == null ? "-" : r.rating),
    });
  }

  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-[#F5F5F4] px-3 py-2 text-[11.5px] leading-snug text-[#5A5955]">
        {rehire.scoreNote}
      </p>
      <ReportTable columns={columns} rows={rehire.scorecard || []} />
      {!HIDE_CREATOR_RATING_UI ? (
        <p className="text-[11.5px] italic leading-relaxed text-[#8A8985]">
          *{rehire.ratingFootnote}
        </p>
      ) : null}

      {rehire.internalNotes?.length ? (
        <div>
          <h3 className="mb-3 text-base font-bold text-[#16273F]">Internal notes</h3>
          <div className="space-y-3">
            {rehire.internalNotes.map((note) => (
              <div
                key={note.creatorId}
                className="rounded-[10px] border border-[#EDECE7] bg-[#FCFCFB] p-3.5"
              >
                <p className="text-sm font-semibold text-[#16273F]">{note.creatorName}</p>
                <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed text-[#5A5955]">
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function CompletedCampaignReport({ campaignId, embedded = false }) {
  const {
    data,
    isLoading,
    isError,
    message,
    activeTab,
    tabs,
    isPdfLoading,
    pdfDemoMessage,
    isDemo,
    handleTabChange,
    handleDownloadPdf,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
  } = useCompletedCampaignReport(campaignId);

  if (isError) {
    return (
      <div
        className={`flex items-center justify-center bg-[#EDEDEA] p-4 ${
          embedded ? "min-h-[240px]" : "min-h-screen"
        }`}
      >
        <div className="max-w-md rounded-xl border border-[#EDECE7] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#16273F]">Unable to load report</p>
          <p className="mt-2 text-xs text-[#8A8985]">{message || "Please try again later."}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    if (embedded) {
      return (
        <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-[#EDECE7] bg-white text-sm text-[#8A8985]">
          Loading report…
        </div>
      );
    }
    return <FullPageLoader />;
  }

  const { header, overview, salesAndRoi, creatorsAndContent, rehire } = data;
  const startLabel = formatDate(header.dateRangeStart);
  const endLabel = formatDate(header.dateRangeEnd);
  const dateLabel =
    startLabel !== "—" && endLabel !== "—"
      ? `${startLabel} to ${endLabel}`
      : [startLabel, endLabel].filter((d) => d !== "—").join(" to ");
  const rawType = String(header.campaignType || "").toUpperCase();
  const typeLabel =
    rawType === "UGC"
      ? "Paid UGC"
      : CAMPAIGN_TYPE_MAP[rawType] || header.campaignType || "";
  const subline = [typeLabel, header.brandName, dateLabel].filter(Boolean).join(" · ");
  const statusLabel =
    header.status === "COMPLETE" || header.status === "Completed"
      ? "Completed"
      : header.status || "Completed";
  const isCompletedStatus = statusLabel === "Completed";

  return (
    <div
      className={`text-[#5A5955] ${
        embedded ? "bg-transparent" : "min-h-screen bg-[#EDEDEA]"
      }`}
    >
      {isDemo ? (
        <DemoCampaignBanner className={embedded ? "mb-3 rounded-md" : "sticky top-0 z-20"} />
      ) : null}
      {!embedded ? (
        <div className="mx-auto flex max-w-[960px] flex-col gap-3 px-3 pb-3.5 pt-5 sm:px-4">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">Reports</h1>
              <p className="text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
                Results for each completed campaign.
              </p>
            </div>
            <div className="flex w-full flex-col items-stretch gap-1 sm:w-auto sm:items-end">
              {pdfDemoMessage ? (
                <div className="mb-1 w-full max-w-sm rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {pdfDemoMessage}
                </div>
              ) : null}
              <CustomButton
                text="Export as PDF"
                className="btn-outline w-full sm:min-w-[148px] sm:w-auto"
                onClick={handleDownloadPdf}
                disabled={isPdfLoading}
                loading={isPdfLoading}
                loadingText="Generating PDF…"
                startIcon={isPdfLoading ? null : <Download className="h-3.5 w-3.5" />}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`rounded-2xl border border-[#E8E6E1] bg-white px-5 py-7 shadow-[0_10px_30px_rgba(22,39,63,0.08)] sm:px-10 sm:py-10 ${
          embedded ? "mb-0 max-w-none" : "mx-auto mb-12 max-w-[960px]"
        }`}
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="min-w-0">
            <h2 className="text-[22px] font-bold tracking-tight text-[#16273F] sm:text-[26px]">
              {header.campaignTitle}
            </h2>
            {subline ? <p className="mt-1.5 text-[13.5px] text-[#8A8985]">{subline}</p> : null}
          </div>
          <div className="flex flex-row flex-wrap gap-2 sm:items-start">
            <span
              className={`whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-medium ${
                isCompletedStatus
                  ? "bg-emerald-50 text-emerald-700"
                  : "border border-[#E5E4DF] bg-white text-[#16273F]"
              }`}
            >
              {statusLabel}
            </span>
            <span className="whitespace-nowrap rounded-full bg-[#F3F2EF] px-3 py-1 text-[12px] font-medium text-[#5A5955]">
              {header.creatorsCompleted} of {header.creatorsTotal} creators
            </span>
          </div>
        </div>

        <nav
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-[#EDECE7]"
          role="tablist"
          aria-label="Report sections"
        >
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleTabChange(tab.id)}
                className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
                  active
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent font-medium text-[#8A8985] hover:text-[#16273F]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="mb-7 mt-6" />

        {activeTab === "overview" ? (
          <OverviewSection
            overview={overview}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            formatPercent={formatPercent}
          />
        ) : null}
        {activeTab === "sales" ? (
          <SalesRoiSection
            sales={salesAndRoi}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            formatDate={formatDate}
          />
        ) : null}
        {activeTab === "creators" ? (
          <CreatorsContentSection
            section={creatorsAndContent}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            formatPercent={formatPercent}
            formatDate={formatDate}
          />
        ) : null}
        {activeTab === "rehire" ? (
          <RehireSection rehire={rehire} formatCurrency={formatCurrency} />
        ) : null}
      </div>
    </div>
  );
}
