import { useEffect, useRef, useState, type FormEvent } from "react";
import "./portfolio.css";

type Theme = "dark" | "light";
type Feedback = { type: "error" | "warning" | "success"; message: string } | null;

const FORMSPREE_ACTION = "https://formspree.io/f/TU_ID";

const IMAGES = {
  profile: "/images/gabriel-gonzalez.svg",
  churn: "/images/customer-churn.svg",
  cyber: "/images/cybersecurity-log-analyzer.svg",
  ecommerce: "/images/ecommerce-portfolio.svg",
};

function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const system: Theme =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    setTheme(saved || system);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const action = form.getAttribute("action") || "";
    setFeedback(null);

    if (!action || action.includes("TU_ID")) {
      e.preventDefault();
      setFeedback({
        type: "warning",
        message:
          "⚠️ El formulario no está configurado. Reemplaza TU_ID por tu endpoint de Formspree o Power Automate.",
      });
      return;
    }

    if (action.startsWith("https://formspree.io") || action.includes("logic.azure.com")) {
      e.preventDefault();
      setSending(true);
      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error();
        setFeedback({ type: "success", message: "✅ ¡Mensaje enviado con éxito! Me pondré en contacto pronto." });
        form.reset();
      } catch {
        setFeedback({ type: "error", message: "❌ Hubo un problema al enviar el mensaje. Inténtalo de nuevo." });
      } finally {
        setSending(false);
      }
    }
  };

  const navClick = () => setMenuOpen(false);
  const year = new Date().getFullYear();

  return (
    <>
      <div className="glow-overlay" aria-hidden="true"></div>
      <div className="data-grid-overlay" aria-hidden="true"></div>

      <header id="header" className={`header-premium${scrolled ? " is-scrolled" : ""}`}>
        <nav className="container">
          <div className="logo">
            GABRIEL<span className="accent-text">GONZÁLEZ</span>.
          </div>
          <ul className={`nav-links${menuOpen ? " active" : ""}`} id="nav-menu" role="list">
            <li><a href="#inicio" onClick={navClick}>Inicio</a></li>
            <li><a href="#soluciones" onClick={navClick}>Soluciones</a></li>
            <li><a href="#proyectos" onClick={navClick}>Proyectos</a></li>
            <li><a href="#experiencia" onClick={navClick}>Experiencia</a></li>
            <li><a href="#stack" onClick={navClick}>Stack</a></li>
            <li><a href="#contacto" className="btn-nav-cta" onClick={navClick}>Contactar</a></li>
          </ul>
          <div className="nav-controls">
            <button
              id="theme-toggle"
              className="theme-toggle"
              aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
              onClick={toggleTheme}
            >
              <i className={theme === "dark" ? "fas fa-moon" : "fas fa-sun"}></i>
            </button>
            <button
              className="hamburger"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section id="inicio" className="hero">
          <div className="container">
            <div className="hero-layout">
              <div className="hero-content">
                <div className="hero-badge">Data Engineer Industrial | BI & Automatización</div>
                <h1>
                  Datos industriales e integración para decisiones{" "}
                  <span className="text-gradient">técnicas confiables.</span>
                </h1>
                <p className="lead">
                  Especialista en centralizar información operacional dispersa, automatizar reportes y construir
                  indicadores trazables para la continuidad técnica en Minería y Energía.
                </p>
                <div className="hero-btns">
                  <a href="#contacto" className="btn-primary">Hablemos de tu Proyecto</a>
                  <a href="#proyectos" className="btn-secondary">Revisar Casos de Éxito</a>
                </div>
                <div className="hero-trust">
                  <span className="trust-label">Experticia Sectorial:</span>
                  <div className="trust-icons">
                    <div className="trust-item" title="Experiencia en procesos mineros"><i className="fas fa-industry"></i> Minería</div>
                    <div className="trust-item" title="Gestión de datos energéticos"><i className="fas fa-bolt"></i> Energía</div>
                    <div className="trust-item" title="Soluciones para el sector público"><i className="fas fa-landmark"></i> Público</div>
                  </div>
                </div>
              </div>
              <div className="hero-visual">
                <div className="photo-card premium-border">
                  <img
                    src={IMAGES.profile}
                    alt="Gabriel González Iriarte - Ingeniero de Datos Industriales y BI"
                    className="profile-photo"
                    decoding="async"
                  />
                  <div className="photo-info-badge">
                    <i className="fas fa-shield-alt"></i>
                    <span>+5 años exp.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="perfil" className="section bg-alt">
          <div className="container">
            <div className="profile-grid">
              <div className="profile-narrative">
                <h2 className="section-title">Perfil Profesional</h2>
                <p>
                  Ingeniero Informático con más de 5 años de experiencia técnica en sectores críticos. Mi enfoque
                  une la rigurosidad de la ingeniería de software y la ciberseguridad con las necesidades
                  operacionales de la minería y energía. Me especializo en transformar entornos de datos complejos
                  y dispersos en sistemas de información estructurados y confiables.
                </p>
                <p>
                  Cuento con un sólido dominio en la integración de datos operacionales (SAP, SQL, APIs, Sensores),
                  desarrollo de flujos ETL y analítica avanzada en Power BI. Mi objetivo es eliminar la
                  incertidumbre técnica mediante la automatización de procesos y la garantía de trazabilidad y
                  calidad (QA/QC) en cada indicador de gestión de activos y mantenimiento.
                </p>
              </div>
              <div className="profile-stats">
                <div className="stat-mini-card">
                  <i className="fas fa-database"></i>
                  <h4>Datos Industriales</h4>
                  <p>Integración de SAP, SQL, fuentes operacionales, QA/QC y BI para mantenimiento y activos.</p>
                </div>
                <div className="stat-mini-card">
                  <i className="fas fa-code"></i>
                  <h4>Software & Automatización</h4>
                  <p>Base en programación, desarrollo web, ETL, formularios, apps internas y automatización de procesos.</p>
                </div>
                <div className="stat-mini-card">
                  <i className="fas fa-shield-alt"></i>
                  <h4>Seguridad & Gestión</h4>
                  <p>Formación en ciberseguridad, ciberdefensa, protección de datos, PMBOK y dirección de proyectos.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="soluciones" className="section">
          <div className="container">
            <h2 className="section-title centered">Qué problemas resuelvo</h2>
            <div className="bento-grid">
              <div className="bento-item tall">
                <div className="bento-content">
                  <i className="fas fa-network-wired"></i>
                  <h3>Integración de Datos Operacionales</h3>
                  <p>
                    Resuelvo el problema de la información fragmentada conectando datos provenientes de SAP, SQL,
                    APIs, sensores y formularios digitales. Centralizo fuentes dispersas en una arquitectura
                    única, trazable y confiable para el análisis técnico.
                  </p>
                  <span className="bento-tag">Conectividad & ETL</span>
                </div>
              </div>
              <div className="bento-item wide">
                <div className="bento-content">
                  <i className="fas fa-chart-line"></i>
                  <h3>BI y Reportabilidad Técnica</h3>
                  <p>
                    Transformo registros complejos en dashboards especializados para mantenimiento, confiabilidad
                    y gestión de activos. Diseño indicadores (KPIs) en Power BI que permiten visualizar el estado
                    real de la operación y facilitan decisiones críticas basadas en evidencia.
                  </p>
                </div>
              </div>
              <div className="bento-item">
                <div className="bento-content">
                  <i className="fas fa-robot"></i>
                  <h3>Automatización de Reportes</h3>
                  <p>
                    Elimino la carga de trabajo manual y el error humano mediante la automatización de flujos,
                    consolidación de datos y generación de reportes automáticos con Python y Power Automate.
                  </p>
                </div>
              </div>
              <div className="bento-item">
                <div className="bento-content">
                  <i className="fas fa-shield-alt"></i>
                  <h3>Calidad y Seguridad de Datos</h3>
                  <p>
                    Aplico protocolos de QA/QC para garantizar la integridad y exactitud de los datos técnicos.
                    Integro criterios de ciberseguridad en cada solución para proteger la información crítica del
                    negocio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="proyectos" className="section bg-alt">
          <div className="container">
            <div className="projects-intro">
              <h2 className="section-title">Soluciones de Datos para Decisiones Críticas</h2>
              <p className="section-subtitle">
                Evidencia técnica de integración, automatización y análisis de datos operacionales para la
                continuidad del negocio.
              </p>
            </div>

            <article className="featured-industrial-card">
              <div className="featured-industrial-content">
                <div className="project-meta">
                  <span className="badge highlight">Caso Industrial Anonimizado</span>
                </div>
                <h3>Asset Health & SAP Integration</h3>
                <p className="featured-description">
                  Proyecto enfocado en la integración de datos de condición de activos, registros operacionales y
                  referencias SAP para mejorar la trazabilidad, lectura del estado de salud de activos críticos y
                  soporte a decisiones de mantenimiento y confiabilidad.
                </p>
                <div className="featured-mini-grid">
                  <div className="mini-card">
                    <span className="mini-label">Problema</span>
                    <span className="mini-value">
                      Datos operacionales dispersos, reportes manuales y baja trazabilidad de la información
                      técnica.
                    </span>
                  </div>
                  <div className="mini-card">
                    <span className="mini-label">Solución</span>
                    <span className="mini-value">
                      Diseño de flujos ETL, modelamiento de datos, integración SAP/API/SQL y validación QA/QC.
                    </span>
                  </div>
                  <div className="mini-card">
                    <span className="mini-label">Valor</span>
                    <span className="mini-value">
                      Información confiable para decisiones técnicas y reducción de la dependencia de procesos
                      manuales.
                    </span>
                  </div>
                </div>
                <div className="project-tech">
                  <span>SAP Integration</span><span>Python</span><span>Power BI</span><span>ETL</span><span>QA/QC de datos</span>
                </div>
                <div className="featured-industrial-footer">
                  <span className="status-note">
                    <i className="fas fa-lock"></i> Caso anonimizado por confidencialidad operacional
                  </span>
                  <a href="#contacto" className="btn-secondary">
                    Conversemos sobre un caso similar <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </article>

            <div className="projects-grid-modern">
              <article className="project-card-premium">
                <div className="project-visual">
                  <img src={IMAGES.churn} alt="Dashboard de predicción de abandono de clientes con Machine Learning" loading="lazy" />
                </div>
                <div className="project-info">
                  <span className="badge">Data Science / ML</span>
                  <h3>Customer Churn Analysis</h3>
                  <p>
                    Procesamiento de datos, análisis de patrones y desarrollo de un modelo de riesgo con
                    visualización interactiva para la toma de decisiones.
                  </p>
                  <div className="project-tech"><span>Python</span><span>Scikit-learn</span><span>Streamlit</span></div>
                  <div className="project-links">
                    <a href="https://customerchurnproject-kff9bo5z52ugo7ftafqsmx.streamlit.app/" target="_blank" rel="noopener noreferrer">
                      Demo <i className="fas fa-external-link-alt"></i>
                    </a>
                    <a href="https://github.com/ggonzaleziriarte99/customer_churn_project" target="_blank" rel="noopener noreferrer">
                      Código <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </article>

              <article className="project-card-premium">
                <div className="project-visual">
                  <img src={IMAGES.cyber} alt="Análisis automatizado de logs de ciberseguridad" loading="lazy" />
                </div>
                <div className="project-info">
                  <span className="badge">Ciberseguridad</span>
                  <h3>Security Log Analyzer</h3>
                  <p>
                    Limpieza, análisis y visualización automatizada de logs para la detección temprana de
                    anomalías o patrones de acceso no autorizados.
                  </p>
                  <div className="project-tech"><span>Python</span><span>Pandas</span><span>Plotly</span></div>
                  <div className="project-links">
                    <a href="https://cybersecurity-log-analyzer-mfea3u24d6veeammtlpcm7.streamlit.app/" target="_blank" rel="noopener noreferrer">
                      Demo <i className="fas fa-external-link-alt"></i>
                    </a>
                    <a href="https://github.com/ggonzaleziriarte99/Cybersecurity-Log-Analyzer" target="_blank" rel="noopener noreferrer">
                      Código <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </article>

              <article className="project-card-premium">
                <div className="project-visual">
                  <img src={IMAGES.ecommerce} alt="Demo de interfaz frontend para comercio electrónico moderno" loading="lazy" />
                </div>
                <div className="project-info">
                  <span className="badge">Frontend</span>
                  <h3>NovaCommerce Web Demo</h3>
                  <p>
                    Aplicación web demostrativa desarrollada con una estructura modular, diseño responsive y
                    enfoque en la experiencia de usuario (UX).
                  </p>
                  <div className="project-tech"><span>JavaScript</span><span>HTML5</span><span>CSS3</span></div>
                  <div className="project-links">
                    <a href="https://ggonzaleziriarte99.github.io/ecommerce-portfolio/" target="_blank" rel="noopener noreferrer">
                      Demo <i className="fas fa-external-link-alt"></i>
                    </a>
                    <a href="https://github.com/ggonzaleziriarte99/ecommerce-portfolio" target="_blank" rel="noopener noreferrer">
                      Código <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="experiencia" className="section">
          <div className="container">
            <h2 className="section-title">Experiencia Profesional</h2>
            <div className="timeline-container">
              <div className="timeline-item-premium">
                <span className="time">Feb 2024 - Presente</span>
                <h4>Planificador Predictivo / Data Engineer de Activos</h4>
                <p className="company">Guacolda Energía SpA / Symmetric</p>
                <p className="description">
                  Diseño e implementación de modelos de datos para análisis de condición de activos integrando
                  fuentes operacionales (SAP, EtaPro, ACS, Kizeo) mediante procesos ETL. Desarrollo de dashboards
                  en Power BI y Python para monitoreo de salud de activos y apoyo a la planificación de
                  mantenimiento bajo estándar ISO 55001.
                </p>
                <div className="project-tech"><span>Python</span><span>SAP Integration</span><span>Power BI</span><span>ETL</span><span>ISO 55001</span></div>
              </div>
              <div className="timeline-item-premium">
                <span className="time">Nov 2023 - Feb 2024</span>
                <h4>Soporte Planificación / Integración de Datos</h4>
                <p className="company">Guacolda Energía SpA</p>
                <p className="description">
                  Digitalización de procesos operacionales y captura estructurada de datos en terreno.
                  Implementación de integraciones mediante Python y APIs para conectar sistemas operacionales con
                  SAP, automatizando flujos de datos para reportabilidad técnica y gestión de activos.
                </p>
                <div className="project-tech"><span>Python</span><span>APIs</span><span>SAP</span><span>Digitalización</span></div>
              </div>
              <div className="timeline-item-premium">
                <span className="time">Ago 2023 - Nov 2023</span>
                <h4>Análisis de Datos Mineros (Practicante)</h4>
                <p className="company">Compañía Minera del Pacífico (CMP)</p>
                <p className="description">
                  Análisis de datos operacionales de mantenimiento minero utilizando Python y R. Procesamiento de
                  información SAP para la generación de indicadores de gestión y validación QA/QC de datos
                  recolectados en terreno, asegurando trazabilidad y coherencia con la operación.
                </p>
                <div className="project-tech"><span>Python</span><span>R</span><span>SAP</span><span>QA/QC de Datos</span></div>
              </div>
              <div className="timeline-item-premium">
                <span className="time">May 2021 - Ago 2023</span>
                <h4>Técnico Informático / Gestión BD</h4>
                <p className="company">Departamento de Salud Municipal Vallenar</p>
                <p className="description">
                  Administración de bases de datos relacionales (MySQL/SQL Server) y desarrollo de sistemas
                  internos en C# y PHP/Laravel. Digitalización de procesos manuales y desarrollo de un sistema de
                  inventario TI con trazabilidad de activos y gestión documental.
                </p>
                <div className="project-tech"><span>SQL Server</span><span>PHP/Laravel</span><span>C#</span><span>MySQL</span></div>
              </div>
              <div className="timeline-item-premium">
                <span className="time">Feb 2021 - Abr 2021</span>
                <h4>Practicante Analista Programador</h4>
                <p className="company">Departamento de Salud Municipal Vallenar</p>
                <p className="description">
                  Desarrollo de software con integración a bases de datos MySQL y apoyo en la digitalización y
                  estructuración de información institucional. Soporte técnico a infraestructura y sistemas
                  críticos del departamento.
                </p>
                <div className="project-tech"><span>MySQL</span><span>PHP</span><span>Programación</span><span>Soporte Técnico</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="stack" className="section bg-alt">
          <div className="container">
            <h2 className="section-title centered">Ecosistema Tecnológico</h2>
            <div className="skill-grid">
              <div className="skill-cluster">
                <h4><i className="fas fa-chart-line"></i> Data, BI & Analytics</h4>
                <div className="skill-tags"><span>Power BI</span><span>Python</span><span>R (Base sólida)</span><span>SQL Server</span><span>Tableau (Funcional)</span><span>Excel Avanzado</span><span>ETL</span><span>QA/QC de Datos</span><span>Modelamiento</span></div>
              </div>
              <div className="skill-cluster">
                <h4><i className="fas fa-industry"></i> Integración & Sistemas</h4>
                <div className="skill-tags"><span>SAP Integration</span><span>APIs</span><span>Kizeo Forms</span><span>EtaPro / ACS</span><span>Sensores & IoT</span><span>Gestión de Activos</span><span>Mantenimiento Predictivo</span><span>Power Automate</span></div>
              </div>
              <div className="skill-cluster">
                <h4><i className="fas fa-database"></i> Bases de Datos & Gestión</h4>
                <div className="skill-tags"><span>SQL Server</span><span>Oracle</span><span>MySQL</span><span>PostgreSQL</span><span>MongoDB (Nivel básico)</span><span>Administración DB</span><span>Integridad & Trazabilidad</span></div>
              </div>
              <div className="skill-cluster">
                <h4><i className="fas fa-code"></i> Desarrollo & Automatización</h4>
                <div className="skill-tags"><span>Python (Streamlit)</span><span>JavaScript</span><span>HTML/CSS</span><span>PHP / Laravel</span><span>C#</span><span>Desarrollo de Herramientas Internas</span><span>Automatización de Procesos</span></div>
              </div>
              <div className="skill-cluster">
                <h4><i className="fas fa-shield-alt"></i> Seguridad & Proyectos</h4>
                <div className="skill-tags"><span>Ciberseguridad</span><span>Análisis de Vulnerabilidades</span><span>Protección de Datos</span><span>PMBOK (Enfoque)</span><span>Scrum / Kanban</span><span>ISO 55001 / 55001</span><span>Trazabilidad Técnica</span></div>
              </div>
              <div className="skill-cluster">
                <h4><i className="fas fa-tools"></i> Herramientas Complementarias</h4>
                <div className="skill-tags"><span>Azure</span><span>Windows / Linux / macOS</span><span>AutoCAD (Intermedio)</span><span>Micromine / Leapfrog (Nivel básico)</span><span>ArcView / Vulcan (Conocimiento funcional)</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="trayectoria" className="section">
          <div className="container">
            <h2 className="section-title">Formación Académica</h2>
            <div className="education-stack">
              <div className="edu-card-mini">
                <i className="fas fa-graduation-cap"></i>
                <div>
                  <h5>Ingeniería en Informática</h5>
                  <p><strong>IPCHILE</strong></p>
                  <p>
                    Formación orientada al diseño de soluciones tecnológicas complejas, Big Data e IA. Aporta la
                    visión estratégica necesaria para liderar la transformación digital y gestionar proyectos de
                    ingeniería alineados a objetivos operativos.
                  </p>
                  <div className="project-tech"><span>Big Data</span><span>Cloud Computing</span><span>Inteligencia Artificial</span><span>Metodologías Ágiles</span></div>
                  <a href="https://www.ipchile.cl/carreras/ingenieria-en-informatica/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Ver programa oficial <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
              <div className="edu-card-mini">
                <i className="fas fa-code"></i>
                <div>
                  <h5>Analista Programador Computacional</h5>
                  <p><strong>IPCHILE</strong></p>
                  <p>
                    Base técnica sólida en lógica de programación, desarrollo fullstack y administración de bases
                    de datos. Fundamental para la construcción de herramientas internas, automatización y análisis
                    de sistemas operacionales.
                  </p>
                  <div className="project-tech"><span>Python</span><span>SQL Server</span><span>Desarrollo Web</span><span>Análisis de Sistemas</span></div>
                  <a href="https://www.ipchile.cl/carreras/tecnico-de-nivel-superior-analista-programador-computacional/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Ver programa oficial <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
              <div className="edu-card-mini">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <h5>Ciberseguridad & Ciberdefensa</h5>
                  <p><strong>U. Autónoma de Chile</strong></p>
                  <p>
                    Especialización en protección de activos críticos y gestión de incidentes. Asegura que la
                    arquitectura de datos industriales cumpla con estándares de seguridad, integridad y
                    continuidad operacional.
                  </p>
                  <div className="project-tech"><span>Protección de Activos</span><span>Ciberdefensa</span><span>Gestión de Incidentes</span></div>
                  <a href="https://postgrados.uautonoma.cl/programas/diplomados/diplomado-en-ciberseguridad-y-ciberdefensa/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Ver programa oficial <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
              <div className="edu-card-mini accent">
                <i className="fas fa-project-diagram"></i>
                <div>
                  <h5>Dirección de Proyectos (UC)</h5>
                  <p>
                    <strong>PUC de Chile</strong> | <span className="badge">En curso</span>
                  </p>
                  <p>
                    Gestión técnica basada en estándares PMI para asegurar alcance, cronograma y calidad.
                    Proporciona herramientas para dirigir equipos y proyectos bajo enfoques predictivos, ágiles o
                    híbridos.
                  </p>
                  <div className="project-tech"><span>Estándares PMI</span><span>Gestión de Riesgos</span><span>SCRUM</span><span>Calidad</span></div>
                  <a href="https://educacionprofesional.ing.uc.cl/?diplomado=diplomado-en-administracion-y-direccion-de-proyectos" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Ver programa oficial <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="section">
          <div className="container">
            <div className="contact-card-premium">
              <div className="contact-header">
                <h2>¿Necesitas convertir datos operacionales en decisiones confiables?</h2>
                <p>
                  Puedo ayudarte a ordenar información dispersa, automatizar reportes, integrar sistemas y
                  construir indicadores trazables para mantenimiento, activos, minería, energía u operación
                  técnica.
                </p>
              </div>
              <form
                ref={formRef}
                id="contact-form"
                className="modern-form"
                action={FORMSPREE_ACTION}
                method="POST"
                onSubmit={handleSubmit}
              >
                <div className="input-row">
                  <input type="text" name="name" placeholder="Tu Nombre" required />
                  <input type="email" name="email" placeholder="Tu Email" required />
                </div>
                <input type="text" name="subject" placeholder="Asunto de la consulta" required />
                <textarea
                  name="message"
                  placeholder="Cuéntame brevemente el contexto: industria, problema actual, sistemas involucrados, tipo de datos y resultado que necesitas lograr."
                  rows={4}
                  required
                ></textarea>
                <button type="submit" className="btn-primary full-width" disabled={sending}>
                  {sending ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Enviando...
                    </>
                  ) : (
                    <>
                      Enviar consulta técnica <i className="fas fa-paper-plane"></i>
                    </>
                  )}
                </button>
                {feedback && (
                  <div
                    aria-live="polite"
                    className={`feedback-${feedback.type}`}
                    style={{ marginTop: "1rem", fontWeight: 600 }}
                  >
                    {feedback.message}
                  </div>
                )}
              </form>
              <div className="contact-socials">
                <a href="https://www.linkedin.com/in/ggonzaleziriarte" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
                <a href="mailto:ggonzaleziriarte99@gmail.com">
                  <i className="fas fa-envelope"></i> ggonzaleziriarte99@gmail.com
                </a>
                <span className="location">
                  <i className="fas fa-map-marker-alt"></i> Vallenar, Atacama, Chile
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; {year} Gabriel Gonzalez Iriarte. Todos los derechos reservados.</p>
        </div>
      </footer>

      <a
        href="#inicio"
        className={`back-to-top${showTop ? " show" : ""}`}
        aria-label="Volver al inicio de la página"
        title="Volver arriba"
      >
        <i className="fas fa-chevron-up"></i>
      </a>
    </>
  );
}

export default App;
