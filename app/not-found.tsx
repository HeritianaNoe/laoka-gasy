import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-display text-6xl font-semibold text-clay">404</p>
      <p className="mt-3 text-lg text-muted">Tsy hita io laoka io.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-ravitoto px-5 py-2.5 font-medium text-rice">
        Hiverina any am-piandohana
      </Link>
    </div>
  );
}
