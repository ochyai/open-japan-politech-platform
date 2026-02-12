import { OrganizationList } from "./organization-list";

export default function OrganizationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-2 text-3xl font-bold">政治団体一覧</h2>
      <p className="mb-8 text-gray-600">
        全国の政党支部・資金管理団体の政治資金データを検索・閲覧
      </p>
      <OrganizationList />
    </div>
  );
}
