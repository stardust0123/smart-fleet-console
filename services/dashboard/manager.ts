import {
  getManagerDashboardStats,
  getWorkshopWorkload,
  getTopVehiclesWithAlerts,
  getTopAlertTypes,
  getUrgentRepairs,
  getCostAndDowntimeByModel,
  getAvailableMechanicsWithCerts,
  getRepeatedFaults,
  getOverdueVehicles,
  getAwaitingInspectionVehicles,
  getLowStockParts,
  getSupplierPerformance,
  getExpiringCertificates,
} from "@/repositories/dashboard/manager";

// Safe wrapper function to catch individual query failures and prevent full dashboard crash
const safeFetch = async <T>(promise: Promise<T>, fallback: any): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    console.error("Dashboard database query failed:", error);
    return fallback;
  }
};

export async function loadManagerDashboard() {
  const [
    stats,
    workload,
    topVehicles,
    alertTypes,
    urgentRepairs,
    costAndDowntime,
    mechanicsList,
    repeatedFaults,
    overdueVehicles,
    awaitingInspection,
    lowStockParts,
    supplierPerformance,
    expiringCertificates,
  ] = await Promise.all([
    safeFetch(getManagerDashboardStats(), { totalVehicles: 0, openJobs: 0, predictiveAlerts: 0, mechanicsAvailable: 0, lowStockParts: 0, overdueVehicles: 0, awaitingInspection: 0 }),
    safeFetch(getWorkshopWorkload(), []),
    safeFetch(getTopVehiclesWithAlerts(), []),
    safeFetch(getTopAlertTypes(), []),
    safeFetch(getUrgentRepairs(), []),
    safeFetch(getCostAndDowntimeByModel(), []),
    safeFetch(getAvailableMechanicsWithCerts(), []),
    safeFetch(getRepeatedFaults(), []),
    safeFetch(getOverdueVehicles(), []),
    safeFetch(getAwaitingInspectionVehicles(), []),
    safeFetch(getLowStockParts(), []),
    safeFetch(getSupplierPerformance(), []),
    safeFetch(getExpiringCertificates(), []),
  ]);

  return {
    stats,
    workload,
    topVehicles,
    alertTypes,
    urgentRepairs,
    costAndDowntime,
    mechanicsList,
    repeatedFaults,
    overdueVehicles,
    awaitingInspection,
    lowStockParts,
    supplierPerformance,
    expiringCertificates,
  };
}