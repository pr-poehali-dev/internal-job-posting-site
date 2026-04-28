import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const DEPARTMENTS = ["Все подразделения", "Разработка", "Маркетинг", "Продажи", "HR", "Финансы", "Операции"];
const LEVELS = ["Все уровни", "Junior", "Middle", "Senior", "Lead", "Director"];
const ROLES = ["Все должности", "Разработчик", "Дизайнер", "Аналитик", "Менеджер", "Маркетолог"];

const JOBS = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Разработка", level: "Senior", role: "Разработчик",
    location: "Москва / Remote", salary: "300 000 — 420 000 ₽", posted: "2 дня назад", hot: true,
    tags: ["React", "TypeScript", "GraphQL"],
    desc: "Ищем опытного фронтенд-разработчика для работы над нашим флагманским продуктом.",
    fullDesc: "Мы ищем Senior Frontend Developer, который станет ключевым участником команды разработки. Вы будете работать над архитектурой SPA-приложений, внедрять лучшие практики и менторить Junior-разработчиков. Наш продукт используют более 500 000 пользователей ежемесячно.",
    requirements: ["Опыт от 4 лет с React и TypeScript", "Знание GraphQL и REST API", "Опыт работы с Design System", "Понимание принципов производительности web-приложений", "Умение декомпозировать задачи и оценивать сроки"],
    conditions: ["Гибридный или удалённый формат работы", "ДМС с первого дня", "Бюджет на обучение 100 000 ₽/год", "13-я зарплата", "Корпоративный ноутбук"],
    team: "Команда из 12 разработчиков, 2 дизайнера, 1 product owner",
    recruiter: "Дмитрий Козлов",
    recruiterEmail: "d.kozlov@company.ru",
  },
  {
    id: 2,
    title: "Product Marketing Manager",
    department: "Маркетинг", level: "Middle", role: "Маркетолог",
    location: "Москва", salary: "180 000 — 240 000 ₽", posted: "1 день назад", hot: true,
    tags: ["GTM", "B2B", "SaaS"],
    desc: "Развивайте продуктовый маркетинг и помогайте нам выходить на новые рынки.",
    fullDesc: "Ищем Product Marketing Manager для развития B2B-направления. Вы будете отвечать за позиционирование продукта, разработку go-to-market стратегий и работу с командой продаж. Мы активно выходим на рынки СНГ и Европы.",
    requirements: ["Опыт в B2B SaaS маркетинге от 3 лет", "Знание методологий GTM", "Опыт создания маркетинговых материалов", "Аналитическое мышление, умение работать с данными", "Английский язык — Upper-Intermediate"],
    conditions: ["Офис в центре Москвы", "ДМС для сотрудника и семьи", "Гибкий рабочий день", "Квартальные бонусы по KPI"],
    team: "Маркетинговая команда из 8 человек",
    recruiter: "Анна Морозова",
    recruiterEmail: "a.morozova@company.ru",
  },
  {
    id: 3,
    title: "Lead Data Analyst",
    department: "Финансы", level: "Lead", role: "Аналитик",
    location: "Санкт-Петербург / Hybrid", salary: "260 000 — 350 000 ₽", posted: "3 дня назад", hot: false,
    tags: ["SQL", "Python", "Tableau"],
    desc: "Возглавьте команду аналитиков и формируйте data-driven культуру в компании.",
    fullDesc: "Мы ищем опытного Lead Data Analyst, который выстроит аналитическую инфраструктуру компании и поможет бизнесу принимать решения на основе данных. В подчинении 3 аналитика, плотная работа с финансовым блоком и C-level.",
    requirements: ["Опыт в аналитике от 5 лет", "Продвинутый SQL, Python (pandas, numpy)", "Опыт с BI-инструментами (Tableau/Power BI)", "Лидерский опыт, умение выстраивать процессы", "Понимание финансовой отчётности"],
    conditions: ["Гибридный формат (2 дня в офисе)", "Расширенный ДМС", "Спортивная компенсация 30 000 ₽/год", "Участие в прибыли компании"],
    team: "Команда аналитики: 4 человека + стажёры",
    recruiter: "Светлана Иванова",
    recruiterEmail: "s.ivanova@company.ru",
  },
  {
    id: 4,
    title: "HR Business Partner",
    department: "HR", level: "Middle", role: "Менеджер",
    location: "Remote", salary: "150 000 — 200 000 ₽", posted: "5 дней назад", hot: false,
    tags: ["HRBP", "OKR", "People Ops"],
    desc: "Станьте стратегическим партнёром бизнес-подразделений в области управления людьми.",
    fullDesc: "HRBP для работы с командами разработки и продуктовым департаментом (150+ сотрудников). Вы будете сопровождать руководителей в вопросах HR, внедрять OKR, вести Performance Review и развивать корпоративную культуру.",
    requirements: ["Опыт в HR BP от 3 лет", "Знание методологий OKR, Performance Management", "Опыт работы в IT-компании приветствуется", "Развитые коммуникативные навыки"],
    conditions: ["Полностью удалённая работа", "Компенсация домашнего офиса", "Гибкий график", "Бюджет на HR-инструменты"],
    team: "HR-команда: 6 человек",
    recruiter: "Анна Морозова",
    recruiterEmail: "a.morozova@company.ru",
  },
  {
    id: 5,
    title: "Junior iOS Developer",
    department: "Разработка", level: "Junior", role: "Разработчик",
    location: "Москва", salary: "100 000 — 140 000 ₽", posted: "Сегодня", hot: true,
    tags: ["Swift", "UIKit", "SwiftUI"],
    desc: "Отличная возможность для начала карьеры в мобильной разработке.",
    fullDesc: "Открываем позицию Junior iOS Developer для выпускников и разработчиков с коммерческим опытом до 1 года. Вы будете работать в паре с Senior-разработчиком, участвовать в code review и быстро расти внутри компании.",
    requirements: ["Знание Swift и UIKit", "Понимание MVC/MVVM", "Опыт работы с Xcode", "Желание развиваться в iOS-разработке", "Будет плюсом: SwiftUI, CoreData"],
    conditions: ["Офис в Москве (м. Павелецкая)", "Программа менторства", "Курсы и конференции за счёт компании", "Возможность быстрого роста до Middle"],
    team: "iOS-команда: 5 разработчиков",
    recruiter: "Дмитрий Козлов",
    recruiterEmail: "d.kozlov@company.ru",
  },
  {
    id: 6,
    title: "Account Director",
    department: "Продажи", level: "Director", role: "Менеджер",
    location: "Москва / Remote", salary: "400 000 — 600 000 ₽", posted: "1 неделю назад", hot: false,
    tags: ["Enterprise", "B2B", "CRM"],
    desc: "Управляйте ключевыми клиентами и стройте долгосрочные партнёрства.",
    fullDesc: "Account Director для управления портфелем Enterprise-клиентов с оборотом 500+ млн ₽. Вы будете выстраивать стратегические отношения с C-level клиентов, развивать аккаунты и участвовать в разработке коммерческой стратегии компании.",
    requirements: ["Опыт в Enterprise B2B продажах от 7 лет", "Подтверждённые кейсы закрытия крупных сделок", "Навыки ведения сложных переговоров", "Опыт работы с CRM (Salesforce/AmoCRM)", "Высокий уровень деловой коммуникации"],
    conditions: ["Конкурентный оклад + бонус от сделок", "Представительские расходы", "Корпоративный автомобиль или компенсация", "Расширенный соцпакет"],
    team: "Отдел продаж: 15 человек",
    recruiter: "Светлана Иванова",
    recruiterEmail: "s.ivanova@company.ru",
  },
  {
    id: 7,
    title: "UX/UI Designer",
    department: "Разработка", level: "Middle", role: "Дизайнер",
    location: "Remote", salary: "170 000 — 230 000 ₽", posted: "4 дня назад", hot: false,
    tags: ["Figma", "Research", "Design System"],
    desc: "Создавайте интерфейсы, которыми пользуются миллионы людей каждый день.",
    fullDesc: "Ищем UX/UI Designer для работы над несколькими продуктами компании. Вы будете проводить UX-исследования, разрабатывать пользовательские сценарии, создавать прототипы и поддерживать Design System. Тесное взаимодействие с product и разработкой.",
    requirements: ["Опыт в UX/UI дизайне от 3 лет", "Уверенное владение Figma", "Опыт проведения UX-исследований", "Навыки создания и поддержки Design System", "Портфолио с кейсами"],
    conditions: ["Полностью удалённая работа", "Гибкий график (overlap 12-18 МСК)", "Бюджет на инструменты и обучение", "Конференции за счёт компании"],
    team: "Продуктовая команда: 3 дизайнера",
    recruiter: "Анна Морозова",
    recruiterEmail: "a.morozova@company.ru",
  },
  {
    id: 8,
    title: "Operations Manager",
    department: "Операции", level: "Middle", role: "Менеджер",
    location: "Санкт-Петербург", salary: "160 000 — 210 000 ₽", posted: "2 дня назад", hot: false,
    tags: ["Process", "Lean", "KPI"],
    desc: "Оптимизируйте бизнес-процессы и повышайте операционную эффективность.",
    fullDesc: "Operations Manager для управления операционными процессами в петербургском офисе. Вы будете описывать и автоматизировать бизнес-процессы, внедрять Lean-подходы и строить систему KPI для операционного блока.",
    requirements: ["Опыт в operations/project management от 4 лет", "Знание методологий Lean, Six Sigma", "Опыт внедрения KPI-систем", "Аналитическое мышление", "Опыт работы в ERP-системах"],
    conditions: ["Офис в Санкт-Петербурге (м. Невский проспект)", "Официальное трудоустройство", "ДМС с первого дня", "Квартальные премии"],
    team: "Операционный блок: 20 человек",
    recruiter: "Светлана Иванова",
    recruiterEmail: "s.ivanova@company.ru",
  },
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
  if (type === "match") return "text-primary bg-primary/10";
  if (type === "status") return "text-green-500 bg-green-50";
  if (type === "alert") return "text-amber-500 bg-amber-50";
  return "text-violet-500 bg-violet-50";
};

type Job = typeof JOBS[0];

// ─── Job Detail Drawer ───────────────────────────────────────────────
function JobDrawer({ job, onClose, onApply }: { job: Job; onClose: () => void; onApply: (job: Job) => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-xl z-50 flex flex-col shadow-2xl"
        style={{ animation: "slideInRight 0.35s cubic-bezier(0.4,0,0.2,1) forwards" }}>
        <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl border-l border-border overflow-hidden">

          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {job.hot && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Icon name="Flame" size={10} /> Горящая
                    </span>
                  )}
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">{job.department}</span>
                  <span className="text-xs font-medium text-primary bg-primary/5 border border-primary/20 px-2.5 py-0.5 rounded-full">{job.level}</span>
                </div>
                <h2 className="font-montserrat font-black text-2xl text-foreground leading-tight">{job.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex-shrink-0 mt-1"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Icon name="MapPin" size={14} className="text-primary" />
                {job.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="Clock" size={14} className="text-primary" />
                {job.posted}
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="Users" size={14} className="text-primary" />
                {job.team}
              </div>
            </div>

            {/* Salary */}
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
              <Icon name="Banknote" size={16} className="text-green-600" />
              <span className="font-montserrat font-bold text-green-700 text-lg">{job.salary}</span>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7">

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {job.tags.map(tag => (
                <span key={tag} className="tag-pill text-sm px-3.5 py-1">{tag}</span>
              ))}
            </div>

            {/* About */}
            <section>
              <h3 className="font-montserrat font-bold text-base text-foreground mb-2 flex items-center gap-2">
                <Icon name="Info" size={16} className="text-primary" /> О вакансии
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.fullDesc}</p>
            </section>

            {/* Requirements */}
            <section>
              <h3 className="font-montserrat font-bold text-base text-foreground mb-3 flex items-center gap-2">
                <Icon name="CheckSquare" size={16} className="text-primary" /> Требования
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{i + 1}</span>
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            {/* Conditions */}
            <section>
              <h3 className="font-montserrat font-bold text-base text-foreground mb-3 flex items-center gap-2">
                <Icon name="Gift" size={16} className="text-primary" /> Условия работы
              </h3>
              <ul className="space-y-2">
                {job.conditions.map((cond, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Icon name="Check" size={14} className="text-green-500 flex-shrink-0" />
                    {cond}
                  </li>
                ))}
              </ul>
            </section>

            {/* Recruiter */}
            <section className="glass rounded-2xl p-4 border border-white/60">
              <p className="text-xs font-medium text-muted-foreground mb-2">Ответственный рекрутер</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-violet-100 flex items-center justify-center">
                  <span className="font-montserrat font-black text-sm text-primary">
                    {job.recruiter.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{job.recruiter}</p>
                  <a href={`mailto:${job.recruiterEmail}`} className="text-xs text-primary hover:underline">{job.recruiterEmail}</a>
                </div>
              </div>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="flex-shrink-0 p-5 border-t border-border bg-white/80 backdrop-blur-sm">
            <button
              onClick={() => onApply(job)}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-montserrat font-bold text-base hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg neon-glow"
            >
              <Icon name="Send" size={18} />
              Откликнуться на вакансию
            </button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Ваши данные из LDAP будут автоматически добавлены к отклику
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const SEND_APPLY_URL = "https://functions.poehali.dev/10bd6eb1-3344-431e-bb69-dfa02f4a8437";

// ─── Apply Modal ─────────────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [comment, setComment] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Укажите ФИО и email");
      return;
    }
    setErrorMsg("");
    setStatus("sending");

    let resume_base64 = "";
    let resume_filename = "";
    if (resumeFile) {
      const buf = await resumeFile.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      bytes.forEach(b => { binary += String.fromCharCode(b); });
      resume_base64 = btoa(binary);
      resume_filename = resumeFile.name;
    }

    try {
      const res = await fetch(SEND_APPLY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: job.title,
          recruiter_email: job.recruiterEmail,
          full_name: fullName,
          email,
          department,
          comment,
          resume_base64,
          resume_filename,
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Ошибка отправки. Попробуйте позже.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Нет соединения. Проверьте интернет и попробуйте снова.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="glass bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-slide-up border border-white/60">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <Icon name="CheckCircle" size={40} className="text-green-500" />
            </div>
            <h3 className="font-montserrat font-black text-2xl text-foreground mb-2">Отклик отправлен!</h3>
            <p className="text-muted-foreground text-sm mb-1">Рекрутер <strong>{job.recruiter}</strong> получил ваш отклик</p>
            <p className="text-muted-foreground text-sm mb-6">на вакансию <strong>«{job.title}»</strong></p>
            <button onClick={onClose} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all">
              Отлично!
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-border" style={{ maxHeight: "90vh", overflowY: "auto" }}>
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Отклик на вакансию</p>
                <h3 className="font-montserrat font-black text-xl text-foreground">{job.title}</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all">
                <Icon name="X" size={18} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Данные сотрудника */}
            <div className="glass rounded-xl p-4 border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="User" size={14} className="text-primary" />
                <p className="text-xs font-semibold text-primary">Ваши данные</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">ФИО <span className="text-red-400">*</span></label>
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Корпоративный email <span className="text-red-400">*</span></label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="i.ivanov@company.ru"
                    type="email"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Подразделение</label>
                  <input
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="Например: Разработка"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            {/* Resume upload */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Прикрепить резюме</label>
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
                resumeFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
              }`}>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setResumeFile(e.target.files?.[0] || null)} />
                {resumeFile ? (
                  <div className="text-center">
                    <Icon name="FileCheck" size={28} className="text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">{resumeFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(resumeFile.size / 1024).toFixed(0)} КБ</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Icon name="Upload" size={28} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">PDF, DOC или DOCX</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">до 10 МБ</p>
                  </div>
                )}
              </label>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Сопроводительное письмо <span className="font-normal text-muted-foreground">(необязательно)</span></label>
              <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Расскажите, почему вас интересует эта вакансия..."
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
              />
            </div>

            {/* Error */}
            {(status === "error" || errorMsg) && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} className="flex-shrink-0" />
                {errorMsg || "Ошибка отправки. Попробуйте позже."}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={status === "sending"}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-montserrat font-bold text-base hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
            >
              {status === "sending" ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Отправляем...
                </>
              ) : (
                <>
                  <Icon name="Send" size={18} />
                  Отправить отклик
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              Письмо уйдёт на <strong>vacancy@company.company</strong> с темой «{job.title}»
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function Index() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("Все подразделения");
  const [level, setLevel] = useState("Все уровни");
  const [role, setRole] = useState("Все должности");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [drawerJob, setDrawerJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const filtered = JOBS.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.desc.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q));
    const matchDept = dept === "Все подразделения" || j.department === dept;
    const matchLevel = level === "Все уровни" || j.level === level;
    const matchRole = role === "Все должности" || j.role === role;
    return matchSearch && matchDept && matchLevel && matchRole;
  });

  const toggleFav = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const favJobs = JOBS.filter(j => favorites.includes(j.id));

  const tabs = [
    { id: "jobs", label: "Вакансии", icon: "Briefcase" },
    { id: "favorites", label: "Избранное", icon: "Heart", count: favorites.length },
    { id: "notifications", label: "Уведомления", icon: "Bell", count: unreadCount },
    { id: "contacts", label: "Контакты", icon: "Users" },
  ];

  const JobCard = ({ job, idx }: { job: Job; idx: number }) => (
    <div
      key={job.id}
      className={`job-card glass rounded-2xl p-5 border border-white/60 cursor-pointer hover:border-primary/30 animate-slide-up stagger-${Math.min(idx + 1, 6)}`}
      onClick={() => setDrawerJob(job)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {job.hot && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Icon name="Flame" size={10} /> Горящая
              </span>
            )}
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{job.department}</span>
          </div>
          <h3 className="font-montserrat font-bold text-foreground text-base leading-tight">{job.title}</h3>
        </div>
        <button
          onClick={e => toggleFav(job.id, e)}
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
        {job.tags.map(tag => <span key={tag} className="tag-pill">{tag}</span>)}
      </div>
      <div className="border-t border-border/50 pt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="MapPin" size={12} /><span>{job.location}</span>
          <span className="mx-1 opacity-40">·</span>
          <Icon name="TrendingUp" size={12} /><span className="text-primary font-medium">{job.level}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">{job.salary}</span>
          <span className="text-[11px] text-muted-foreground">{job.posted}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
        <Icon name="Eye" size={12} /> Подробнее
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="glass sticky top-0 z-30 border-b border-white/40 shadow-sm">
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
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
                {tab.count ? (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none ${activeTab === tab.id ? "bg-white text-primary" : "bg-primary text-white"}`}>
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
        <div className="md:hidden flex border-t border-border/40">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className="relative">
                <Icon name={tab.icon} size={18} />
                {tab.count ? (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">{tab.count}</span>
                ) : null}
              </div>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ══ ВАКАНСИИ ══ */}
        {activeTab === "jobs" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8 pt-4">
              <h1 className="font-montserrat font-black text-4xl sm:text-5xl text-foreground mb-3 tracking-tight">
                Найди работу,<br /><span className="text-primary">которая вдохновляет</span>
              </h1>
              <p className="text-muted-foreground text-lg">{JOBS.length} открытых позиций · Обновляется каждый день</p>
            </div>

            <div className="glass rounded-2xl p-3 mb-6 shadow-sm flex gap-3 items-center border border-white/60">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Icon name="Search" size={18} className="text-muted-foreground flex-shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Должность, навык или ключевое слово..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                {search && <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><Icon name="X" size={14} /></button>}
              </div>
              <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm flex items-center gap-2 whitespace-nowrap">
                <Icon name="Search" size={15} /> Найти
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { value: dept, setter: setDept, options: DEPARTMENTS, icon: "Building2" },
                { value: role, setter: setRole, options: ROLES, icon: "UserCheck" },
                { value: level, setter: setLevel, options: LEVELS, icon: "TrendingUp" },
              ].map((filter, i) => (
                <div key={i} className="relative">
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

            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">Найдено: <span className="font-semibold text-foreground">{filtered.length}</span> вакансий</p>
              <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full font-medium text-xs">
                <Icon name="Flame" size={11} /> Горящие — быстрое закрытие
              </span>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((job, idx) => <JobCard key={job.id} job={job} idx={idx} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon name="SearchX" size={28} className="text-muted-foreground" />
                </div>
                <p className="font-montserrat font-bold text-lg text-foreground mb-1">Ничего не найдено</p>
                <p className="text-muted-foreground text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
              </div>
            )}
          </div>
        )}

        {/* ══ ИЗБРАННОЕ ══ */}
        {activeTab === "favorites" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-montserrat font-black text-3xl text-foreground mb-1">Избранное</h2>
                <p className="text-muted-foreground">{favJobs.length} сохранённых вакансий</p>
              </div>
              {favJobs.length > 0 && (
                <button onClick={() => setFavorites([])} className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1.5">
                  <Icon name="Trash2" size={14} /> Очистить всё
                </button>
              )}
            </div>
            {favJobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center mx-auto mb-5 border border-red-100">
                  <Icon name="Heart" size={34} className="text-red-300" />
                </div>
                <p className="font-montserrat font-bold text-xl text-foreground mb-2">Нет сохранённых вакансий</p>
                <p className="text-muted-foreground mb-6">Нажмите на ♥ в карточке вакансии, чтобы добавить в избранное</p>
                <button onClick={() => setActiveTab("jobs")} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
                  Смотреть вакансии
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {favJobs.map((job, idx) => <JobCard key={job.id} job={job} idx={idx} />)}
              </div>
            )}
          </div>
        )}

        {/* ══ УВЕДОМЛЕНИЯ ══ */}
        {activeTab === "notifications" && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-montserrat font-black text-3xl text-foreground mb-1">Уведомления</h2>
                <p className="text-muted-foreground">{unreadCount > 0 ? `${unreadCount} непрочитанных` : "Всё прочитано"}</p>
              </div>
              {unreadCount > 0 && (
                <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1.5 font-medium">
                  <Icon name="CheckCheck" size={14} /> Прочитать все
                </button>
              )}
            </div>
            <div className="space-y-3">
              {notifications.map((notif, idx) => (
                <div
                  key={notif.id}
                  className={`glass rounded-2xl p-4 border transition-all duration-200 cursor-pointer animate-slide-up stagger-${Math.min(idx + 1, 4)} ${notif.read ? "border-white/40 opacity-70" : "border-primary/20"}`}
                  onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notifColor(notif.type)}`}>
                      <Icon name={notifIcon(notif.type)} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>{notif.title}</p>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{notif.desc}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1.5 flex items-center gap-1"><Icon name="Clock" size={10} /> {notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 glass rounded-2xl p-6 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Icon name="Bell" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-montserrat font-bold text-foreground">Подписаться на вакансии</p>
                  <p className="text-xs text-muted-foreground">Получайте уведомления о новых позициях</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input placeholder="Ваш email" className="flex-1 bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <button className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all whitespace-nowrap">Подписаться</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ КОНТАКТЫ ══ */}
        {activeTab === "contacts" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10 pt-4">
              <h2 className="font-montserrat font-black text-4xl text-foreground mb-3">Наша команда HR</h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">Мы всегда рады помочь найти позицию, которая подойдёт именно вам</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {CONTACTS.map((contact, idx) => (
                <div key={contact.name} className={`job-card glass rounded-2xl p-6 border border-white/60 text-center animate-slide-up stagger-${idx + 1}`}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-100 flex items-center justify-center mx-auto mb-4">
                    <span className="font-montserrat font-black text-xl text-primary">{contact.name.split(" ").map((n: string) => n[0]).join("")}</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-foreground text-lg mb-0.5">{contact.name}</h3>
                  <p className="text-sm text-primary font-medium mb-1">{contact.role}</p>
                  <p className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full inline-block mb-4">{contact.dept}</p>
                  <div className="space-y-2">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="Mail" size={14} className="flex-shrink-0" /><span className="truncate">{contact.email}</span>
                    </a>
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="Phone" size={14} className="flex-shrink-0" />{contact.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass rounded-2xl p-8 border border-white/60 max-w-xl mx-auto">
              <h3 className="font-montserrat font-bold text-xl text-foreground mb-5 flex items-center gap-2">
                <Icon name="MessageSquare" size={20} className="text-primary" /> Написать нам
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Имя</label>
                    <input placeholder="Иван Иванов" className="w-full bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                    <input placeholder="ivan@example.com" className="w-full bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Вакансия</label>
                  <input placeholder="Например: Senior Developer" className="w-full bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Сообщение</label>
                  <textarea rows={4} placeholder="Расскажите о себе..." className="w-full bg-white/70 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
                  <Icon name="Send" size={16} /> Отправить сообщение
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Drawer + Apply Modal */}
      {drawerJob && (
        <JobDrawer
          job={drawerJob}
          onClose={() => setDrawerJob(null)}
          onApply={(job) => { setDrawerJob(null); setApplyJob(job); }}
        />
      )}
      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
        />
      )}
    </div>
  );
}