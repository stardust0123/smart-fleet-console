import {
    getDriverProfile,
    getDriverMonthlyScores,
    getDriverCertifications,
    getDriverAlerts,
    getDriverTrips,
    getDriverCurrentVehicle,
    getDriverUpcomingMaintenance,
    getDriverCriticalAlerts,
    getDriverCoachingHistory,
    getDriverMaintenanceHistory,
    getDriverViolations,
  } from "@/repositories/dashboard/driver";
  
  export async function loadDriverDashboard(driverId: string) {
    const [
      profile,
      monthlyScores,
      certifications,
      alerts,
      trips,
      currentVehicle,
      upcomingMaintenance,
      criticalAlerts,
    ] = await Promise.all([
      getDriverProfile(driverId),
      getDriverMonthlyScores(driverId),
      getDriverCertifications(driverId),
      getDriverAlerts(driverId),
      getDriverTrips(driverId),
      getDriverCurrentVehicle(driverId),
      getDriverUpcomingMaintenance(driverId),
      getDriverCriticalAlerts(driverId),
    ]);
    return {
      profile,
      monthlyScores,
      certifications,
      alerts,
      trips,
      currentVehicle,
      upcomingMaintenance,
      criticalAlerts,
    };
  }
  
  export async function loadDriverHistory(driverId: string) {
    const [trips, maintenance, violations, coaching] = await Promise.all([
      getDriverTrips(driverId),
      getDriverMaintenanceHistory(driverId),
      getDriverViolations(driverId),
      getDriverCoachingHistory(driverId),
    ]);
    return { trips, maintenance, violations, coaching };
  }
  
