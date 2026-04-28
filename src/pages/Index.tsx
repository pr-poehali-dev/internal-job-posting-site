import { useState } from "react";
import Icon from "@/components/ui/icon";

const DEPARTMENTS = ["Все подразделения", "Разработка", "Маркетинг", "Продажи", "HR", "Финансы", "Операции"];
const LEVELS = ["Все уровни", "Junior", "Middle", "Senior", "Lead", "Director"];
const ROLES = ["Все должности", "Разработчик", "Дизайнер", "Аналитик", "Менеджер", "Маркетолог"];

const JOBS = [
  { id: 1, title: "Senior Frontend Developer", department: "Разработка", level: "Senior", role: "Разработчик", location: "Москва / Remote", salary: "300 000 — 420 000 ₽", posted: "2 дня назад", hot: true, tags: ["React", "TypeScript", "GraphQL"], desc: "Ищем опытного фронтенд-разработчика для работы над нашим флагманским продуктом." },
  { id: 2, title: "Product Marketing Manager", department: "Маркетинг", level: "Middle", role: "Маркетолог", location: "Москва", salary: "180 000 — 240 000 ₽", posted: "1 день назад", hot: true, tags: ["GTM", "B2B", "SaaS"], desc: "Развивайте продуктовый маркетинг и помогайте нам выходить на новые рынки." },
  { id: 3, title: "Lead Data Analyst", department: "Финансы", level: "Lead", role: "Аналитик", location: "Санкт-Петербург / Hybrid", salary: "260 000 — 350 000 ₽", posted: "3 дня назад", hot: false, tags: ["SQL", "Python", "Tableau"], desc: "Возглавьте команду аналитиков и формируйте data-driven культуру в компании." },
  { id: 4, title: "HR Business Partner", department: "HR", level: "Middle", role: "Менеджер", location: "Remote", salary: "150 000 — 200 000 ₽", posted: "5 дней назад", hot: false, tags: ["HRBP", "OKR", "People Ops"], desc: "Станьте стратегическим партнёром бизнес-подразделений в области управления людьми." },
  { id: 5, title: "Junior iOS Developer", department: "Разработка", level: "Junior", role: "Разработчик", location: "Москва", salary: "100 000 — 140 000 ₽", posted: "Сегодня", hot: true, tags: ["Swift", "UIKit", "SwiftUI"], desc: "Отличная возможность для начала карьеры в мобильной разработке." },
  { id: 6, title: "Account Director", department: "Продажи", level: "Director", role: "Менеджер", location: "Москва / Remote", salary: "400 000 — 600 000 ₽", posted: "1 неделю назад", hot: false, tags: ["Enterprise", "B2B", "CRM"], desc: "Управляйте ключевыми клиентами и стройте долгосрочные партнёрства." },
  { id: 7, title: "UX/UI Designer", department: "Разработка", level: "Middle", role: "Дизайнер", location: "Remote", salary: "170 000 — 230 000 ₽", posted: "4 дня назад", hot: false, tags: ["Figma", "Research", "Design System"], desc: "Создавайте интерфейсы, которыми пользуются миллионы людей каждый день." },
  { id: 8, title: "Operations Manager", department: "Операции", level: "Middle", role: "Менеджер", location: "Санкт-Петербург", salary: "160 000 — 210 000 ₽", posted: "2 дня назад", hot: false, tags: ["Process", "Lean", "KPI"], desc: "Оптимизируйте бизнес-процессы и повышайте операционную эффективность." },
];

const NOTIFICATIONS = [
  { id: 1, title: "Новая вакансия по вашему поиску", desc: "Senior Frontend Developer — соответствует 95%", time: "5 мин назад", read: false, type: "match" },
  { id: 2, title: "Статус отклика обновлён", desc: "Product Manager — переведён на этап собеседования", time: "2 часа назад", read: false, type: "status" },
  { id: 3, title: "Вакансия скоро закрывается", desc: "Lead Designer — осталось 2 дня", time: "Вчера", read: true, type: "alert" },
  { id: 4, title: "Рекомендованные вакансии", desc: "8 новых вакансий по вашему профилю", time: "2 дня назад", read: true, type: "recommend" },
];

const CONTACTS = [
  { name: "Анна Морозова", role: "Руководитель подбора", dept: "HR", email: "a.morozova@company.ru", phone: "+7 (495) 123-45-67" },
  { name: "Дмитрий Козлов", role: "IT Рекрутер", dept: "Разработка", email: "d.kozlov@company.ru", phone: "+7 (495) 123-45-68" },
  { name: "Светлана Иванова", role: "HR Business Partner", dept: "Маркетинг / Продажи", email: "s.ivanova@company.ru", phone: "+7 (495) 123-45-69" },
];

const notifIcon = (type: string) => {
  if (type === "match") return "Zap";
  if (type === "status") return "CheckCircle";
  if (type === "alert") return "Clock";
  return "Star";
};

const notifColor = (type: string) => {
  if (type === "match") return "text-blue-500 bg-blue-50";
  if (type === "status") return "text-green-500 bg-green-50";
  if (type === "alert") return "text-amber-500 bg-amber-50";
  return "text-violet-500 bg-violet-50";
};

export default function Index() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("Все подразделения");
  const [level, setLevel] = useState("Все уровни");
  const [role, setRole] = useState("Все должности");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [selectedJob, setSelectedJob] = useState<typeof JOBS[0] | null>(null);

  const filtered = JOBS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.desc.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "Все подразделения" || j.department === dept;
    const matchLevel = level === "Все уровни" || j.level === level;
    const matchRole = role === "Все должности" || j.role === role;
    return matchSearch && matchDept && matchLevel && matchRole;
  });

  const toggleFav = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const favJobs = JOBS.filter(j => favorites.includes(j.id));

  const tabs = [
    { id: "jobs", label: "Вакансии", icon: "Briefcase" },
    { id: "favorites", label: "Избранное", icon: "Heart", count: favorites.length },
    { id: "notifications", label: "Уведомления", icon: "Bell", count: unreadCount },
    { id: "contacts", label: "Контакты", icon: "Users" },
  ];

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center neon-glow animate-float">
              <Icon name="Briefcase" size={18} className="text-white" />
            </div>
            <div>
              <span className="font-montserrat font-extrabold text-lg text-foreground tracking-tight">Карьерный</span>
              <span className="font-montserrat font-extrabold text-lg text-primary ml-1">портал</span>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
                {tab.count ? (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none ${
                    activeTab === tab.id ? "bg-white text-primary" : "bg-primary text-white"
                  }`}>
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="status-dot" />
            <span className="text-xs text-muted-foreground hidden sm:block">Обновлено сегодня</span>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-t border-border/40">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon name={tab.icon} size={18} />
                {tab.count ? (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {tab.count}
                  </span>
                ) : null}
              </div>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ══════════ ВАКАНСИИ ══════════ */}
        {activeTab === "jobs" && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-8 pt-4">
              <h1 className="font-montserrat font-black text-4xl sm:text-5xl text-foreground mb-3 tracking-tight">
                Найди работу,<br />
                <span className="text-primary">которая вдохновляет</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                {JOBS.length} открытых позиций · Обновляется каждый день
              </p>
            </div>

            {/* Search bar */}
            <div className="glass rounded-2xl p-3 mb-6 shadow-sm flex gap-3 items-center border border-white/60">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Icon name="Search" size={18} className="text-muted-foreground flex-shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Должность, навык или ключевое слово..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={14} />
                  </button>
                )}
              </div>
              <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm flex items-center gap-2 whitespace-nowrap">
                <Icon name="Search" size={15} />
                Найти
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { label: "Подразделение", value: dept, setter: setDept, options: DEPARTMENTS, icon: "Building2" },
                { label: "Должность", value: role, setter: setRole, options: ROLES, icon: "UserCheck" },
                { label: "Уровень", value: level, setter: setLevel, options: LEVELS, icon: "TrendingUp" },
              ].map(filter => (
                <div key={filter.label} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
                    <Icon name={filter.icon} size={14} />
                  </div>
                  <select
                    value={filter.value}
                    onChange={e => filter.setter(e.target.value)}
                    className="glass border border-white/50 rounded-xl pl-8 pr-8 py-2.5 text-sm font-medium text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all hover:border-primary/40"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                  >
                    {filter.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              {(dept !== "Все подразделения" || level !== "Все уровни" || role !== "Все должности" || search) && (
                <button
                  onClick={() => { setDept("Все подразделения"); setLevel("Все уровни"); setRole("Все должности"); setSearch(""); }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
                >
                  <Icon name="X" size={13} /> Сбросить
                </button>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                Найдено: <span className="font-semibold text-foreground">{filtered.length}</span> вакансий
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full font-medium">
                  <Icon name="Flame" size={11} /> Горящие
                </span>
                — требуют быстрого закрытия
              </div>
            </div>

            {/* Job cards grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((job, idx) => (
                  <div
                    key={job.id}
                    className={`job-card glass rounded-2xl p-5 border cursor-pointer animate-slide-up stagger-${Math.min(idx + 1, 6)} ${
                      selectedJob?.id === job.id ? "border-primary/60 ring-2 ring-primary/20" : "border-white/60 hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {job.hot && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              <Icon name="Flame" size={10} /> Горящая
                            </span>
                          )}
                          <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {job.department}
                          </span>
                        </div>
                        <h3 className="font-montserrat font-bold text-foreground text-base leading-tight">{job.title}</h3>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); toggleFav(job.id); }}
                        className={`ml-2 p-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                          favorites.includes(job.id)
                            ? "text-red-500 bg-red-50"
                            : "text-muted-foreground hover:text-red-400 hover:bg-red-50"
                        }`}
                      >
                        <Icon name={favorites.includes(job.id) ? "HeartHandshake" : "Heart"} size={16} />
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.desc}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.map(tag => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>

                    <div className="border-t border-border/50 pt-3 mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="MapPin" size={12} />
                        <span>{job.location}</span>
                        <span className="mx-1 opacity-40">·</span>
                        <Icon name="TrendingUp" size={12} />
                        <span className="text-primary font-medium">{job.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">{job.salary}</span>
                        <span className="text-[11px] text-muted-foreground">{job.posted}</span>
                      </div>
                    </div>

                    {selectedJob?.id === job.id && (
                      <div className="mt-4 pt-4 border-t border-primary/20 animate-fade-in">
                        <button className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
                          <Icon name="Send" size={15} />
                          Откликнуться на вакансию
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon name="SearchX" size={28} className="text-muted-foreground" />
                </div>
                <p className="font-montserrat font-bold text-lg text-foreground mb-1">Ничего не найдено</p>
                <p className="text-muted-foreground text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
              </div>
            )}
          </div>
        )}

        {/* ══════════ ИЗБРАННОЕ ══════════ */}
        {activeTab === "favorites" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-montserrat font-black text-3xl text-foreground mb-1">Избранное</h2>
                <p className="text-muted-foreground">{favJobs.length} сохранённых вакансий</p>
              </div>
              {favJobs.length > 0 && (
                <button
                  onClick={() => setFavorites([])}
                  className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="Trash2" size={14} /> Очистить всё
                </button>
              )}
            </div>

            {favJobs.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center mx-auto mb-5 border border-red-100">
                  <Icon name="Heart" size={34} className="text-red-300" />
                </div>
                <p className="font-montserrat font-bold text-xl text-foreground mb-2">Нет сохранённых вакансий</p>
                <p className="text-muted-foreground mb-6">Нажмите на ♥ в карточке вакансии, чтобы добавить в избранное</p>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all"
                >
                  Смотреть вакансии
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {favJobs.map((job, idx) => (
                  <div
                    key={job.id}
                    className={`job-card glass rounded-2xl p-5 border border-white/60 animate-slide-up stagger-${Math.min(idx + 1, 6)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{job.department}</span>
                        <h3 className="font-montserrat font-bold text-foreground text-base mt-1">{job.title}</h3>
                      </div>
                      <button
                        onClick={() => toggleFav(job.id)}
                        className="ml-2 p-2 rounded-xl text-red-500 bg-red-50 flex-shrink-0"
                      >
                        <Icon name="HeartHandshake" size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {job.tags.map(tag => <span key={tag} className="tag-pill">{tag}</span>)}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-sm font-bold">{job.salary}</span>
                      <span className="text-xs text-primary font-medium bg-blue-50 px-2.5 py-1 rounded-full">{job.level}</span>
                    </div>
                    <button className="mt-3 w-full border border-primary text-primary py-2 rounded-xl font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center gap-2">
                      <Icon name="Send" size={14} />
                      Откликнуться
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════ УВЕДОМЛЕНИЯ ══════════ */}
        {activeTab === "notifications" && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-montserrat font-black text-3xl text-foreground mb-1">Уведомления</h2>
                <p className="text-muted-foreground">{unreadCount > 0 ? `${unreadCount} непрочитанных` : "Всё прочитано"}</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <Icon name="CheckCheck" size={14} /> Прочитать все
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notifications.map((notif, idx) => (
                <div
                  key={notif.id}
                  className={`glass rounded-2xl p-4 border transition-all duration-200 cursor-pointer animate-slide-up stagger-${Math.min(idx + 1, 4)} ${
                    notif.read ? "border-white/40 opacity-70" : "border-primary/20"
                  }`}
                  onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notifColor(notif.type)}`}>
                      <Icon name={notifIcon(notif.type)} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{notif.desc}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1.5 flex items-center gap-1">
                        <Icon name="Clock" size={10} /> {notif.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscribe block */}
            <div className="mt-8 glass rounded-2xl p-6 border border-primary/20 bg-gradient-to-br from-blue-50/50 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Icon name="Bell" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-montserrat font-bold text-foreground">Подписаться на вакансии</p>
                  <p className="text-xs text-muted-foreground">Получайте уведомления о новых позициях</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <input
                  placeholder="Ваш email"
                  className="flex-1 bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <button className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all whitespace-nowrap">
                  Подписаться
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ КОНТАКТЫ ══════════ */}
        {activeTab === "contacts" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10 pt-4">
              <h2 className="font-montserrat font-black text-4xl text-foreground mb-3">Наша команда HR</h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Мы всегда рады помочь найти позицию, которая подойдёт именно вам
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {CONTACTS.map((contact, idx) => (
                <div
                  key={contact.name}
                  className={`job-card glass rounded-2xl p-6 border border-white/60 text-center animate-slide-up stagger-${idx + 1}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-100 flex items-center justify-center mx-auto mb-4">
                    <span className="font-montserrat font-black text-xl text-primary">
                      {contact.name.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="font-montserrat font-bold text-foreground text-lg mb-0.5">{contact.name}</h3>
                  <p className="text-sm text-primary font-medium mb-1">{contact.role}</p>
                  <p className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full inline-block mb-4">{contact.dept}</p>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Icon name="Mail" size={14} className="flex-shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Icon name="Phone" size={14} className="flex-shrink-0" />
                      {contact.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="glass rounded-2xl p-8 border border-white/60 max-w-xl mx-auto">
              <h3 className="font-montserrat font-bold text-xl text-foreground mb-5 flex items-center gap-2">
                <Icon name="MessageSquare" size={20} className="text-primary" />
                Написать нам
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Имя</label>
                    <input placeholder="Иван Иванов" className="w-full bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                    <input placeholder="ivan@example.com" className="w-full bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Вакансия, которая интересует</label>
                  <input placeholder="Например: Senior Developer" className="w-full bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Сообщение</label>
                  <textarea
                    rows={4}
                    placeholder="Расскажите о себе..."
                    className="w-full bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  />
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
                  <Icon name="Send" size={16} />
                  Отправить сообщение
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
