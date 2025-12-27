type Route = {
    slug: string;
    name: string;
  };
  
  export const HomeRoute: Route = {
    slug: "/",
    name: "Home",
  };
  
  export const MealsRoute: Route = {
    slug: "/meals",
    name: "Meals",
  };
  
  export const ActivityRoute: Route = {
    slug: "/activity",
    name: "Activity",
  };
  
  export const PersonalInfoRoute: Route = {
    slug: "/personal",
    name: "My Information",
  };
  
  // Task 1.1
  export const Routes: Route[] = [HomeRoute, MealsRoute, ActivityRoute, PersonalInfoRoute];