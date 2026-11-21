import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  HeartPulse,
  Flame,
  Car,
  AlertTriangle,
  Baby,
  CloudLightning,
  Laptop,
  TrainFront,
  Users,
  Brain,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MessageSquareText,
  Timer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { User } from '../services/storageService.ts';

interface EmergencyAlertScreenProps {
  user: User;
  onNavigate: (screen: string) => void;
  onRequestLocationPermission: (actionType: 'alert' | 'location' | 'sos', payload?: unknown) => void;
}

const EMERGENCY_CATEGORIES = [
  {
    type: 'Medical Emergency',
    icon: <HeartPulse className="w-8 h-8 text-rose-400" />,
    helpline: 'Ambulance 108',
    description: 'Can be used in situations like severe illness, heart attack, unconsciousness, trauma, allergy or poisoning.',
    whenToCall: 'Chest pain, breathing difficulty, unconsciousness, heavy bleeding, seizure, severe allergic reaction.',
    whatToSay: ['Your name + exact location / landmark', 'Patient age + what happened', 'Is the patient conscious? Is breathing normal?', 'Any known disease / medicine / allergy'],
    doList: ['Do not move the patient, keep them lying straight', 'If bleeding, press with a clean cloth', 'Loosen tight clothes / belt', 'Keep the path clear for the ambulance'],
    dontList: ['Do not give water to an unconscious person', 'Do not give any medicine / injection on your own', 'Do not leave a heart attack patient alone'],
    firstStep: 'First check if the patient is breathing. If not breathing, call 108 immediately and follow their CPR instructions.',
  },
  {
    type: 'Women Safety',
    icon: <ShieldAlert className="w-8 h-8 text-purple-400" />,
    helpline: 'Women Helpline 1091',
    description: 'Can be used in situations like harassment, stalking, distress during travel, or physical safety threats.',
    whenToCall: 'Harassment, stalking, unsafe cab / travel, domestic violence, or if someone is following you.',
    whatToSay: ['Your name + current location / vehicle number', 'What is happening + how many people are involved', 'Are you safe right now or moving?', 'Is there any landmark / shop / police station nearby?'],
    doList: ['Move to a crowded / well-lit area', 'Share live location with a trusted contact', 'Keep the call on speaker', 'Save vehicle number / photo as proof'],
    dontList: ['Do not go on an empty / dark road alone', 'Do not take a lift from strangers', 'Do not switch off your phone'],
    firstStep: 'Immediately call 1091 / 112, keep your location ON and move to a crowded / open place.',
  },
  {
    type: 'Road Accident',
    icon: <Car className="w-8 h-8 text-amber-400" />,
    helpline: 'Highway Relief 1033',
    description: 'Can be used in situations like vehicle collisions, hit-and-run, highway accidents, or trapped passenger rescue.',
    whenToCall: 'Vehicle collision, hit-and-run, highway accident, or if someone is injured on the road.',
    whatToSay: ['Highway name + direction + nearest toll / milestone', 'How many vehicles are involved + how many people are injured', 'Is there any fire / fuel leak?', 'Is anyone trapped inside?'],
    doList: ['Turn on hazard lights, place warning triangle', 'Move injured person to a safe place on the side', 'Press a cloth on bleeding area', 'Slow down the traffic around the spot'],
    dontList: ['Do not pull out an injured person forcefully', 'Do not crowd the accident spot', 'Do not give water / food to the injured person'],
    firstStep: 'Park your vehicle on the side, turn on hazard lights, first call 108 / 1033, then help the injured.',
  },
  {
    type: 'Crime / Assault',
    icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
    helpline: 'Police 100 / 112',
    description: 'Can be used in situations like theft, robbery, physical assault, extortion, kidnapping, or suspicious intruders.',
    whenToCall: 'Theft, robbery, assault, kidnapping, extortion or if you see a suspicious person / activity.',
    whatToSay: ['What happened + when + where', 'Description of culprit - height, clothes, vehicle number', 'Was there any weapon?', 'Are you safe now or still in danger?'],
    doList: ['Go to a safe place and lock the door', 'Remember photo / number of culprit', 'Save CCTV / location proof', 'Do not disturb the spot till police arrives'],
    dontList: ['Do not chase the culprit alone', 'Do not erase / touch the evidence', 'Do not post on social media before police'],
    firstStep: 'First make yourself safe, then call 112. Do not argue with or chase the culprit.',
  },
  {
    type: 'Fire Emergency',
    icon: <Flame className="w-8 h-8 text-orange-400" />,
    helpline: 'Fire Brigade 101',
    description: 'Can be used in situations like building fires, electrical short circuits, gas cylinder leaks or chemical hazards.',
    whenToCall: 'Building fire, gas leak smell, fire due to short circuit, cylinder fire.',
    whatToSay: ['Building name + floor + full address', 'Where is the fire + how big is it', 'Is anyone trapped inside?', 'Is there gas / chemical / lift nearby?'],
    doList: ['Exit immediately, do not use the lift', 'Cover nose-mouth with a wet cloth', 'Turn off gas regulator if you can do it safely', 'Stay low while moving - smoke goes up'],
    dontList: ['Do not go back inside to put out the fire', 'Do not pour water on an electrical fire', 'Do not stop to collect belongings'],
    firstStep: 'Raise the alarm, get everyone out, call 101. Move low, use stairs to exit.',
  },
  {
    type: 'Child Safety',
    icon: <Baby className="w-8 h-8 text-blue-400" />,
    helpline: 'Childline 1098',
    description: 'Can be used in situations like child abuse, missing child, child labour or trafficking emergency.',
    whenToCall: 'Child is missing, you see abuse / beating, child labour or suspect trafficking.',
    whatToSay: ['Child name, age, clothes, photo', 'From where / since when missing', 'Who saw the child last', 'Is there any suspicious vehicle / person?'],
    doList: ['Do not leave the child alone, keep them safe', 'Share photo + location immediately', 'Ask nearby CCTV / shops', 'Talk to the child calmly'],
    dontList: ['Do not scold / scare the child', 'Do not post child photo publicly', 'Do not go far alone to search'],
    firstStep: 'Keep the child in a safe place, call 1098 and share photo + location immediately.',
  },
  {
    type: 'Natural Disaster',
    icon: <CloudLightning className="w-8 h-8 text-cyan-400" />,
    helpline: 'Disaster Mgmt 1070',
    description: 'Can be used in situations like flood, earthquake, landslide, cyclone or building collapse rescue.',
    whenToCall: 'Earthquake, flood, cyclone, landslide, building collapse.',
    whatToSay: ['Area + building + how many people are trapped', 'Water / debris level', 'Is anyone injured / unconscious?', 'Is the road blocked or open?'],
    doList: ['Move to a high / open area', 'Keep emergency kit + water + phone with you', 'Keep listening to official alerts', 'Stay away from electric poles / weak walls'],
    dontList: ['Do not believe rumours', 'Do not use lift while running', 'Do not drive in flood water'],
    firstStep: 'Do not panic, move to an open area, call 1070 / 112 and follow official instructions.',
  },
  {
    type: 'Cyber Crime',
    icon: <Laptop className="w-8 h-8 text-indigo-400" />,
    helpline: 'Cyber Crime 1930',
    description: 'Can be used in situations like online fraud, hacking, blackmailing, phishing or identity theft.',
    whenToCall: 'Money deducted, OTP fraud, hacking, blackmail, money lost via fake link.',
    whatToSay: ['How much money lost + when', 'From which number / link / app it came', 'Transaction ID / UTR number', 'Have you informed your bank or not?'],
    doList: ['Immediately call 1930 and get transaction freezed', 'Save screenshots + numbers', 'Call bank and block card', 'Change password immediately'],
    dontList: ['Do not call back / send money to fraudster', 'Do not share OTP / PIN with anyone', 'Do not delete screenshots / chats'],
    firstStep: 'Call 1930 first - chances of freezing money are highest in the first 1 hour.',
  },
  {
    type: 'Railway Emergency',
    icon: <TrainFront className="w-8 h-8 text-slate-300" />,
    helpline: 'Railway Helpline 139',
    description: 'Can be used in situations like train accident, medical need in train, or security threat in railways.',
    whenToCall: 'Medical emergency in train, accident, theft or security threat.',
    whatToSay: ['Train number + coach + berth number', 'Name of next station', 'What is the patient / problem', 'Is TT / RPF nearby?'],
    doList: ['Do not pull chain unless absolutely necessary', 'Inform coach attendant / TT', 'Let the patient get fresh air', 'Keep your PNR / ticket ready'],
    dontList: ['Do not get off a moving train', 'Do not misuse emergency chain', 'Do not eat food given by strangers'],
    firstStep: 'Call 139 + inform TT. Do not forget to tell coach number and next station.',
  },
  {
    type: 'Senior Citizen',
    icon: <Users className="w-8 h-8 text-green-400" />,
    helpline: 'Senior Citizen 14567',
    description: 'Can be used in situations like elder abuse, medical distress, or emergency assistance for seniors.',
    whenToCall: 'Elderly person is alone, has fallen, medical distress or is facing abuse.',
    whatToSay: ['Elderly person name, age, address', 'What happened + since when', 'Any medicine / disease?', 'Is any family member nearby?'],
    doList: ['Make the elderly person sit comfortably, give water', 'Keep their medicine / prescription with you', 'Inform family immediately', 'Do not move them suddenly if they fell'],
    dontList: ['Do not leave the elderly person alone', 'Do not ignore what they are saying', 'Do not give medicine without asking'],
    firstStep: 'Make them sit safely, call 14567 / 108 and inform family.',
  },
  {
    type: 'Mental Health Crisis',
    icon: <Brain className="w-8 h-8 text-teal-400" />,
    helpline: 'Kiran Helpline 14416',
    description: 'Can be used in situations like suicidal thoughts, severe anxiety, depression or panic attack support.',
    whenToCall: 'Suicidal thoughts, panic attack, severe anxiety, depression, urge to harm yourself.',
    whatToSay: ['Where are you + are you alone or with someone', 'How are you feeling right now', 'Have you harmed yourself', 'Is there someone nearby who can help?'],
    doList: ['Sit in a calm place, take deep breaths', 'Call someone you trust', 'Do not keep yourself alone', 'Call 14416 - it is confidential'],
    dontList: ['Do not blame yourself', 'Do not take alcohol / sleeping pills', 'Do not suppress your feelings'],
    firstStep: 'You are not alone. Call 14416 immediately or call someone close to you. Breathe slowly - 4 sec in, 4 sec out.',
  },
];

export const EmergencyAlertScreen: React.FC<EmergencyAlertScreenProps> = ({
  user,
  onNavigate,
  onRequestLocationPermission,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const selected = EMERGENCY_CATEGORIES.find(c => c.type === selectedType);

  useEffect(() => {
    if (selectedType && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedType]);

  const handleCardClick = (type: string) => {
    setSelectedType(prev => (prev === type ? null : type));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-1.5 text-xs text-[#27d3ff] hover:underline mb-4 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-[#27d3ff]" />
        <span>Emergency Guide</span>
      </h1>
      <p className="text-xs sm:text-sm text-[#9fb0d6] mt-1 mb-8">
        Know when and how to use each emergency helpline. Select a type to understand its use.
      </p>

      <div className="mb-8">
        <h2 className="text-sm font-bold text-white mb-3">1. Select Emergency Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CATEGORIES.map((cat) => {
            const isActive = selectedType === cat.type;
            return (
              <div
                key={cat.type}
                onClick={() => handleCardClick(cat.type)}
                className={`glass p-5 rounded-2xl cursor-pointer border transition-all ${
                  isActive
                    ? 'border-[#27d3ff] bg-[#0d2257]/60 shadow-[0_0_20px_rgba(39,211,255,0.3)]'
                    : 'border-[#78aaff]/15 hover:border-[#78aaff]/30'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#050b1f] border border-[#78aaff]/10 flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#0d2257] border border-[#2f7bff]/30 text-[#27d3ff] font-mono">
                    {cat.helpline}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{cat.type}</h3>
                <p className="text-xs text-[#9fb0d6] mt-1.5 leading-relaxed">{cat.description}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(cat.type);
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#27d3ff] font-medium mt-3 bg-transparent border-none cursor-pointer p-0 hover:underline"
                >
                  {isActive ? 'Hide Full Guide' : 'Tap to see full guide'}
                  {isActive ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED GUIDE - No Call Button Here, Calling is only in Helplines section */}
      {selected && (
        <div ref={detailRef} className="glass p-5 sm:p-7 rounded-2xl border border-[#27d3ff]/30 space-y-6 scroll-mt-28">
          {/* Header - REMOVED: Call Button */}
          <div className="flex items-center gap-4 pb-4 border-b border-[#78aaff]/15">
            <div className="w-14 h-14 rounded-xl bg-[#050b1f] border border-[#78aaff]/10 flex items-center justify-center shrink-0">
              {selected.icon}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">{selected.type} - Full Guide</h2>
              <p className="text-xs text-[#9fb0d6] mt-0.5">Helpline: <span className="text-[#27d3ff] font-mono font-bold">{selected.helpline}</span></p>
            </div>
          </div>

          {/* When to call + First Step */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#050b1f]/60 border border-[#78aaff]/15 rounded-xl p-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 mb-2"><Timer className="w-4 h-4 text-[#27d3ff]" /> WHEN TO CALL?</h3>
              <p className="text-xs text-[#9fb0d6] leading-relaxed">{selected.whenToCall}</p>
            </div>
            <div className="bg-[#2f7bff]/10 border border-[#2f7bff]/30 rounded-xl p-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> WHAT TO DO IN FIRST 60 SECONDS?</h3>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">{selected.firstStep}</p>
            </div>
          </div>

          {/* What to say */}
          <div className="bg-[#050b1f]/60 border border-[#78aaff]/15 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 mb-3"><MessageSquareText className="w-4 h-4 text-[#27d3ff]" /> WHAT TO SAY ON CALL? (Operator Will Ask This)</h3>
            <ul className="space-y-2">
              {selected.whatToSay.map((s, i) => (
                <li key={i} className="text-xs text-[#9fb0d6] flex gap-2"><span className="text-[#27d3ff] font-bold shrink-0">{i + 1}.</span> {s}</li>
              ))}
            </ul>
          </div>

          {/* DO / DON'T */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-3"><CheckCircle2 className="w-4 h-4" /> WHAT TO DO?</h3>
              <ul className="space-y-2">
                {selected.doList.map((s, i) => (
                  <li key={i} className="text-xs text-[#cbd5e1] flex gap-2"><span className="text-emerald-400 shrink-0">✓</span> {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <h3 className="text-xs font-bold text-red-400 flex items-center gap-2 mb-3"><XCircle className="w-4 h-4" /> WHAT NOT TO DO?</h3>
              <ul className="space-y-2">
                {selected.dontList.map((s, i) => (
                  <li key={i} className="text-xs text-[#cbd5e1] flex gap-2"><span className="text-red-400 shrink-0">✕</span> {s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs sm:text-sm text-white">
              You selected <span className="font-bold text-[#27d3ff]">{selectedType}</span>. To send alert, go to Dashboard.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn py-2.5 px-6 text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};