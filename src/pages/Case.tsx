import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { Nav } from "@/components/Nav";
import { go } from "@/lib/transition";
import NotFound from "./NotFound";

export default function Case() {
  const { slug } = useParams();
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  const p = PROJECTS[i];
  useEffect(() => { if (p) document.title = `${p.title} | Joel Onyedika`; }, [p]);
  if (!p) return <NotFound />;
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  return (
    <>
      <Nav home={false} />
      <main className="case">
        <p className="mono proj__status"><i className={p.status === "Live" ? "on" : ""} />{p.status}</p>
        <h1 className="display case__title">{p.title}</h1>
        <p className="lead">{p.line}</p>
        <p className="case__body">{p.body}</p>
        {p.tech.length > 0 && (
          <div><h2 className="mono stack__t">Built with</h2><ul className="chips">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul></div>
        )}
        <div className="proj__links">
          {p.url && <a className="btn" href={p.url} target="_blank" rel="noopener noreferrer">Visit site <ExternalLink size={15} /></a>}
          <a className="link" href={`/work/${next.slug}`} onClick={(e) => { e.preventDefault(); go(`/work/${next.slug}`); }}><span>Next: {next.title}</span><i aria-hidden="true">→</i></a>
        </div>
      </main>
    </>
  );
}
