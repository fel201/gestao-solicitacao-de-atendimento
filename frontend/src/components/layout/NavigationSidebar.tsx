import { NavLink } from "react-router";

const navigationItems = [
  { to: "/solicitacoes", label: "Visualizar atendimentos", end: true },
  { to: "/solicitacoes/nova", label: "Nova solicitação", end: false },
];

export default function NavigationSidebar() {
  return (
    <aside className="border-b border-[#3f4b59] bg-[#0f0f0f] lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-cyan-300"></p>
        <h1 className="mt-1 text-xl font-semibold text-slate-100">
          Gestão de Solicitações de Atendimentos
        </h1>
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:px-3"
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-[#2b323a] hover:text-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
