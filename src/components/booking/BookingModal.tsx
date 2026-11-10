import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Globe,
  Check,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Video,
  ArrowUpRight,
} from 'lucide-react';
import { CLINICAL_SERVICES, CONSULTATION_TIERS } from '../../data/clinicalData';
import { IMAGES } from '../../assets/images';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialTierId?: string;
}

const STEPS = [
  { num: 1, label: 'Focus Area' },
  { num: 2, label: 'Schedule' },
  { num: 3, label: 'Intake' },
  { num: 4, label: 'Confirm' },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialTierId = 'quick-consult',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || CLINICAL_SERVICES[0]?.id || 'cardiovascular-combo'
  );
  const [selectedTierId, setSelectedTierId] = useState<string>(initialTierId);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-12');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [consultFormat, setConsultFormat] = useState<'video' | 'phone'>('video');
  const [patientDetails, setPatientDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Australia (AEST)',
    currentMedications: '',
    healthGoals: '',
    consentAgreed: false,
  });

  // Synchronize initial selections when modal opens with specific props
  useEffect(() => {
    if (isOpen) {
      if (initialServiceId) setSelectedServiceId(initialServiceId);
      if (initialTierId) setSelectedTierId(initialTierId);
    }
  }, [isOpen, initialServiceId, initialTierId]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const selectedService = CLINICAL_SERVICES.find((s) => s.id === selectedServiceId) || CLINICAL_SERVICES[0];
  const selectedTier = CONSULTATION_TIERS.find((t) => t.id === selectedTierId) || CONSULTATION_TIERS[0];

  // Available Time Slots (AEST)
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
  ];

  // Available upcoming dates
  const availableDates = [
    { date: '2026-11-12', label: 'Thu, Nov 12' },
    { date: '2026-11-13', label: 'Fri, Nov 13' },
    { date: '2026-11-16', label: 'Mon, Nov 16' },
    { date: '2026-11-17', label: 'Tue, Nov 17' },
    { date: '2026-11-18', label: 'Wed, Nov 18' },
  ];

  const handleNext = () => {
    if (step < 4) {
      setDirection(1);
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
    }, 300);
  };

  // Step 3 validation check
  const isStep3Valid =
    patientDetails.fullName.trim().length > 1 &&
    patientDetails.email.trim().includes('@') &&
    patientDetails.phone.trim().length > 5 &&
    patientDetails.consentAgreed;

  // Directional step transition variants
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 18 : -18,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -18 : 18,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
        {/* Subtle Backdrop with Smooth Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#10243D]/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-booking-title"
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-[0_24px_70px_rgba(16,36,61,0.18)] border border-[#DCE8F1] overflow-hidden z-10 flex flex-col h-[94dvh] sm:h-[88vh] max-h-[94dvh] sm:max-h-[850px]"
        >
          {/* ============================================================== */}
          {/* 1. CLEAN COMPACT HEADER (Fixed ~64-72px, Never intrinsic logo) */}
          {/* ============================================================== */}
          <div className="h-16 sm:h-[72px] px-4 sm:px-6 md:px-8 flex items-center justify-between border-b border-[#DCE8F1] bg-white flex-shrink-0 z-20">
            {/* Left: JJ Nutrition Brand Lockup */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 mr-3">
              <img
                src={IMAGES.brandLogo}
                alt="JJ Nutrition Logo"
                className="h-[30px] sm:h-[34px] md:h-[36px] w-[30px] sm:w-[34px] md:w-[36px] object-contain flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <span className="font-montserrat text-[15.5px] sm:text-[17px] font-normal text-[#111827] whitespace-nowrap truncate">
                  JJ Nutrition
                </span>
                <span className="hidden md:inline-block w-px h-3.5 bg-[#DCE8F1] flex-shrink-0" />
                <span className="hidden md:inline-block font-montserrat text-xs text-[#555555] whitespace-nowrap truncate">
                  Clinical Telehealth Booking
                </span>
              </div>
            </div>

            {/* Right: Minimal Close Icon aligned to far right */}
            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F3F9FD] hover:bg-[#E8F5FC] text-[#555555] hover:text-[#111827] flex items-center justify-center transition-colors cursor-pointer border border-[#DCE8F1] flex-shrink-0 ml-auto focus:outline-none focus:ring-2 focus:ring-accent/40"
              aria-label="Close booking modal"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2} />
            </button>
          </div>

          {/* ============================================================== */}
          {/* 2. REFINED 4-STEP PROGRESS INDICATOR                           */}
          {/* ============================================================== */}
          {/* Desktop & iPad Horizontal Stepper */}
          <div className="hidden sm:flex items-center justify-between px-6 sm:px-8 py-2.5 sm:py-3 bg-[#F3F9FD]/70 border-b border-[#DCE8F1] flex-shrink-0">
            {STEPS.map((s, idx) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;

              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-montserrat transition-all duration-300 ${
                        isCompleted
                          ? 'bg-accent/15 text-accent font-semibold border border-accent/30'
                          : isCurrent
                          ? 'bg-accent text-white font-semibold shadow-xs'
                          : 'bg-white text-[#555555] border border-[#DCE8F1]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={2.2} /> : s.num}
                    </span>
                    <span
                      className={`font-montserrat text-xs transition-colors duration-200 ${
                        isCurrent
                          ? 'font-medium text-[#111827]'
                          : isCompleted
                          ? 'font-normal text-[#111827]'
                          : 'font-normal text-[#555555]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-4 transition-colors duration-300 ${
                        step > s.num ? 'bg-accent/40' : 'bg-[#DCE8F1]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile Stepper & Progress Bar */}
          <div className="flex sm:hidden flex-col bg-[#F3F9FD]/70 border-b border-[#DCE8F1] flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[11px] font-semibold">
                  {step}
                </span>
                <span className="font-montserrat text-xs font-medium text-[#111827]">
                  {STEPS[step - 1].label}
                </span>
              </div>
              <span className="font-montserrat text-[11px] text-[#555555]">
                Step {step} of 4
              </span>
            </div>
            {/* Smooth 2px progress track */}
            <div className="w-full h-0.5 bg-[#DCE8F1]">
              <motion.div
                className="h-full bg-accent"
                initial={false}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. SCROLLABLE STEP CONTENT WITH DIRECTIONAL FRAMER MOTION      */}
          {/* ============================================================== */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-7 relative overscroll-contain">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={shouldReduceMotion ? undefined : stepVariants}
                initial={shouldReduceMotion ? undefined : 'enter'}
                animate={shouldReduceMotion ? undefined : 'center'}
                exit={shouldReduceMotion ? undefined : 'exit'}
                className="space-y-6"
              >
                {/* -------------------------------------------------------- */}
                {/* STEP 1: CHOOSE CLINICAL FOCUS & CONSULTATION TIER         */}
                {/* -------------------------------------------------------- */}
                {step === 1 && (
                  <div>
                    {/* Section Heading */}
                    <div className="mb-5 sm:mb-6">
                      <h3
                        id="modal-booking-title"
                        className="font-montserrat text-xl sm:text-2xl font-medium text-[#111827] leading-tight mb-1.5"
                      >
                        Choose Your Clinical Focus
                      </h3>
                      <p className="font-montserrat text-xs sm:text-sm text-[#555555] font-normal leading-relaxed">
                        Select the health area you would like to discuss with Practitioner Selvi.
                      </p>
                    </div>

                    {/* 10 Clinical Protocol Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {CLINICAL_SERVICES.map((service) => {
                        const isSelected = selectedServiceId === service.id;

                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => setSelectedServiceId(service.id)}
                            className={`group p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                              isSelected
                                ? 'border-accent bg-[#F1F8FC] shadow-2xs ring-1 ring-accent'
                                : 'border-[#DCE8F1] bg-white hover:border-accent/50 hover:bg-[#F3F9FD]/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span
                                className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${
                                  isSelected
                                    ? 'bg-accent/15 text-accent'
                                    : 'bg-[#F3F9FD] text-[#555555] group-hover:text-accent'
                                }`}
                              >
                                {service.number}
                              </span>

                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-accent text-white scale-100'
                                    : 'border border-[#DCE8F1] opacity-0 group-hover:opacity-100 scale-90'
                                }`}
                              >
                                <Check className="w-3 h-3" strokeWidth={2.5} />
                              </div>
                            </div>

                            <h4 className="font-montserrat text-sm sm:text-[15px] font-medium text-[#111827] mb-1 leading-snug">
                              {service.title}
                            </h4>

                            <p className="font-montserrat text-xs text-[#555555] leading-relaxed line-clamp-2">
                              {service.tagline}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Consultation Tier Selection */}
                    <div className="pt-6 border-t border-[#DCE8F1]">
                      <div className="mb-4">
                        <h4 className="font-montserrat text-base sm:text-lg font-medium text-[#111827] mb-1">
                          Choose Consultation Tier
                        </h4>
                        <p className="font-montserrat text-xs text-[#555555]">
                          Select the session duration that best matches your clinical situation.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {CONSULTATION_TIERS.map((tier) => {
                          const isSelected = selectedTierId === tier.id;

                          return (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={() => setSelectedTierId(tier.id)}
                              className={`group p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                                isSelected
                                  ? 'border-accent bg-[#F1F8FC] shadow-2xs ring-1 ring-accent'
                                  : 'border-[#DCE8F1] bg-white hover:border-accent/50 hover:bg-[#F3F9FD]/50'
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-1 mb-2">
                                  <span className="font-montserrat text-xs text-[#555555] flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-accent" />
                                    {tier.duration}
                                  </span>
                                  <div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                                      isSelected
                                        ? 'bg-accent text-white'
                                        : 'border border-[#DCE8F1] opacity-0 group-hover:opacity-100'
                                    }`}
                                  >
                                    <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                                  </div>
                                </div>

                                <h5 className="font-montserrat text-sm font-medium text-[#111827] mb-1">
                                  {tier.name}
                                </h5>
                                <p className="font-montserrat text-[11px] text-[#555555] line-clamp-1 mb-3">
                                  {tier.subtitle}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-[#DCE8F1]/70 flex items-baseline justify-between">
                                <span className="font-montserrat text-xs text-[#555555]">Flat Fee</span>
                                <span className="font-montserrat text-lg font-bold text-[#111827]">
                                  A${tier.priceAUD}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 2: CHOOSE CONSULTATION TIME                         */}
                {/* -------------------------------------------------------- */}
                {step === 2 && (
                  <div>
                    {/* Section Heading */}
                    <div className="mb-5 sm:mb-6">
                      <h3 className="font-montserrat text-xl sm:text-2xl font-medium text-[#111827] leading-tight mb-1.5">
                        Choose Your Consultation Time
                      </h3>
                      <p className="font-montserrat text-xs sm:text-sm text-[#555555] font-normal leading-relaxed">
                        Select a convenient date and time for your telehealth consultation.
                      </p>
                    </div>

                    {/* Date Selector */}
                    <div className="mb-6">
                      <span className="font-montserrat text-xs font-medium uppercase tracking-wider text-[#111827] block mb-2.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        Available Dates
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {availableDates.map((item) => {
                          const isSelected = selectedDate === item.date;
                          const [weekday, dayMonth] = item.label.split(', ');

                          return (
                            <button
                              key={item.date}
                              type="button"
                              onClick={() => setSelectedDate(item.date)}
                              className={`p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'border-accent bg-accent text-white shadow-xs'
                                  : 'border-[#DCE8F1] bg-white text-[#111827] hover:border-accent/50 hover:bg-[#F3F9FD]/60'
                              }`}
                            >
                              <span
                                className={`block font-montserrat text-xs font-normal mb-0.5 ${
                                  isSelected ? 'text-white/80' : 'text-[#555555]'
                                }`}
                              >
                                {weekday}
                              </span>
                              <span className="block font-montserrat text-sm font-semibold">
                                {dayMonth}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slot Selection */}
                    <div className="mb-6">
                      <span className="font-montserrat text-xs font-medium uppercase tracking-wider text-[#111827] block mb-2.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        Available Time Slots (AEST)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {timeSlots.map((slot) => {
                          const isSelected = selectedTime === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`py-3 px-4 rounded-2xl border text-center font-montserrat text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                                isSelected
                                  ? 'border-accent bg-[#F1F8FC] text-accent ring-1 ring-accent font-semibold shadow-2xs'
                                  : 'border-[#DCE8F1] bg-white text-[#111827] hover:border-accent/50 hover:bg-[#F3F9FD]/60'
                              }`}
                            >
                              {slot}
                              {isSelected && <Check className="w-3.5 h-3.5 text-accent" strokeWidth={2.5} />}
                            </button>
                          );
                        })}
                      </div>
                      <p className="font-montserrat text-xs text-[#555555] mt-2.5 leading-relaxed">
                        All consultation times are shown in Australian Eastern Standard Time (AEST). Automatic calendar conversions will be included in your confirmation.
                      </p>
                    </div>

                    {/* Telehealth Format */}
                    <div>
                      <span className="font-montserrat text-xs font-medium uppercase tracking-wider text-[#111827] block mb-2.5 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-accent" />
                        Telehealth Format
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setConsultFormat('video')}
                          className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${
                            consultFormat === 'video'
                              ? 'border-accent bg-[#F1F8FC] shadow-2xs ring-1 ring-accent'
                              : 'border-[#DCE8F1] bg-white hover:border-accent/50 hover:bg-[#F3F9FD]/60'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-white border border-[#DCE8F1] flex items-center justify-center flex-shrink-0 text-accent">
                            <Video className="w-4 h-4 text-accent" strokeWidth={1.85} />
                          </div>
                          <div>
                            <div className="font-montserrat text-sm font-medium text-[#111827] mb-0.5">
                              Secure Video Call
                            </div>
                            <div className="font-montserrat text-xs text-[#555555]">
                              Zoom / Google Meet encrypted link
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setConsultFormat('phone')}
                          className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${
                            consultFormat === 'phone'
                              ? 'border-accent bg-[#F1F8FC] shadow-2xs ring-1 ring-accent'
                              : 'border-[#DCE8F1] bg-white hover:border-accent/50 hover:bg-[#F3F9FD]/60'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-white border border-[#DCE8F1] flex items-center justify-center flex-shrink-0 text-accent">
                            <Phone className="w-4 h-4 text-accent" strokeWidth={1.85} />
                          </div>
                          <div>
                            <div className="font-montserrat text-sm font-medium text-[#111827] mb-0.5">
                              Direct Phone Call
                            </div>
                            <div className="font-montserrat text-xs text-[#555555]">
                              Selvi will call your mobile number
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 3: CLINICAL INTAKE                                  */}
                {/* -------------------------------------------------------- */}
                {step === 3 && (
                  <div>
                    {/* Section Heading */}
                    <div className="mb-5 sm:mb-6">
                      <h3 className="font-montserrat text-xl sm:text-2xl font-medium text-[#111827] leading-tight mb-1.5">
                        Tell Us About Yourself
                      </h3>
                      <p className="font-montserrat text-xs sm:text-sm text-[#555555] font-normal leading-relaxed">
                        Please provide the details needed for Practitioner Selvi to prepare for your consultation.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1.5">
                            Full Legal Name <span className="text-accent">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sarah Jenkins"
                              value={patientDetails.fullName}
                              onChange={(e) =>
                                setPatientDetails({ ...patientDetails, fullName: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8F1] text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1.5">
                            Email Address <span className="text-accent">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="email"
                              required
                              placeholder="e.g. sarah@example.com"
                              value={patientDetails.email}
                              onChange={(e) =>
                                setPatientDetails({ ...patientDetails, email: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8F1] text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1.5">
                            Contact Phone Number <span className="text-accent">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="e.g. 0416 177 347 or +61..."
                              value={patientDetails.phone}
                              onChange={(e) =>
                                setPatientDetails({ ...patientDetails, phone: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8F1] text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1.5">
                            Country / Location
                          </label>
                          <div className="relative">
                            <Globe className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                              value={patientDetails.country}
                              onChange={(e) =>
                                setPatientDetails({ ...patientDetails, country: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8F1] text-sm text-[#111827] font-montserrat focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white cursor-pointer"
                            >
                              <option value="Australia (AEST)">Australia (AEST / AEDT)</option>
                              <option value="Australia (AWST)">Australia (AWST - Perth)</option>
                              <option value="New Zealand (NZST)">New Zealand (NZST)</option>
                              <option value="United States (PST/EST)">United States (PST / EST)</option>
                              <option value="United Kingdom (GMT)">United Kingdom (GMT)</option>
                              <option value="Other International">Other International</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1">
                          Current Prescription Medications & Supplements
                        </label>
                        <p className="font-montserrat text-xs text-[#555555] mb-1.5">
                          Crucial for prescription safety screening (e.g. blood thinners, statins, SSRIs, thyroid medication, PPIs).
                        </p>
                        <textarea
                          rows={2}
                          placeholder="List any daily prescription drugs, over-the-counter tablets, or current supplements..."
                          value={patientDetails.currentMedications}
                          onChange={(e) =>
                            setPatientDetails({ ...patientDetails, currentMedications: e.target.value })
                          }
                          className="w-full p-3 rounded-xl border border-[#DCE8F1] text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1">
                          Primary Health Goals & Symptoms
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Briefly describe what you would most like Selvi to address during this consultation..."
                          value={patientDetails.healthGoals}
                          onChange={(e) =>
                            setPatientDetails({ ...patientDetails, healthGoals: e.target.value })
                          }
                          className="w-full p-3 rounded-xl border border-[#DCE8F1] text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                        />
                      </div>

                      {/* Consent Checkbox */}
                      <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={patientDetails.consentAgreed}
                            onChange={(e) =>
                              setPatientDetails({ ...patientDetails, consentAgreed: e.target.checked })
                            }
                            className="mt-0.5 w-4 h-4 rounded text-accent focus:ring-accent border-[#DCE8F1] cursor-pointer"
                          />
                          <span className="font-montserrat text-xs text-[#555555] leading-relaxed">
                            I understand that this clinical consultation is conducted by Practitioner Selvi under professional guidelines. I agree to share my health history for nutritional evaluation. All information is kept strictly confidential.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 4: CONFIRMATION                                     */}
                {/* -------------------------------------------------------- */}
                {step === 4 && (
                  <div className="text-center py-3 sm:py-6 space-y-6 max-w-lg mx-auto">
                    <div className="w-14 h-14 rounded-full bg-[#E8F5FC] border border-[#D9EFFB] text-accent flex items-center justify-center mx-auto shadow-2xs">
                      <CheckCircle2 className="w-7 h-7 text-accent" strokeWidth={2} />
                    </div>

                    <div>
                      <h3 className="font-montserrat text-2xl sm:text-3xl font-medium text-[#111827] mb-1.5">
                        Your Booking Is Confirmed
                      </h3>
                      <p className="font-montserrat text-xs sm:text-sm text-[#555555] leading-relaxed">
                        Thank you, <strong className="text-[#111827] font-medium">{patientDetails.fullName || 'Patient'}</strong>. Your telehealth appointment with Practitioner Selvi has been scheduled.
                      </p>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#F3F9FD]/70 border border-[#DCE8F1] rounded-2xl p-5 text-left space-y-3">
                      <div className="flex justify-between items-center border-b border-[#DCE8F1]/70 pb-2.5">
                        <span className="font-montserrat text-xs text-[#555555]">Clinical Service</span>
                        <span className="font-montserrat text-xs sm:text-sm font-medium text-[#111827] text-right">
                          {selectedService?.title}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#DCE8F1]/70 pb-2.5">
                        <span className="font-montserrat text-xs text-[#555555]">Consultation Tier</span>
                        <span className="font-montserrat text-xs sm:text-sm font-medium text-[#111827]">
                          {selectedTier.name} (A${selectedTier.priceAUD})
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#DCE8F1]/70 pb-2.5">
                        <span className="font-montserrat text-xs text-[#555555]">Date & Time</span>
                        <span className="font-montserrat text-xs sm:text-sm font-medium text-[#111827]">
                          {selectedDate} at {selectedTime} (AEST)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-montserrat text-xs text-[#555555]">Format</span>
                        <span className="font-montserrat text-xs sm:text-sm font-semibold text-accent">
                          {consultFormat === 'video' ? 'Secure Video Call (Zoom)' : 'Direct Phone Call'}
                        </span>
                      </div>
                    </div>

                    {/* Safety & Preparation Notice */}
                    <div className="p-4 rounded-xl bg-white border border-[#DCE8F1] text-xs text-[#555555] text-left flex items-start gap-3 shadow-2xs font-montserrat">
                      <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.85} />
                      <p className="leading-relaxed">
                        A confirmation email with calendar invitation and telehealth meeting link has been dispatched to{' '}
                        <strong className="text-[#111827] font-medium">{patientDetails.email || 'your email'}</strong>. Please prepare any recent blood test results or pathology reports for Selvi to review.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ============================================================== */}
          {/* 4. REFINED FOOTER CONTROLS                                     */}
          {/* ============================================================== */}
          <div className="px-4 sm:px-8 py-3.5 sm:py-4 bg-white border-t border-[#DCE8F1] flex items-center justify-between flex-shrink-0">
            {step > 1 && step < 4 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full border border-[#DCE8F1] text-xs sm:text-sm font-montserrat font-medium text-[#555555] hover:text-[#111827] hover:bg-[#F3F9FD] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={handleNext}
                className="group inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 rounded-full bg-accent text-white text-xs sm:text-sm font-montserrat font-medium hover:bg-accent-strong transition-all duration-300 shadow-[0_4px_14px_rgba(66,169,229,0.3)] hover:shadow-[0_6px_20px_rgba(7,137,210,0.4)] cursor-pointer ml-auto active:scale-[0.98]"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={!isStep3Valid}
                onClick={handleNext}
                className={`group inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-montserrat font-medium transition-all duration-300 shadow-[0_4px_14px_rgba(66,169,229,0.3)] ml-auto ${
                  !isStep3Valid
                    ? 'bg-[#60748A]/30 text-white cursor-not-allowed shadow-none'
                    : 'bg-accent text-white hover:bg-accent-strong hover:shadow-[0_6px_20px_rgba(7,137,210,0.4)] cursor-pointer active:scale-[0.98]'
                }`}
              >
                <span>Confirm Booking</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-accent text-white hover:bg-accent-strong text-xs sm:text-sm font-montserrat font-medium transition-all duration-300 shadow-[0_4px_14px_rgba(66,169,229,0.3)] cursor-pointer mx-auto active:scale-[0.98]"
              >
                Done & Return to Website
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
