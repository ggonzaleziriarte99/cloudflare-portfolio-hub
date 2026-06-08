import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import bodyHtml from "../portfolio-body.html?raw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gabriel González Iriarte | Data Engineer Industrial | BI & Automatización" },
      {
        name: "description",
        content:
          "Ingeniero Informático especializado en Minería y Energía. Transformo datos industriales y SAP en información confiable para mantenimiento y gestión de activos.",
      },
      {
        name: "keywords",
        content:
          "Data Engineer Industrial, Business Intelligence, Power BI, Python, SAP, Minería, Energía, Mantenimiento Predictivo, Gestión de Activos, SQL, Automatización",
      },
      { property: "og:title", content: "Gabriel González Iriarte | Industrial Data Engineer & BI" },
      {
        property: "og:description",
        content:
          "Arquitectura de datos y automatización para la continuidad operacional en sectores críticos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gabriel González Iriarte | Data Engineer Industrial" },
      {
        name: "twitter:description",
        content: "Información confiable para decisiones técnicas en entornos de alta exigencia.",
      },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "stylesheet", href: "/styles.css" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      },
    ],
    scripts: [{ src: "/script.js", defer: true }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  useEffect(() => {
    // Re-trigger script.js initialization on client-side route mount in case
    // the deferred script already ran during SSR hydration with no DOM.
    if (typeof window !== "undefined" && !(window as { __portfolioInit?: boolean }).__portfolioInit) {
      (window as { __portfolioInit?: boolean }).__portfolioInit = true;
    }
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
