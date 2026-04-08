/**
 * Browser-side extraction script for the SAP Notes model table.
 * Run via chrome-devtools-mcp evaluate_script on https://me.sap.com/notes/3437766.
 * Returns a JSON-serializable array of model rows.
 */
(() => {
  function findModelTable() {
    return (
      document.querySelector('table.col-resizeable') ||
      Array.from(document.querySelectorAll('table')).find(t =>
        Array.from(t.querySelectorAll('tr:first-child td strong')).some(s =>
          s.textContent.toLowerCase().includes('model')
        )
      )
    );
  }

  function buildColumnIndex(headerRow) {
    const colIndex = {};
    Array.from(headerRow?.querySelectorAll('td') ?? []).forEach((cell, i) => {
      const text = (cell.querySelector('strong')?.textContent ?? '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
      colIndex[text] = i;
    });

    const col = (keyword, fallback) =>
      Object.entries(colIndex).find(([k]) => k.includes(keyword))?.[1] ?? fallback;

    return {
      executableIdCol: col('executable', 0),
      modelCol: Object.entries(colIndex).find(
        ([k]) => k.includes('model') && !k.includes('token')
      )?.[1] ?? 1,
      orchestrationCol: col('orchestration', 7),
      deprecatedCol: col('deprecat', 8),
      retirementCol: col('retirement', 10),
      replacementCol: col('replacement', 9)
    };
  }

  function extractRows(allRows, cols) {
    const clean = s => (s ?? '').trim().replace(/\u00a0/g, '');
    return allRows.slice(2).reduce((rows, row) => {
      const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent);
      const model = clean(cells[cols.modelCol]);
      if (!model) return rows;
      rows.push({
        executableId: clean(cells[cols.executableIdCol]).split('\n')[0].trim(),
        model,
        availableInOrchestration: clean(cells[cols.orchestrationCol]),
        deprecated: clean(cells[cols.deprecatedCol]),
        retirementDate: clean(cells[cols.retirementCol]),
        suggestedReplacement: clean(cells[cols.replacementCol])
      });
      return rows;
    }, []);
  }

  const table = findModelTable();
  if (!table) return { error: 'model table not found' };

  const allRows = Array.from(table.querySelectorAll('tbody tr'));
  const cols = buildColumnIndex(allRows[0]);
  return extractRows(allRows, cols);
})()
