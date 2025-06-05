'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateEventDescription } from '@/ai/flows/generate-event-description';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  eventDetails: z.string().min(20, { message: "Please provide at least 20 characters for event details." }).max(1000, {message: "Event details cannot exceed 1000 characters."}),
});

type FormValues = z.infer<typeof formSchema>;

export function EventDescriptionGenerator() {
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDetails: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setGeneratedDescription(null);
    try {
      const result = await generateEventDescription({ eventDetails: values.eventDetails });
      setGeneratedDescription(result.description);
      toast({
        title: "Description Generated!",
        description: "Your event description has been successfully created.",
        variant: "default",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error Generating Description",
        description: "Failed to generate description. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="inline-block p-3 bg-primary/10 rounded-full mx-auto mb-4">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl text-primary">AI Event Description Generator</CardTitle>
        <CardDescription className="text-md">
          Enter some details about your event, and let our AI craft a compelling description for you!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="eventDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Event Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A magical birthday party for a 5-year-old, unicorn theme, with a bouncy castle, face painting, and a custom cake. Target audience: kids and parents. The event is on July 20th at Willow Creek Park."
                      className="min-h-[150px] text-base p-3 focus:ring-accent focus:border-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg rounded-md transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> Generate Description
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      {generatedDescription && (
        <CardFooter className="mt-6 p-0">
          <div className="w-full p-6 border-t border-border">
            <h3 className="text-xl font-semibold mb-3 text-primary font-headline">Generated Description:</h3>
            <div className="p-4 border rounded-md bg-secondary/30 text-foreground whitespace-pre-wrap text-sm leading-relaxed">
              {generatedDescription}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
