import { scrollToId } from "@/lib/motion";

export default function About() {
  return (
    <section id="about" className="sec">
      <div className="block" data-pane>
        <h2 className="h2">About</h2>
        <p className="lead">I'm a software developer. I build the web product and the AI behind it: full-stack applications, retrieval-augmented generation (RAG) pipelines and LLM agents.</p>
        <a className="link" href="#work" onClick={(e) => { e.preventDefault(); scrollToId("work"); }}><span>See projects</span><i aria-hidden="true">→</i></a>
      </div>
    </section>
  );
}
