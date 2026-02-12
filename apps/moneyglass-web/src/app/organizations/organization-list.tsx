"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@ojpp/ui";
import { SearchInput } from "@/components/search-input";
import { FilterBar } from "@/components/filter-bar";
interface Organization {
  id: string;
  name: string;
  type: string;
  address: string | null;
  party: { id: string; name: string; shortName: string | null; color: string | null } | null;
}

interface PaginatedResult {
  data: Organization[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface Party {
  id: string;
  name: string;
  shortName: string | null;
}

const ORG_TYPE_LABELS: Record<string, string> = {
  PARTY_BRANCH: "政党支部",
  FUND_MANAGEMENT: "資金管理団体",
  SUPPORT_GROUP: "後援会",
  POLITICAL_COMMITTEE: "政治資金委員会",
  OTHER: "その他",
};

export function OrganizationList() {
  const [data, setData] = useState<PaginatedResult | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [partyFilter, setPartyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => setParties(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (partyFilter) params.set("party", partyFilter);
    if (typeFilter) params.set("type", typeFilter);
    fetch(`/api/organizations?${params}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, [page, partyFilter, typeFilter]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setPage(1);
    if (key === "party") setPartyFilter(value);
    if (key === "type") setTypeFilter(value);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const filteredData = data?.data.filter(
    (org) => !search || org.name.includes(search),
  );

  return (
    <div>
      <div className="mb-6 space-y-4">
        <SearchInput
          placeholder="団体名で検索..."
          onSearch={handleSearch}
          defaultValue={search}
        />
        <FilterBar
          filters={[
            {
              label: "政党",
              key: "party",
              value: partyFilter,
              options: parties.map((p) => ({ label: p.name, value: p.id })),
            },
            {
              label: "団体種別",
              key: "type",
              value: typeFilter,
              options: [
                { label: "政党支部", value: "PARTY_BRANCH" },
                { label: "資金管理団体", value: "FUND_MANAGEMENT" },
              ],
            },
          ]}
          onChange={handleFilterChange}
        />
      </div>

      {!filteredData ? (
        <p className="text-center text-gray-500">読み込み中...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-500">該当する団体がありません</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((org) => (
              <a key={org.id} href={`/organizations/${org.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{org.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {ORG_TYPE_LABELS[org.type] ?? org.type}
                      </p>
                    </div>
                    {org.party && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: org.party.color ?? "#6B7280" }}
                      >
                        {org.party.shortName ?? org.party.name}
                      </span>
                    )}
                  </div>
                  {org.address && (
                    <p className="mt-2 text-xs text-gray-400">{org.address}</p>
                  )}
                </Card>
              </a>
            ))}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              >
                前へ
              </button>
              <span className="text-sm text-gray-600">
                {page} / {data.pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
