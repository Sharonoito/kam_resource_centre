import Link from "next/link";

export const metadata = {
  title: "KRA Customs Data",
};

export default function KraCustomsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">KRA Customs Data</h1>
      <p className="mt-4 text-slate-600">
        The dedicated customs explorer page is being refreshed for production stability.
      </p>
      <p className="mt-2 text-slate-600">
        Use the main KRA research hub while this route is finalized.
      </p>
      <Link
        href="/research/kra"
        className="mt-8 inline-flex rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
      >
        Go to KRA research hub
      </Link>
    </main>
  );
}
