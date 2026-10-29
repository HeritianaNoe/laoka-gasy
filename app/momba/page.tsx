import Image from "next/image";
import { ShareButton } from "@/components/share-button";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-10">
      <div className="relative aspect-[21/9] overflow-hidden rounded-[2rem] bg-paper">
        <Image src="/img/ravitoto.png" alt="Ravitoto" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
      </div>
      <header className="flex items-center gap-5">
        <Image
          src="/icon.svg"
          alt="Sary famantarana Laoka"
          width={80}
          height={80}
          className="size-16 shrink-0 rounded-2xl shadow-lg shadow-clay/30 sm:size-20"
        />
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] text-clay uppercase">Momba ny Laoka</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Ny laoka gasy, eo am-pelatananao</h1>
        </div>
      </header>
      <div className="space-y-4 text-lg leading-relaxed text-ink/80">
        <p>
          Laoka dia fitaovana kely hanampy anao hitahiry sy handamina ireo laoka gasy tianao toy ny henakisoa ravitoto, henomby ritra,
          akoho atao saosy… Omeo kintana izy ireo, asio fo, mariho ireo tianao indrindra, ary avelao hisafidy ho anao ny
          rindran'asa rehefa tsy fantatrao izay hohanina.
        </p>
        <p>
          Ao amin'ny pejy <strong>Fady</strong>, azonao atao ny manoratra ireo zavatra tsy hohaninao — ireo laoka misy
          azy dia voamarika ary afenina ho azy.
        </p>
      </div>
      <ShareButton />
      <footer className="flex items-center gap-3 border-t border-ink/10 pt-6 text-sm text-muted">
        <Image src="/icon.svg" alt="" width={28} height={28} className="size-7 rounded-lg" />
        <p>
          © 2026 <span className="font-semibold text-ink">RASOLOMANANA Heritiana Noe</span>. Zo
          rehetra voatokana.
        </p>
      </footer>
    </div>
  );
}
