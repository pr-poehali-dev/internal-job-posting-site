import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/ca652d09-96c4-4e3d-83a9-377469383b3c";
const JOBS_URL = "https://functions.poehali.dev/ee3bdaa2-a07e-40cc-8345-5807fa219ae8";

const DEPARTMENTS = ["Разработка", "Маркетинг", "Продажи", "HR", "Финансы", "Операции"];
const LEVELS = ["Junior", "Middle", "Senior", "Lead", "Director"];
const ROLES = ["Разработчик", "Дизайнер", "Аналитик", "Менеджер", "Маркетолог"];
const CITIES = ["Москва", "Санкт-Петербург", "Любой город"];
const WORK_MODES = ["Офис", "Удалённо", "Гибрид", "Вахта"];

type FormJob = {
  id?: number;
  title: string; department: string; level: string; role: string;
  location: string; city: string; workMode: string; salary: string;
  posted: string; hot: boolean; tags: string;
  desc: string; fullDesc: string; requirements: string; conditions: string;
  team: string; recruiter: string; recruiterEmail: string;
};

const EMPTY_JOB: FormJob = {
  title: "", department: "Разработка", level: "Middle", role: "Разработчик",
  location: "", city: "Москва", workMode: "Офис", salary: "",
  posted: "Сегодня", hot: false, tags: "",
  desc: "", fullDesc: "", requirements: "", conditions: "",
  team: "", recruiter: "", recruiterEmail: "",
};

type Job = {
  id: number; title: string; department: string; level: string; role: string;
  location: string; city: string; workMode: string; salary: string;
  posted: string; hot: boolean; tags: string[]; desc: string; fullDesc: string;
  requirements: string[]; conditions: string[]; team: string;
  recruiter: string; recruiterEmail: string;
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("admin_token", data.token);
        onLogin(data.token);
      } else {
        setError(data.error || "Неверный логин или пароль");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center px-4">
      <div className="glass bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-white/60">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-white" />
          </div>
          <div>
            <p className="font-montserrat font-black text-foreground text-lg">Администратор</p>
            <p className="text-xs text-muted-foreground">Карьерный портал</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Логин</label>
            <input
              value={login} onChange={e => setLogin(e.target.value)}
              placeholder="admin" autoComplete="username"
              className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Пароль</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••" autoComplete="current-password"
              className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <Icon name="AlertCircle" size={14} className="flex-shrink-0" /> {error}
            </div>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><Icon name="Loader2" size={16} className="animate-spin" /> Вход...</> : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Job Form ─────────────────────────────────────────────────────────────────
function JobForm({
  initial, token, onSave, onCancel,
}: {
  initial: FormJob;
  token: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormJob>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormJob, val: string | boolean) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Укажите название вакансии"); return; }
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        requirements: form.requirements.split("\n").map(t => t.trim()).filter(Boolean),
        conditions: form.conditions.split("\n").map(t => t.trim()).filter(Boolean),
      };
      const isEdit = Boolean(form.id);
      const url = isEdit ? `${JOBS_URL}/${form.id}` : JOBS_URL;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) onSave();
      else setError("Ошибка сохранения");
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof FormJob, placeholder = "", type = "text") => (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type} value={form[key] as string} onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );

  const select = (label: string, key: keyof FormJob, options: string[]) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <select
        value={form[key] as string} onChange={e => set(key, e.target.value)}
        className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  const textarea = (label: string, key: keyof FormJob, placeholder = "", rows = 3) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <textarea
        rows={rows} value={form[key] as string} onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-border">
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
          <h2 className="font-montserrat font-black text-xl text-foreground">
            {form.id ? "Редактировать вакансию" : "Новая вакансия"}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all">
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {field("Название вакансии *", "title", "Senior Frontend Developer")}
          <div className="grid grid-cols-2 gap-3">
            {select("Подразделение", "department", DEPARTMENTS)}
            {select("Уровень", "level", LEVELS)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select("Роль", "role", ROLES)}
            {select("Город", "city", CITIES)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select("Формат работы", "workMode", WORK_MODES)}
            {field("Локация (отображаемая)", "location", "Москва")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Зарплата", "salary", "150 000 — 200 000 ₽")}
            {field("Когда опубликовано", "posted", "Сегодня")}
          </div>
          {field("Теги (через запятую)", "tags", "React, TypeScript, GraphQL")}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.hot} onChange={e => set("hot", e.target.checked)}
              className="w-4 h-4 rounded accent-primary" />
            <span className="text-sm font-medium text-foreground">Горящая вакансия</span>
          </label>
          {textarea("Краткое описание", "desc", "Ищем опытного разработчика...")}
          {textarea("Полное описание", "fullDesc", "Подробное описание вакансии...", 5)}
          {textarea("Требования (каждое с новой строки)", "requirements", "Опыт от 3 лет\nЗнание TypeScript", 4)}
          {textarea("Условия (каждое с новой строки)", "conditions", "ДМС с первого дня\nГибкий график", 4)}
          {field("Команда", "team", "Команда из 5 разработчиков")}
          <div className="grid grid-cols-2 gap-3">
            {field("Рекрутер", "recruiter", "Иван Иванов")}
            {field("Email рекрутера", "recruiterEmail", "i.ivanov@company.ru", "email")}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <Icon name="AlertCircle" size={14} /> {error}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 border border-border text-foreground py-3 rounded-xl font-semibold hover:bg-secondary transition-all text-sm">
              Отмена
            </button>
            <button onClick={handleSave} disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
              {loading ? <><Icon name="Loader2" size={16} className="animate-spin" /> Сохраняем...</> : <><Icon name="Save" size={16} /> Сохранить</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [editJob, setEditJob] = useState<(typeof EMPTY_JOB & { id?: number }) | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(JOBS_URL);
      setJobs(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadJobs();
  }, [token]);

  const handleDelete = async () => {
    if (!deleteId || !token) return;
    setDeleting(true);
    await fetch(`${JOBS_URL}/${deleteId}`, {
      method: "DELETE",
      headers: { "X-Admin-Token": token },
    });
    setDeleteId(null);
    setDeleting(false);
    loadJobs();
  };

  const openNew = () => setEditJob({ ...EMPTY_JOB });

  const openEdit = (job: Job) => setEditJob({
    ...EMPTY_JOB,
    ...job,
    id: job.id,
    tags: job.tags.join(", "),
    requirements: job.requirements.join("\n"),
    conditions: job.conditions.join("\n"),
  } as FormJob);

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) return <LoginScreen onLogin={setToken} />;

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="glass sticky top-0 z-30 border-b border-white/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="Shield" size={18} className="text-white" />
            </div>
            <div>
              <span className="font-montserrat font-extrabold text-lg text-foreground">Панель</span>
              <span className="font-montserrat font-extrabold text-lg text-primary ml-1">администратора</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openNew}
              className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2">
              <Icon name="Plus" size={16} /> Добавить вакансию
            </button>
            <button onClick={logout}
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl hover:bg-secondary transition-all text-sm flex items-center gap-1.5">
              <Icon name="LogOut" size={15} /> Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-montserrat font-black text-3xl text-foreground">Вакансии</h1>
            <p className="text-muted-foreground mt-1">Всего: {jobs.length}</p>
          </div>
          <button onClick={loadJobs} className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all">
            <Icon name="RefreshCw" size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading && jobs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-3" />
            Загрузка...
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className="glass rounded-2xl p-5 border border-white/60 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {job.hot && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Icon name="Flame" size={10} /> Горящая
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{job.department}</span>
                    <span className="text-[11px] text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full">{job.level}</span>
                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{job.workMode}</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-foreground text-base">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{job.location} · {job.posted}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(job)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                    <Icon name="Pencil" size={16} />
                  </button>
                  <button onClick={() => setDeleteId(job.id)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Job form modal */}
      {editJob && (
        <JobForm
          initial={editJob}
          token={token}
          onSave={() => { setEditJob(null); loadJobs(); }}
          onCancel={() => setEditJob(null)}
        />
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-border">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Icon name="Trash2" size={26} className="text-red-500" />
            </div>
            <h3 className="font-montserrat font-black text-xl text-foreground text-center mb-2">Удалить вакансию?</h3>
            <p className="text-muted-foreground text-sm text-center mb-6">Это действие нельзя отменить</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-border py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-all">
                Отмена
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting ? <><Icon name="Loader2" size={14} className="animate-spin" /> Удаляем...</> : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}