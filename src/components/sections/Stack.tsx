import { STACK } from "@/lib/data";

export default function Stack() {
  return (
    <section id="stack" className="sec">
      <div className="block block--wide" data-pane>
        <h2 className="h2">Stack</h2>
        <div className="stack">
          {STACK.map((g) => (
            <div key={g.group}>
              <h3 className="mono stack__t">{g.group}</h3>
              <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
