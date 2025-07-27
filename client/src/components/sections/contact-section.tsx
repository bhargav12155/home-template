import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, MapPin } from "lucide-react";
import { contactFormSchema, type ContactForm } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { CONTACT_INFO } from "@/lib/constants";

export default function ContactSection() {
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
        title: "Message Sent!",
        description: "Thank you for your interest. We'll get back to you shortly.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
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

  return (
    <section className="py-20 bg-bjork-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-light mb-6">
              Ready to Find Your <span className="text-bjork-beige">Dream Home?</span>
            </h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              Let's start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-bjork-beige rounded-full p-3 mr-4 flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium">{CONTACT_INFO.phone}</div>
                  <div className="text-sm opacity-80">Call or text anytime</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-bjork-beige rounded-full p-3 mr-4 flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium">{CONTACT_INFO.address.street}</div>
                  <div className="text-sm opacity-80">
                    {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-display font-medium mb-6 text-white">Get Your Free Market Analysis</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="First Name" 
                              {...field}
                              className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-bjork-beige"
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
                          <FormControl>
                            <Input 
                              placeholder="Last Name" 
                              {...field}
                              className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-bjork-beige"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Email Address" 
                            {...field}
                            className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-bjork-beige"
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
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Phone Number" 
                            {...field}
                            className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-bjork-beige"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Property Address (Optional)" 
                            {...field}
                            className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-bjork-beige"
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/20 border-white/30 text-white focus:ring-bjork-beige">
                              <SelectValue placeholder="I'm interested in..." />
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

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your real estate goals..." 
                            rows={4}
                            {...field}
                            className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-bjork-beige resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-bjork-beige text-white hover:bg-bjork-blue transition-colors duration-300 text-lg font-medium py-4"
                  >
                    {isSubmitting ? "Sending..." : "Get My Free Analysis"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
