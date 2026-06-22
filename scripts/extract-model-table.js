/**
 * Browser-side extraction script for the SAP Notes model tables.
 * Run via playwright-mcp evaluate_script on https://me.sap.com/notes/3437766.
 * Returns { active: ModelRow[], retired: RetiredModelRow[] } or { error: '...' }.
 */
(() => {
  const clean = s => (s ?? '').trim().replace(/\u00a0/g, '').replace(/ /g, ' ').trim();

  // --- Active models table ---

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
      versionCol: col('version', 2),
      orchestrationCol: col('orchestration', 7),
      deprecatedCol: col('deprecat', 8),
      retirementCol: col('retirement', 10),
      replacementCol: col('replacement', 9)
    };
  }

  function extractActiveRows(allRows, cols) {
    return allRows.slice(2).reduce((rows, row) => {
      const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent);
      const model = clean(cells[cols.modelCol]);
      if (!model) return rows;
      rows.push({
        executableId: clean(cells[cols.executableIdCol]).split('\n')[0].trim(),
        model,
        version: clean(cells[cols.versionCol]),
        availableInOrchestration: clean(cells[cols.orchestrationCol]),
        deprecated: clean(cells[cols.deprecatedCol]),
        retirementDate: clean(cells[cols.retirementCol]),
        suggestedReplacement: clean(cells[cols.replacementCol]).split('\n').map(clean).filter(Boolean).join(', ')
      });
      return rows;
    }, []);
  }

  // --- Recently Retired Models table ---
  // Identified by having "suggested replacement" in its header row (4 columns, no orchestration col).

  function findRetiredTable() {
    return Array.from(document.querySelectorAll('table')).find(t => {
      const headerCells = Array.from(t.querySelectorAll('tbody tr:first-child td')).map(
        c => c.textContent.trim().toLowerCase()
      );
      return (
        headerCells.some(h => h.includes('suggested replacement')) &&
        !headerCells.some(h => h.includes('orchestration'))
      );
    });
  }

  function extractRetiredRows(allRows) {
    // First row is header; skip it.
    return allRows.slice(1).reduce((rows, row) => {
      const cells = Array.from(row.querySelectorAll('td')).map(td => clean(td.textContent));
      // Columns: executableId(0), model(1), version(2), suggestedReplacement(3)
      const model = cells[1];
      if (!model) return rows;
      rows.push({
        executableId: cells[0].split('\n')[0].trim(),
        model,
        version: cells[2] ?? '',
        suggestedReplacement: cells[3] ?? ''
      });
      return rows;
    }, []);
  }

  const activeTable = findModelTable();
  if (!activeTable) return { error: 'model table not found' };

  const activeRows = Array.from(activeTable.querySelectorAll('tbody tr'));
  const cols = buildColumnIndex(activeRows[0]);
  const active = extractActiveRows(activeRows, cols);

  const retiredTable = findRetiredTable();
  const retired = retiredTable
    ? extractRetiredRows(Array.from(retiredTable.querySelectorAll('tbody tr')))
    : [];

  return { active, retired };
})()
