import { go } from "@/lib/transition";

const NotFound = () => (
  <main className="nf">
    <p className="mono">retrieve(k=0)</p>
    <h1 className="display">No match</h1>
    <a className="link" href="/" onClick={(e) => { e.preventDefault(); go("/"); }}><span>Back to the index</span><i aria-hidden="true">→</i></a>
  </main>
);
export default NotFound;
