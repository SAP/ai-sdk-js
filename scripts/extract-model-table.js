/**
 * Browser-side extraction script for the SAP Notes model table.
 * Run via chrome-devtools-mcp evaluate_script on https://me.sap.com/notes/3437766.
 * Returns a JSON-serializable array of model rows.
 */
(() => {
  const table =
    document.querySelector('table.col-resizeable') ||
    Array.from(document.querySelectorAll('table')).find(t =>
      Array.from(t.querySelectorAll('tr:first-child td strong')).some(s =>
        s.textContent.toLowerCase().includes('model')
      )
    );

  if (!table) return { error: 'model table not found' };

  const allRows = Array.from(table.querySelectorAll('tbody tr'));

  // Build column index from first header row
  const colIndex = {};
  Array.from(allRows[0]?.querySelectorAll('td') ?? []).forEach((cell, i) => {
    const text = (cell.querySelector('strong')?.textContent ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
    colIndex[text] = i;
  });

  const col = (keyword, fallback) =>
    Object.entries(colIndex).find(([k]) => k.includes(keyword))?.[1] ?? fallback;

  const executableIdCol = col('executable', 0);
  const modelCol = Object.entries(colIndex).find(
    ([k]) => k.includes('model') && !k.includes('token')
  )?.[1] ?? 1;
  const orchestrationCol = col('orchestration', 7);
  const deprecatedCol = col('deprecat', 8);
  const retirementCol = col('retirement', 10);
  const replacementCol = col('replacement', 9);

  const clean = s => (s ?? '').trim().replace(/\u00a0/g, '');

  return allRows.slice(2).reduce((rows, row) => {
    const cells = Array.from(row.querySelectorAll('td')).map(
      td => td.textContent
    );
    const model = clean(cells[modelCol]);
    if (!model) return rows;
    rows.push({
      executableId: clean(cells[executableIdCol]).split('\n')[0].trim(),
      model,
      availableInOrchestration: clean(cells[orchestrationCol]),
      deprecated: clean(cells[deprecatedCol]),
      retirementDate: clean(cells[retirementCol]),
      suggestedReplacement: clean(cells[replacementCol])
    });
    return rows;
  }, []);
})()
