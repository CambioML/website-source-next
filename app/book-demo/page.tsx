'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import PageHero from '@/app/components/hero/PageHero';
import Container from '@/app/components/Container';
import Heading from '../components/Heading';
import Input from '../components/inputs/Input';
import TextArea from '../components/inputs/TextArea';
import emailjs from '@emailjs/browser';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface CalendlyEventData {
  event: string;
  [key: string]: string; // You can replace this with more specific properties if known
}

interface CalendlyMessageEvent extends MessageEvent {
  data: CalendlyEventData;
}

const CalendlyWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget w-full min-w-[320px] h-full"
      data-resize="true"
      data-url={process.env.NEXT_PUBLIC_CALENDLY_URL || ''}
    ></div>
  );
};

const BookDemoPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const DynamicCalendlyWidget = dynamic(() => Promise.resolve(CalendlyWidget), { ssr: false });
  const [showCalendly, setShowCalendly] = useState(true);
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
  }, []);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email address.';
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';

    const templateParams = {
      from_name: data.name,
      to_name: 'Cambio',
      company: data.company,
      linkedin: data.linkedin,
      email: data.email,
      message: data.message,
      request_type: 'Demo',
    };

    try {
      setIsLoading(true);
      await emailjs.send(serviceId, templateId, templateParams);
      toast.success('Sent!');
      setSubmitted(true);
    } catch (error) {
      toast.error('Contact failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleCalendlyEvent = useCallback((e: CalendlyMessageEvent) => {
    if (e.data.event && e.data.event === 'calendly.date_and_time_selected') {
      setShowCalendly(false);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center ">
      <PageHero title="🗓️ Book a Demo" description="Let's show you how you can maximize your data extraction" short />
      {submitted ? (
        <div className="h-[80vh] w-full flex flex-col gap-5 items-center justify-center">
          <h1 className="text-6xl font-semibold">Demo request submitted!</h1>
          <h2 className="text-3xl text-neutral-500 pb-10">{`We'll review it and get back to you shortly`}</h2>
          <div className="w-fit flex flex-row items-center justify-center gap-10">
            <div className="w-[300px]">
              <Button label="Go to Homepage" onClick={() => router.push('/')} small />
            </div>
          </div>
        </div>
      ) : (
        <Container styles="h-fit min-h-[1000px] py-10 w-full grid grid-cols-1 lg:grid-cols-2">
          <div className="h-full w-full flex items-start justify-center">
            <div className="w-full flex flex-col gap-4">
              <Heading title="Demo Request Form" subtitle="" center />
              <div className="flex gap-2 justify-center items-center">
                <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required />
                <Input id="company" label="Company" disabled={isLoading} register={register} errors={errors} required />
              </div>
              <div className="flex gap-2 justify-center items-center">
                <Input
                  id="email"
                  label="Email"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                  validate={validateEmail}
                />
                <Input id="linkedin" label="LinkedIn" disabled={false} register={register} errors={errors} required />
              </div>
              <TextArea
                id="message"
                label="How can we help you?"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <div>
                <Button onClick={handleSubmit(onSubmit)} label="Submit" />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            {showCalendly ? (
              <DynamicCalendlyWidget />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-100 m-4 rounded-xl">
                <p className="mb-4 text-xl">Please submit the Demo Request Form</p>
                <div>
                  <Button onClick={() => setShowCalendly(true)} label="Back to Preview" />
                </div>
              </div>
            )}
          </div>
        </Container>
      )}
    </div>
  );
};

export default BookDemoPage;
