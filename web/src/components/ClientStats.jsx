import React from "react";
import { User, PlusCircle } from "lucide-react";
import StatCard from "./StatCard";

const ClientStats = ({ clients }) => {
  const active = clients.filter(c => c.status === "active").length;
  const inactive = clients.filter(c => c.status === "inactive").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Clients" 
        value={clients.length} 
        icon={User} 
        color="from-blue-50 to-blue-100 border-blue-200 text-blue-700" 
      />
      <StatCard 
        title="Active Clients" 
        value={active} 
        icon={User} 
        color="from-blue-100 to-blue-150 border-emerald-200 text-emerald-700" 
      />
      <StatCard 
        title="Inactive Clients" 
        value={inactive} 
        icon={User} 
        color="from-blue-150 to-blue-200 border-amber-200 text-amber-700" 
      />
      <StatCard 
        title="This Month" 
        value={12} 
        icon={PlusCircle} 
        color="from-purple-50 to-purple-100 border-purple-200 text-purple-700" 
      />
    </div>
  );
};

export default ClientStats;