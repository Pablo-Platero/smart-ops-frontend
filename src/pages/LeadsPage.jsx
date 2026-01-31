import Card from "../components/ui/Card";

const COLUMNS = [
  { key: "new", title: "Nuevo" },
  { key: "contacted", title: "Contactado" },
  { key: "negotiation", title: "En negociación" },
  { key: "closed", title: "Cerrado" },
];

const LEADS = [
  {
    id: 1,
    name: "Municipalidad de Upala",
    contact: "Juan Pérez",
    value: "$8,500",
    status: "new",
  },
  {
    id: 2,
    name: "Constructora Norte",
    contact: "María López",
    value: "$3,200",
    status: "contacted",
  },
  {
    id: 3,
    name: "Empresa El Roble",
    contact: "Carlos Gómez",
    value: "$12,000",
    status: "negotiation",
  },
  {
    id: 4,
    name: "Servicios del Pacífico",
    contact: "Ana Mora",
    value: "$5,000",
    status: "closed",
  },
  {
    id: 5,
    name: "Cooperativa Local",
    contact: "Luis Herrera",
    value: "$2,400",
    status: "new",
  },
];

function LeadCard({ lead }) {
  return (
    <Card className="p-3">
      <div className="text-sm text-white/60">{lead.name}</div>
      <div className="mt-1 font-semibold">{lead.contact}</div>
      <div className="mt-2 flex items-center justify-between text-xs text-white/60">
        <span>Valor</span>
        <span className="font-semibold text-white/80">{lead.value}</span>
      </div>
    </Card>
  );
}

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/60">CRM</div>
          <h2 className="text-2xl font-semibold">Pipeline de Leads</h2>
        </div>

        <button className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
          + Nuevo lead
        </button>
      </div>

      {/* Kanban */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <span className="text-xs text-white/50">
                {LEADS.filter((l) => l.status === col.key).length}
              </span>
            </div>

            <div className="space-y-3">
              {LEADS.filter((l) => l.status === col.key).map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}

              {LEADS.filter((l) => l.status === col.key).length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-white/40">
                  Sin leads
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
