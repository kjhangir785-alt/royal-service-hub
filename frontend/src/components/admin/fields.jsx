import { useRef, useState } from "react";
import { Upload, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { api, resolveImg, apiError } from "../../lib/api";

const inputCls =
  "w-full rounded-none border border-white/15 bg-[#0a0a0a] px-3 py-2.5 font-body text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#d4af37]";

export function Field({ label, value, onChange, placeholder, testid }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block font-body text-[11px] uppercase tracking-widest text-white/50">{label}</span>}
      <input className={inputCls} value={value ?? ""} placeholder={placeholder} data-testid={testid}
        onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Area({ label, value, onChange, placeholder, testid, rows = 3 }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block font-body text-[11px] uppercase tracking-widest text-white/50">{label}</span>}
      <textarea rows={rows} className={inputCls} value={value ?? ""} placeholder={placeholder} data-testid={testid}
        onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function ImageUploader({ label, value, onChange, testid }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = () => ref.current?.click();
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(apiError(err, "Upload failed"));
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      {label && <span className="mb-1.5 block font-body text-[11px] uppercase tracking-widest text-white/50">{label}</span>}
      <div className="flex items-center gap-3">
        <div className="h-16 w-24 shrink-0 overflow-hidden border border-white/15 bg-[#0a0a0a]">
          {value ? <img src={resolveImg(value)} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-[10px] text-white/30">No image</div>}
        </div>
        <div className="flex-1">
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload"
            className={inputCls} data-testid={testid ? `${testid}-url` : undefined} />
          <button type="button" onClick={pick} disabled={busy} data-testid={testid ? `${testid}-upload` : undefined}
            className="mt-2 inline-flex items-center gap-2 border border-[#d4af37]/40 px-3 py-1.5 font-body text-[11px] uppercase tracking-widest text-[#d4af37] transition-colors hover:bg-[#d4af37] hover:text-black disabled:opacity-50">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload
          </button>
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}

// Generic list editor. schema: [{key,label,type:'text'|'textarea'|'image'|'number', placeholder}]
export function ListEditor({ items = [], schema, onChange, newItem, addLabel = "Add item", testid }) {
  const update = (idx, key, val) => {
    const next = items.map((it, i) => (i === idx ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...(items || []), typeof newItem === "function" ? newItem() : { ...newItem }]);
  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-4" data-testid={testid}>
      {(items || []).map((it, idx) => (
        <div key={idx} className="relative border border-white/10 bg-[#0a0a0a] p-4" data-testid={testid ? `${testid}-row-${idx}` : undefined}>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-body text-[11px] uppercase tracking-widest text-white/30">#{idx + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(idx, -1)} className="p-1 text-white/40 hover:text-[#d4af37]" title="Move up"><GripVertical className="h-4 w-4" /></button>
              <button type="button" onClick={() => remove(idx)} data-testid={testid ? `${testid}-remove-${idx}` : undefined} className="p-1 text-white/40 hover:text-red-400" title="Remove"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {schema.map((f) => {
              const span = f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : "";
              const set = (v) => update(idx, f.key, f.type === "number" ? Number(v) : v);
              return (
                <div key={f.key} className={span}>
                  {f.type === "textarea" ? (
                    <Area label={f.label} value={it[f.key]} onChange={set} placeholder={f.placeholder} />
                  ) : f.type === "image" ? (
                    <ImageUploader label={f.label} value={it[f.key]} onChange={set} testid={testid ? `${testid}-img-${idx}` : undefined} />
                  ) : (
                    <Field label={f.label} value={it[f.key]} onChange={set} placeholder={f.placeholder}
                      testid={testid ? `${testid}-${f.key}-${idx}` : undefined} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button type="button" onClick={add} data-testid={testid ? `${testid}-add` : undefined}
        className="inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 font-body text-xs uppercase tracking-widest text-white transition-colors hover:border-[#d4af37] hover:text-[#d4af37]">
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}

export function StringListEditor({ items = [], onChange, placeholder, addLabel = "Add", testid }) {
  const objs = (items || []).map((v) => ({ v }));
  return (
    <ListEditor
      items={objs}
      schema={[{ key: "v", label: "", type: "text", placeholder }]}
      onChange={(rows) => onChange(rows.map((r) => r.v))}
      newItem={() => ({ v: "" })}
      addLabel={addLabel}
      testid={testid}
    />
  );
}
