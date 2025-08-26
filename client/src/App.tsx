import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Search from "@/pages/search";
import PropertyDetail from "@/pages/property-detail";
import Communities from "@/pages/communities";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import Buying from "@/pages/buying";
import Selling from "@/pages/selling";
import LincolnHomes from "@/pages/lincoln-homes";
import Featured from "@/pages/featured";
import HomeBuilders from "@/pages/home-builders";
import Admin from "@/pages/admin";
import Agents from "@/pages/agents";
import TemplateAdmin from "@/pages/template-admin";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MarketAnalysis from "@/pages/market-analysis";
import HomeValuation from "@/pages/home-valuation";
import ListingServices from "@/pages/listing-services";
import OpenHouses from "@/pages/open-houses";

function Router() {
  return (
    <div className="min-h-screen bg-soft-white">
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/buying" component={Buying} />
          <Route path="/selling" component={Selling} />
          <Route path="/lincoln-homes" component={LincolnHomes} />
          <Route path="/featured" component={Featured} />
          <Route path="/home-builders" component={HomeBuilders} />
          <Route path="/communities" component={Communities} />
          <Route path="/about" component={About} />
          <Route path="/agents" component={Agents} />
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={Blog} />
          <Route path="/admin" component={Admin} />
          <Route path="/template-admin" component={TemplateAdmin} />
          <Route path="/market-analysis" component={MarketAnalysis} />
          <Route path="/home-valuation" component={HomeValuation} />
          <Route path="/listing-services" component={ListingServices} />
          <Route path="/open-houses" component={OpenHouses} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
