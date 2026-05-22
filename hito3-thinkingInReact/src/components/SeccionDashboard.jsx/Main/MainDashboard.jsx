import SeccionDashboardAlta from "./SeccionDashboardAlta/SeccionDashboardAlta";
import SeccionMain from "./SeccionMain/SeccionMain";

const MainDashboard = () => {
  return (
    <main className="dashboard">
      <SeccionMain />
      <SeccionDashboardAlta />
    </main>
  );
};

export default MainDashboard;
