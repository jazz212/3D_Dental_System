"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  fieldClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
  tableCellClass,
  tableHeaderCellClass,
} from "@/app/components/staff/staffStyles";

// Delete actions reuse the row-action button, red on hover (DESIGN.md: "Row
// actions ... Delete turns red"). staffStyles' rowActionButtonClass hovers
// teal, so this is the red twin of it.
const deleteButtonClass =
  "p-1.5 rounded text-gray-500 cursor-pointer transition-all duration-150 ease-smooth hover:text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50";

const COLUMNS = [
  { key: "toothNumber", label: "Tooth number", placeholder: "24" },
  { key: "mobility", label: "Mobility", placeholder: "Grade I" },
  { key: "palpation", label: "Palpation", placeholder: "Tender" },
  { key: "percussion", label: "Percussion", placeholder: "Positive" },
  { key: "hotTest", label: "Hot test (duration)", placeholder: "3s" },
  { key: "coldTest", label: "Cold test (duration)", placeholder: "5s" },
];

const emptyRow = () => ({
  id: crypto.randomUUID(),
  toothNumber: "",
  mobility: "",
  palpation: "",
  percussion: "",
  hotTest: "",
  coldTest: "",
});

const emptyTable = () => ({
  id: crypto.randomUUID(),
  rows: [emptyRow(), emptyRow()],
});

function DiagnosticTable({ table, index, canRemove, onRemoveTable, onRowChange, onAddRow, onRemoveRow }) {
  return (
    <section className={panelClass}>
      {/* Heading and its controls share the panel with the table (DESIGN.md:
          "One panel"), so there is no second box around the table. */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <h2 className="font-bold text-lg">Table {index + 1}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAddRow(table.id)}
            className={`${secondaryButtonClass} flex items-center gap-2 text-sm`}
          >
            <Plus aria-hidden="true" className="w-4 h-4" />
            Add row
          </button>
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemoveTable(table.id)}
              className={deleteButtonClass}
              aria-label={`Delete table ${index + 1}`}
            >
              <Trash2 aria-hidden="true" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Six input columns need more room than the usual 720px floor before
          they get cramped, so this table scrolls sideways a little sooner. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className={`${tableHeaderCellClass} whitespace-nowrap`}>
                  {col.label}
                </th>
              ))}
              <th className={`${tableHeaderCellClass} w-12`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.rows.map((row, i) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition duration-150 ease-smooth motion-reduce:transition-none"
              >
                {COLUMNS.map((col) => (
                  <td key={col.key} className={tableCellClass}>
                    <input
                      type="text"
                      className={fieldClass()}
                      value={row[col.key]}
                      placeholder={col.placeholder}
                      aria-label={`${col.label}, row ${i + 1}`}
                      onChange={(e) => onRowChange(table.id, row.id, col.key, e.target.value)}
                    />
                  </td>
                ))}
                <td className={`${tableCellClass} text-center`}>
                  <button
                    type="button"
                    onClick={() => onRemoveRow(table.id, row.id)}
                    disabled={table.rows.length === 1}
                    className={deleteButtonClass}
                    aria-label={`Remove row ${i + 1}`}
                  >
                    <Trash2 aria-hidden="true" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// One numbered field in the diagnosis / treatment-plan lists.
function NumberedField({ index, value, label, placeholder, onChange, onRemove, disableRemove }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="w-5 shrink-0 text-sm text-gray-500 tabular-nums">
        {index + 1}.
      </span>
      <input
        type="text"
        className={fieldClass()}
        value={value}
        placeholder={placeholder}
        aria-label={`${label} ${index + 1}`}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={disableRemove}
        className={deleteButtonClass}
        aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
      >
        <Trash2 aria-hidden="true" className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function DiagnosticTestsSection({ value, onChange, onSave, onDiscard }) {
  const [internal, setInternal] = useState({
    diagnosticTables: [emptyTable()],
    radiographicInterpretation: "",
    tentativeDiagnosis: [""],
    treatmentPlan: [""],
  });

  const data = value ?? internal;
  const update = (next) => (onChange ? onChange(next) : setInternal(next));

  const addTable = () => {
    update({ ...data, diagnosticTables: [...data.diagnosticTables, emptyTable()] });
  };

  const removeTable = (tableId) => {
    if (data.diagnosticTables.length === 1) return;
    update({ ...data, diagnosticTables: data.diagnosticTables.filter((t) => t.id !== tableId) });
  };

  const addRow = (tableId) => {
    update({
      ...data,
      diagnosticTables: data.diagnosticTables.map((t) =>
        t.id === tableId ? { ...t, rows: [...t.rows, emptyRow()] } : t
      ),
    });
  };

  const removeRow = (tableId, rowId) => {
    update({
      ...data,
      diagnosticTables: data.diagnosticTables.map((t) =>
        t.id === tableId && t.rows.length > 1 ? { ...t, rows: t.rows.filter((r) => r.id !== rowId) } : t
      ),
    });
  };

  const updateRow = (tableId, rowId, field, val) => {
    update({
      ...data,
      diagnosticTables: data.diagnosticTables.map((t) =>
        t.id === tableId
          ? { ...t, rows: t.rows.map((r) => (r.id === rowId ? { ...r, [field]: val } : r)) }
          : t
      ),
    });
  };

  const updateList = (key, index, val) => {
    const next = [...data[key]];
    next[index] = val;
    update({ ...data, [key]: next });
  };

  const addListItem = (key) => {
    update({ ...data, [key]: [...data[key], ""] });
  };

  const removeListItem = (key, index) => {
    if (data[key].length === 1) return;
    update({ ...data, [key]: data[key].filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Diagnostic Tests</h1>
        <p className="text-gray-500">
          Record the test results per tooth, then note the diagnosis and the
          recommended treatment.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {data.diagnosticTables.map((table, i) => (
          <DiagnosticTable
            key={table.id}
            table={table}
            index={i}
            canRemove={data.diagnosticTables.length > 1}
            onRemoveTable={removeTable}
            onRowChange={updateRow}
            onAddRow={addRow}
            onRemoveRow={removeRow}
          />
        ))}

        <div>
          <button
            type="button"
            onClick={addTable}
            className={`${secondaryButtonClass} flex items-center gap-2`}
          >
            <Plus aria-hidden="true" className="w-4 h-4" />
            Add table
          </button>
        </div>

        {/* Interpretation, diagnosis and plan close out the form together */}
        <section className={`${panelClass} p-5`}>
          <div>
            <label htmlFor="radiographic-interpretation" className="font-bold text-lg">
              Radiographic interpretation
            </label>
            <textarea
              id="radiographic-interpretation"
              className={`${fieldClass()} mt-2 min-h-28 resize-y`}
              placeholder="Describe the radiographic findings..."
              value={data.radiographicInterpretation}
              onChange={(e) => update({ ...data, radiographicInterpretation: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
            <div>
              <h2 className="font-bold text-lg">Tentative diagnosis</h2>
              <div className="flex flex-col gap-2 mt-2">
                {data.tentativeDiagnosis.map((val, i) => (
                  <NumberedField
                    key={i}
                    index={i}
                    value={val}
                    label="Diagnosis"
                    placeholder={`Diagnosis ${i + 1}`}
                    onChange={(next) => updateList("tentativeDiagnosis", i, next)}
                    onRemove={() => removeListItem("tentativeDiagnosis", i)}
                    disableRemove={data.tentativeDiagnosis.length === 1}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => addListItem("tentativeDiagnosis")}
                className={`${secondaryButtonClass} flex items-center gap-2 text-sm mt-3`}
              >
                <Plus aria-hidden="true" className="w-4 h-4" />
                Add diagnosis
              </button>
            </div>

            <div>
              <h2 className="font-bold text-lg">Recommended treatment plan</h2>
              <div className="flex flex-col gap-2 mt-2">
                {data.treatmentPlan.map((val, i) => (
                  <NumberedField
                    key={i}
                    index={i}
                    value={val}
                    label="Treatment step"
                    placeholder={`Treatment step ${i + 1}`}
                    onChange={(next) => updateList("treatmentPlan", i, next)}
                    onRemove={() => removeListItem("treatmentPlan", i)}
                    disableRemove={data.treatmentPlan.length === 1}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => addListItem("treatmentPlan")}
                className={`${secondaryButtonClass} flex items-center gap-2 text-sm mt-3`}
              >
                <Plus aria-hidden="true" className="w-4 h-4" />
                Add treatment step
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4 sm:gap-4">
            <button type="button" onClick={onDiscard} className={secondaryButtonClass}>
              Discard changes
            </button>
            <button type="button" onClick={onSave} className={primaryButtonClass}>
              Save
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
