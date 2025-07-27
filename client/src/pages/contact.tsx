import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, MessageSquare, Calendar } from "lucide-react";
import { contactFormSchema, type ContactForm } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      propertyAddress: "",
      interest: undefined,
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error Sending Message",
        description: error.message || "Please try again or call us directly.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ContactForm) => {
    setIsSubmitting(true);
    submitMutation.mutate(data);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      details: CONTACT_INFO.phone,
      subtext: "Call or text anytime",
      action: `tel:${CONTACT_INFO.phone.replace(/[^\d]/g, '')}`
    },
    {
      icon: Mail,
      title: "Email", 
      details: "mike.bjork@bhhsamb.com",
      subtext: "We'll respond within 24 hours",
      action: "mailto:mike.bjork@bhhsamb.com"
    },
    {
      icon: MapPin,
      title: "Office",
      details: CONTACT_INFO.address.street,
      subtext: `${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state} ${CONTACT_INFO.address.zip}`,
      action: `https://maps.google.com?q=${encodeURIComponent(`${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state} ${CONTACT_INFO.address.zip}`)}`
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Open 24 hours 7 days a week",
      subtext: "Available whenever you need us",
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-light text-bjork-black mb-6">
            Contact <span className="text-bjork-beige">Us</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to start your Nebraska real estate journey? Get in touch with our luxury real estate specialists. We're here to make your home buying or selling experience exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-display font-medium text-bjork-black mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-bjork-beige rounded-full p-3 mr-4 flex-shrink-0">
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-bjork-black mb-1">{method.title}</h3>
                      {method.action ? (
                        <a 
                          href={method.action}
                          className="text-gray-600 hover:text-bjork-blue transition-colors duration-300 block"
                          target={method.action.startsWith('http') ? '_blank' : undefined}
                          rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {method.details}
                        </a>
                      ) : (
                        <div className="text-gray-600">{method.details}</div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">{method.subtext}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-display font-medium text-bjork-black mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href={SOCIAL_LINKS.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bjork-beige text-white p-3 rounded-full hover:bg-bjork-blue transition-colors duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href={SOCIAL_LINKS.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bjork-beige text-white p-3 rounded-full hover:bg-bjork-blue transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href={SOCIAL_LINKS.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bjork-beige text-white p-3 rounded-full hover:bg-bjork-blue transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={SOCIAL_LINKS.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bjork-beige text-white p-3 rounded-full hover:bg-bjork-blue transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-medium text-bjork-black mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-transparent border border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white transition-colors duration-300"
                    onClick={() => window.open(`tel:${CONTACT_INFO.phone.replace(/[^\d]/g, '')}`, '_self')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button 
                    className="w-full justify-start bg-transparent border border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white transition-colors duration-300"
                    onClick={() => window.open('mailto:mike.bjork@bhhsamb.com', '_self')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button 
                    className="w-full justify-start bg-transparent border border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white transition-colors duration-300"
                    onClick={() => {
                      const message = "Hi! I'm interested in learning more about your real estate services.";
                      const phone = CONTACT_INFO.phone.replace(/[^\d]/g, '');
                      window.open(`sms:${phone}?body=${encodeURIComponent(message)}`, '_self');
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-bjork-beige mr-3" />
                  <h2 className="text-2xl font-display font-medium text-bjork-black">
                    Send Us a Message
                  </h2>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bjork-black">First Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your first name" 
                                {...field}
                                className="border-gray-200 focus:ring-bjork-blue"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bjork-black">Last Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your last name" 
                                {...field}
                                className="border-gray-200 focus:ring-bjork-blue"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bjork-black">Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your.email@example.com" 
                                {...field}
                                className="border-gray-200 focus:ring-bjork-blue"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bjork-black">Phone Number *</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="(402) 555-0123" 
                                {...field}
                                className="border-gray-200 focus:ring-bjork-blue"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="propertyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bjork-black">Property Address (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Property you're interested in" 
                                {...field}
                                className="border-gray-200 focus:ring-bjork-blue"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="interest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bjork-black">I'm Interested In</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-200 focus:ring-bjork-blue">
                                  <SelectValue placeholder="Select your interest" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="buying">Buying a Home</SelectItem>
                                <SelectItem value="selling">Selling a Home</SelectItem>
                                <SelectItem value="both">Both Buying & Selling</SelectItem>
                                <SelectItem value="investment">Investment Properties</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bjork-black">Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your real estate goals, timeline, and any questions you have..." 
                              rows={6}
                              {...field}
                              className="border-gray-200 focus:ring-bjork-blue resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300 py-3"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        className="border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white transition-colors duration-300"
                      >
                        Clear Form
                      </Button>
                    </div>
                  </form>
                </Form>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    <strong>Response Time:</strong> We typically respond to all inquiries within 2-4 hours during business hours. 
                    For urgent matters, please call us directly at {CONTACT_INFO.phone}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-medium text-bjork-black mb-6 text-center">
                Visit Our Office
              </h2>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-bjork-beige mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-bjork-black mb-2">
                    {CONTACT_INFO.address.street}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}
                  </p>
                  <Button 
                    onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(`${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state} ${CONTACT_INFO.address.zip}`)}`, '_blank')}
                    className="bg-bjork-beige text-white hover:bg-bjork-blue transition-colors duration-300"
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
