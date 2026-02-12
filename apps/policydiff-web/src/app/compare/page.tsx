"use client";

import { useEffect, useState } from "react";
import { Card } from "@ojpp/ui";

interface Party {
  id: string;
  name: string;
  color: string | null;
}

interface Policy {
  id: string;
  title: string;
  content: string;
  party: Party | null;
}

const CATEGORIES = [
  "教育", "子育て", "医療", "経済・財政", "デジタル",
  "エネルギー", "外交・安全保障", "福祉", "産業", "科学技術",
];

export default function ComparePage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("教育");
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/parties")
      .then((r) => r.json())
      .then((json) => {
        const data = json.data.filter((p: Party & { _count?: { policies: number } }) =>
          (p._count as { policies: number } | undefined)?.policies !== undefined
            ? (p._count as { policies: number }).policies > 0
            : true,
        );
        setParties(data);
        setSelectedParties(data.slice(0, 4).map((p: Party) => p.name));
      });
  }, []);

  useEffect(() => {
    if (!selectedCategory || selectedParties.length === 0) {
      setPolicies([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({
      category: selectedCategory,
      parties: selectedParties.join(","),
    });
    fetch(`/api/compare?${params}`)
      .then((r) => r.json())
      .then((json) => {
        setPolicies(json.data);
        setLoading(false);
      });
  }, [selectedCategory, selectedParties]);

  function toggleParty(name: string) {
    setSelectedParties((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-2 text-3xl font-bold">政党比較</h2>
      <p className="mb-8 text-gray-600">
        カテゴリと政党を選択して、各政党の政策を横並びで比較できます。
      </p>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-gray-500">カテゴリを選択</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                selectedCategory === cat
                  ? "border-green-600 bg-green-50 font-medium text-green-700"
                  : "hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-gray-500">政党を選択</h3>
        <div className="flex flex-wrap gap-2">
          {parties.map((party) => (
            <button
              key={party.id}
              type="button"
              onClick={() => toggleParty(party.name)}
              className={`inline-flex items-center rounded-full border-2 px-3 py-1 text-sm font-medium transition-colors ${
                selectedParties.includes(party.name)
                  ? "bg-opacity-10"
                  : "opacity-40"
              }`}
              style={{
                borderColor: party.color ?? "#6b7280",
                color: party.color ?? "#6b7280",
                backgroundColor: selectedParties.includes(party.name)
                  ? `${party.color ?? "#6b7280"}15`
                  : "transparent",
              }}
            >
              {party.color && (
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: party.color }}
                />
              )}
              {party.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      ) : policies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {policies.map((policy) => (
            <Card key={policy.id} padding="md" className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                {policy.party?.color && (
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: policy.party.color }}
                  />
                )}
                <span
                  className="text-sm font-bold"
                  style={{ color: policy.party?.color ?? undefined }}
                >
                  {policy.party?.name ?? "不明"}
                </span>
              </div>
              <h3 className="mb-3 text-base font-bold">{policy.title}</h3>
              <div
                className="flex-1 text-sm text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: policy.content
                    .replace(/^## (.+)$/gm, "<h3 class='font-bold mt-3 mb-1'>$1</h3>")
                    .replace(/^- (.+)$/gm, "<li class='ml-4'>$1</li>")
                    .replace(/\n\n/g, "<br/>"),
                }}
              />
              <div className="mt-4 border-t pt-3">
                <a
                  href={`/policy/${policy.id}`}
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  詳細を見る
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center text-gray-500">
            <p>カテゴリと政党を選択してください。</p>
          </div>
        </Card>
      )}
    </div>
  );
}
