import { useState } from "react";
import emailjs from "emailjs-com";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

export const CTASection = () => {
  const [step, setStep] = useState<"email" | "form" | "success">("email");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);

  const handleSubmit = async () => {
    if (!email || !message || !dateTime) return;

    const formattedDate = format(dateTime, "yyyy-MM-dd");
    const formattedTime = format(dateTime, "HH:mm");

    const templateParams = {
      email,
      message,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      await emailjs.send(
        "service_sxomsgo",
        "template_d35tdzc",
        templateParams,
        "FrLU-uqF0H1AxM0cI"
      );
      setStep("success");
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send.");
    }
  };

  return (
    <section  id="cta-section" className="py-12 px-4 bg-gradient-hero relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
        <p className="text-lg mb-8">
          Book your free 30‑minute discovery call today — limited slots for partners.
        </p>

        {step === "email" && (
          <div className="flex flex-col gap-4 max-w-md mx-auto px-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={() => email && setStep("form")}>Next</Button>
          </div>
        )}

        {step === "form" && (
          <div className="flex flex-col gap-4 max-w-md mx-auto px-4 text-left">
            <Textarea
              placeholder="What do you need help with?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <label className="text-left font-medium text-sm text-muted-foreground">
              Select date & time:
            </label>
            <DatePicker
              selected={dateTime}
              onChange={(date: Date | null) => setDateTime(date)}
              showTimeSelect
              timeIntervals={30}
              timeFormat="HH:mm"
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Click to choose date and time"
              className="w-full h-12 rounded-md border border-border px-3 text-black bg-white"
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto text-center px-4">
            <CheckCircle className="text-green-500 w-16 h-16" />
            <h3 className="text-2xl font-semibold text-green-600">
              Your call is scheduled!
            </h3>
            <p className="text-muted-foreground text-lg">
              We’ve sent a confirmation email with a Google Meet link.
            </p>
            <p className="text-lg font-medium">
              📅 {format(dateTime!, "MMMM d, yyyy")} <br />
              🕒 {format(dateTime!, "HH:mm")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
