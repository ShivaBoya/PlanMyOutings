import Dashboard from "./Dashboard";
import Restaurants from "./Restaurants";
import Movies from "./Movies";
import Beaches from "./Beaches";
import Parks from "./Parks";
import Footer from "./Footer";
// import Background3D from "../components/Background3D"; // Global in App.jsx

export default function Home({ darkMode, user, setAuthModalOpen }) {
  const categories = [
    {
      key: "dashboard",
      component: <Dashboard darkMode={darkMode} user={user} setAuthModalOpen={setAuthModalOpen} />,
    },
    { key: "restaurants", component: <Restaurants darkMode={darkMode} /> },
    { key: "movies", component: <Movies darkMode={darkMode} /> },
    { key: "beaches", component: <Beaches darkMode={darkMode} /> },
    { key: "parks", component: <Parks darkMode={darkMode} /> },
  ];

  return (
    <div className="relative min-h-screen transition-colors">

      {/* GLOBAL BACKGROUND IS IN APP.JSX */}

      <div className="relative z-10">
        {categories.map((cat) => (
          <section key={cat.key} id={cat.key} className="relative">
            {cat.component}
          </section>
        ))}

        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}
