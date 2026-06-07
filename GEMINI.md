# Project Instructions (GEMINI.md)

## Mathematical & LaTeX Formatting Style

In the DAGLearn frontend, we render mathematical expressions (e.g., exponents, complexity notation) using a **lightweight, custom React-based parser** inside `FormattedText.tsx` rather than importing a large external library like KaTeX or MathJax.

This file documents the architectural decisions, trade-offs, advantages, and limitations of this approach, as well as guidelines for future modifications.

---

### 🌟 Advantages (Why we chose this)
1. **Zero-Weight Bundle Size:** Adding KaTeX or MathJax adds several hundred kilobytes of JavaScript/CSS to the production bundle size. Our custom parsing engine uses native CSS and standard React `<sup>`/`<sub>` tags, which compiles down to zero overhead and preserves instantaneous page hydration.
2. **Deterministic SEO & SSR:** Because the parser is lightweight and written in plain React/TypeScript, it runs completely synchronously during Server-Side Rendering (SSR) without requiring complex client-only rendering wrappers or causing flash-of-unstyled-text (FOUT).
3. **No Third-Party Vulnerabilities:** We avoid importing extra npm packages, maintaining a tight, secure, and clean dependency tree.
4. **Tailored to AP CSA & DSA:** High school Computer Science and Data Structures math requirements are simple (focusing on exponents, subscripts, comparison operators, and $O(n)$ complexity notations), all of which are rendered with gorgeous italicized serif typography resembling standard LaTeX.

---

### ⚠️ Limitations (What is not supported)
- **Vertical Spatials:** Advanced formatting requiring vertical layouts (e.g., fractions `\frac{a}{b}`, square roots `\sqrt{x}`, matrices, limits) are not supported.
- **Advanced Math Notations:** Integral signs, summations, and advanced calculus macros are not parsed.

---

### 📜 Supported Notations & Syntax Reference
To render inline math, wrap the expressions in single dollar signs `$`:
- **Exponents:** `$-2^{31}$` $\to$ $-2^{31}$
- **Variables & Powers:** `$2^{31}-1$` $\to$ $2^{31}-1$
- **Big O Notation:** `$O(n^2)$` $\to$ $O(n^2)$
- **Comparison Operators:** Use standard comparison LaTeX commands:
  - `\le` $\to$ `≤`
  - `\ge` $\to$ `≥`
  - `\ne` $\to$ `≠`
- **Operators:**
  - `\times` $\to$ `×`
  - `\cdot` $\to$ `·`
  - `\minus` or `-` $\to$ true typography minus sign `−` without injecting surrounding spaces

---

### 🛠️ Future Roadmap & Triggers for KaTeX Integration
If the platform expands to cover advanced mathematical domains (e.g., Calculus, Physics, Linear Algebra) where vertical layouts and complex matrices are required, the custom engine should be replaced with **KaTeX**:
1. Run `npm install katex` and `@types/katex`.
2. Import KaTeX CSS in the application root (`import 'katex/dist/katex.min.css'`).
3. Replace the `renderMathFormula` function in `src/components/FormattedText.tsx` to call KaTeX:
   ```typescript
   import katex from 'katex';
   
   function renderMathFormula(formula: string): React.ReactNode {
     const html = katex.renderToString(formula, { throwOnError: false });
     return <span dangerouslySetInnerHTML={{ __html: html }} />;
   }
   ```
