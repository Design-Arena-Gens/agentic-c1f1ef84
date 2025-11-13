"use client";
import { useCallback, useMemo, useState } from "react";

export default function HomePage() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [schedule, setSchedule] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return !!file && title.trim().length > 0;
  }, [file, title]);

  const onConnect = useCallback(async () => {
    try {
      setConnecting(true);
      const r = await fetch("/api/auth/authorize");
      const data = await r.json();
      if (data.url) {
        // For now, we just simulate connection in this demo environment
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
      // Simulate success in demo
      setConnected(true);
    } catch (e) {
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);
      formData.append("privacy", privacy);
      formData.append("schedule", schedule);
      formData.append("file", file);

      const r = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await r.json();
      setResult(data.message || "Queued successfully");
    } catch (err) {
      setResult("Failed to queue upload");
    } finally {
      setSubmitting(false);
    }
  }, [file, title, description, tags, privacy, schedule]);

  const onAutoTitle = useCallback(() => {
    if (!file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    setTitle(base.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim());
  }, [file]);

  const onAutoTags = useCallback(() => {
    const words = (title + " " + description)
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter(Boolean);
    const uniq = Array.from(new Set(words)).slice(0, 10);
    setTags(uniq.join(", "));
  }, [title, description]);

  return (
    <div className="card">
      <div className="section" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <span className="badge">Status: {connected ? "Connected" : "Not connected"}</span>
        <button className="button secondary" onClick={onConnect} disabled={connecting}>
          {connecting ? "Connecting..." : connected ? "Reconnect" : "Connect Google"}
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid">
        <div className="section">
          <label className="label">Video file</label>
          <input className="file" type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="help">Your file remains local; demo uses a stubbed server endpoint.</div>
        </div>

        <div className="section">
          <label className="label">Title</label>
          <div className="row">
            <input className="input" placeholder="Awesome video title" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <button type="button" className="button" onClick={onAutoTitle}>Auto</button>
          </div>
        </div>

        <div className="section">
          <label className="label">Description</label>
          <textarea className="textarea" rows={6} placeholder="Video description" value={description} onChange={(e)=>setDescription(e.target.value)} />
        </div>

        <div className="section">
          <label className="label">Tags (comma separated)</label>
          <div className="row">
            <input className="input" placeholder="tag1, tag2, tag3" value={tags} onChange={(e)=>setTags(e.target.value)} />
            <button type="button" className="button" onClick={onAutoTags}>Suggest</button>
          </div>
        </div>

        <div className="section row">
          <div style={{flex:1,minWidth:260}}>
            <label className="label">Privacy</label>
            <select className="select" value={privacy} onChange={(e)=>setPrivacy(e.target.value)}>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div style={{flex:1,minWidth:260}}>
            <label className="label">Schedule (optional)</label>
            <input className="input" type="datetime-local" value={schedule} onChange={(e)=>setSchedule(e.target.value)} />
            <div className="help">Leave empty to upload immediately</div>
          </div>
        </div>

        <div className="section" style={{display:'flex',gap:12,alignItems:'center'}}>
          <button className="button" disabled={!canSubmit || submitting}>
            {submitting ? "Queuing..." : "Queue Upload"}
          </button>
          {result && <span className="badge">{result}</span>}
        </div>

        <hr />
        <div className="help">
          For real uploads, set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in environment vars and implement token storage.
        </div>
      </form>
    </div>
  );
}
