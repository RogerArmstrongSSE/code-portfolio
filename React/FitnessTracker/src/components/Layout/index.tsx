import { Link } from "react-router-dom";
import { Routes } from "./menuItems";

interface LayoutProps {
  children: React.ReactNode;
}

const Header: React.FC = () => {
  return (
    <div className="pl-4 py-2 border-b-2 flex gap-4">
      {Routes.map((item) => (
        <Link
          key={item.slug}
          to={item.slug}
          className="text-indigo-600 hover:text-indigo-500"
          data-testid={`${item.name.toLowerCase()}-link`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="justify-between flex flex-col min-h-screen">
      <Header />
      <div className="pl-4 py-4 flex-grow flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Layout;
