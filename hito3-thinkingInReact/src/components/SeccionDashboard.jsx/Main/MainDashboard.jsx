import SeccionDashboardAlta from "./SeccionDashboardAlta/SeccionDashboardAlta";
import SeccionDashboardListado from "./SeccionDashboardListado/SeccionDashboardListado";
import SeccionMain from "./SeccionMain/SeccionMain";

const MainDashboard = () => {
  return (
    <main className="dashboard">
      <SeccionMain />
      <SeccionDashboardAlta />
      <SeccionDashboardListado />
    </main>
  );
};

export default MainDashboard;
