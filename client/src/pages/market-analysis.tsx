import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Home, DollarSign, PieChart, BarChart3, Phone, Mail, MapPin } from "lucide-react";

export default function MarketAnalysis() {
  // Mortgage calculator state
  const [homePrice, setHomePrice] = useState(350000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [downPayment, setDownPayment] = useState(6);
  const [interestRate, setInterestRate] = useState(6.42);
  const [taxes, setTaxes] = useState(181);
  const [pmi, setPmi] = useState(0);

  // Contact form state
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Mortgage calculation
  const principal = homePrice - (homePrice * (downPayment / 100));
  const monthlyInterest = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = principal * monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));
  const totalMonthly = Math.round(monthlyPayment + taxes + pmi);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-bjork-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80" 
            alt="Market analysis and data visualization" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-bjork-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-5xl mx-auto px-6 bg-bjork-black/60 backdrop-blur-sm rounded-2xl py-16">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-light mb-8 leading-tight text-white drop-shadow-lg">
              Market <span className="font-bold text-bjork-beige">Analysis</span> & Tools
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-white/90 drop-shadow-md">
              Get comprehensive market insights and calculate your mortgage with our advanced tools
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Lincoln Market <span className="font-bold text-bjork-beige">Insights</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with real-time market data and trends in Lincoln, NE and surrounding areas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Market Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track price movements, inventory levels, and market velocity in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Comparative Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Compare neighborhood performance and identify emerging market opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <PieChart className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Custom Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate detailed reports tailored to your specific investment or selling goals.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-bjork-black mb-2">$347K</div>
              <p className="text-gray-600">Median Home Price</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-bjork-black mb-2">18</div>
              <p className="text-gray-600">Days on Market</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-bjork-black mb-2">156</div>
              <p className="text-gray-600">Homes Sold (YTD)</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-bjork-black mb-2">+5.2%</div>
              <p className="text-gray-600">Year-over-Year Growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mortgage Calculator Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-bjork-black text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Financial calculator background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="w-full max-w-4xl px-6 flex flex-col justify-center items-center relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-white mb-8">
              Free <span className="font-bold text-bjork-beige">Mortgage Calculator</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Use our advanced mortgage calculator to determine how much house you can afford and plan your investment.
            </p>
          </div>

          <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Home Price</label>
                  <Input 
                    type="number" 
                    value={homePrice} 
                    onChange={e => setHomePrice(Number(e.target.value))} 
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Loan Term (years)</label>
                  <Input 
                    type="number" 
                    value={loanTerm} 
                    onChange={e => setLoanTerm(Number(e.target.value))} 
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Down Payment (%)</label>
                  <Input 
                    type="number" 
                    value={downPayment} 
                    onChange={e => setDownPayment(Number(e.target.value))} 
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Interest Rate (%)</label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={interestRate} 
                    onChange={e => setInterestRate(Number(e.target.value))} 
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Monthly Taxes & Fees</label>
                  <Input 
                    type="number" 
                    value={taxes} 
                    onChange={e => setTaxes(Number(e.target.value))} 
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">PMI ($/month)</label>
                  <Input 
                    type="number" 
                    value={pmi} 
                    onChange={e => setPmi(Number(e.target.value))} 
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  />
                </div>
              </div>
              
              <div className="bg-bjork-beige rounded-lg p-6 text-center">
                <h3 className="text-2xl font-display font-bold text-bjork-black mb-2">
                  Estimated Monthly Payment
                </h3>
                <div className="text-4xl font-bold text-bjork-black">
                  ${totalMonthly.toLocaleString()}
                </div>
                <p className="text-bjork-black/70 mt-2">
                  Principal & Interest: ${Math.round(monthlyPayment).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-4">
              Ready to Get Started? <span className="font-bold text-bjork-beige">Let's Connect!</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Contact our market analysis experts to get personalized insights for your real estate needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Get Your Custom Market Report</CardTitle>
                <CardDescription>Fill out the form and we'll send you detailed market insights.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <Input 
                        value={contact.name} 
                        onChange={e => setContact({ ...contact, name: e.target.value })} 
                        placeholder="Your Name"
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <Input 
                        type="email"
                        value={contact.email} 
                        onChange={e => setContact({ ...contact, email: e.target.value })} 
                        placeholder="your@email.com"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input 
                      value={contact.phone} 
                      onChange={e => setContact({ ...contact, phone: e.target.value })} 
                      placeholder="(402) 555-0123"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <Textarea 
                      value={contact.message} 
                      onChange={e => setContact({ ...contact, message: e.target.value })} 
                      placeholder="Tell us about your market analysis needs..."
                      rows={4}
                      className="border-gray-300"
                    />
                  </div>
                  <Button 
                    size="lg"
                    className="w-full bg-bjork-black hover:bg-bjork-black/90 text-white"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Request Market Analysis
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-bjork-black mb-6">Professional Realty Group</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-bjork-beige" />
                    <div>
                      <p className="font-medium text-bjork-black">3201 Pioneers Blvd Suite 32</p>
                      <p className="text-gray-600">Lincoln, NE 68502</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-bjork-beige" />
                    <p className="text-bjork-black font-medium">(402) 419-6309</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-bjork-beige" />
                    <p className="text-bjork-black font-medium">info@prglincoln.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-display font-bold text-bjork-black mb-4">Quick Links</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Badge variant="outline" className="justify-center">Home Value Tool</Badge>
                  <Badge variant="outline" className="justify-center">Market Insights</Badge>
                  <Badge variant="outline" className="justify-center">Buying Guide</Badge>
                  <Badge variant="outline" className="justify-center">Selling Guide</Badge>
                  <Badge variant="outline" className="justify-center">Our Agents</Badge>
                  <Badge variant="outline" className="justify-center">Join Our Team</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bjork-black text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-4">
            Start Your Real Estate Journey With <span className="font-bold text-bjork-beige">Data-Driven Decisions</span>
          </h2>
          <p className="text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
            Our market analysis tools and expert insights help you make informed decisions whether you're buying, selling, or investing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Get Market Report
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-bjork-black bg-transparent"
            >
              <Phone className="h-5 w-5 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
