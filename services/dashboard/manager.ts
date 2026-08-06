import {
  getManagerDashboardStats,
  getWorkshopWorkload,
  getTopVehiclesWithAlerts,
  getTopAlertTypes,
  getUrgentRepairs,
} from "@/repositories/dashboard/manager";

export async function loadManagerDashboard() {
  const [
    stats,
    workload,
    topVehicles,
    alertTypes,
    urgentRepairs,
  ] = await Promise.all([
    getManagerDashboardStats(),
    getWorkshopWorkload(),
    getTopVehiclesWithAlerts(),
    getTopAlertTypes(),
    getUrgentRepairs(),
  ]);

  return {
    stats,
    workload,
    topVehicles,
    alertTypes,
    urgentRepairs,
  };
}

