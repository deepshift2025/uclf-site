
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Gavel, Filter, Search, MoreVertical, CheckCircle, Clock, 
  AlertCircle, ChevronRight, ChevronLeft, User, MapPin, Calendar as CalendarIcon, 
  Download, Plus, PieChart, Briefcase, FileText, Settings,
  Scale, Users, Upload, ExternalLink, ShieldCheck, Save,
  LogOut, Trash2, BookOpen, Bookmark, X, ArrowLeft, ArrowRight,
  ChevronDown, MessageSquare, Eye, Phone, Activity
} from 'lucide-react';
import { CaseStatus, UrgencyLevel, LegalProgram, LegalAidRequest } from '../types';
import { useNavigate } from 'react-router-dom';

const INITIAL_CASES: LegalAidRequest[] = [
  {
    id: '1',
    caseRef: 'UCLF-2024-8192',
    requesterName: 'Jane Nakato',
    requesterContact: '0701XXXXXX',
    description: 'High Court Bail application for capital offense suspect. The applicant has been in custody for over 120 days without trial.',
    urgency: UrgencyLevel.HIGH,
    status: CaseStatus.IN_PROGRESS,
    submissionDate: '2024-03-15',
    program: LegalProgram.BAIL_BOND_ASSIST,
    courtLevel: 'High Court',
    assignedAdvocate: 'Counsel David K.',
    latestUpdate: 'Sureties verified by regional coordinator. Hearing set for next Tuesday.'
  },
  {
    id: '2',
    caseRef: 'UCLF-2024-7721',
    requesterName: 'John Baptist',
    requesterContact: '0772XXXXXX',
    description: 'Plea bargain coordination for 15 inmates in Kayunga Prison. Minor offenses including theft and common assault.',
    urgency: UrgencyLevel.MEDIUM,
    status: CaseStatus.ASSIGNED,
    submissionDate: '2024-03-10',
    program: LegalProgram.KAYUNGA_PLEA_BARGAIN,
    courtLevel: 'Chief Magistrates Court',
    assignedAdvocate: 'Current User',
    latestUpdate: 'Preliminary list of candidates sent to DPP for review.'
  },
  {
    id: '3',
    caseRef: 'UCLF-2024-5501',
    requesterName: 'Sarah Namono',
    requesterContact: '0755XXXXXX',
    description: 'Land eviction case for widow in Masaka region. Attempted land grabbing by extended family members.',
    urgency: UrgencyLevel.HIGH,
    status: CaseStatus.PENDING,
    submissionDate: '2024-03-18',
    program: LegalProgram.LAND_MEDIATION,
    courtLevel: 'High Court - Land Division',
    latestUpdate: 'Initial assessment completed. Waiting for regional hub verification of indigent status.'
  },
  {
    id: '4',
    caseRef: 'UCLF-2024-6612',
    requesterName: 'Moses Okello',
    requesterContact: '0788XXXXXX',
    description: 'Magistrates representation for theft charge. Suspect claims mistaken identity.',
    urgency: UrgencyLevel.LOW,
    status: CaseStatus.ASSIGNED,
    submissionDate: '2024-03-20',
    program: LegalProgram.MAGISTRATES_REP,
    courtLevel: 'Magistrates Court Grade I',
    assignedAdvocate: 'Current User',
    latestUpdate: 'File requisitioned from police. First mention next Friday.'
  }
];

const CaseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');
  const [caseList, setCaseList] = useState<LegalAidRequest[]>(INITIAL_CASES);
  
  const UCLF_LOGO = "https://i.postimg.cc/TYDvMJrD/UCLF-LOGO-(1).png";

  const [caseFilter, setCaseFilter] = useState<'all' | 'assigned' | 'pending' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState<LegalAidRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('uclf_user');
    navigate('/');
    window.location.reload();
  };

  const filteredCases = useMemo(() => {
    return caseList.filter(c => {
      const matchesSearch = c.caseRef.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTabFilter = (() => {
        if (caseFilter === 'all') return true;
        if (caseFilter === 'assigned') return c.status !== CaseStatus.PENDING;
        if (caseFilter === 'pending') return c.status === CaseStatus.PENDING;
        if (caseFilter === 'urgent') return c.urgency === UrgencyLevel.HIGH;
        return true;
      })();

      if (activeSidebarTab === 'pro-bono') {
        return matchesSearch && c.assignedAdvocate === 'Current User';
      }
      
      return matchesSearch && matchesTabFilter;
    });
  }, [searchTerm, caseFilter, activeSidebarTab, caseList]);

  const updateCaseStatus = (caseId: string, newStatus: CaseStatus) => {
    setCaseList(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
    setIsDetailModalOpen(false);
  };

  const getUrgencyColor = (u: UrgencyLevel) => {
    switch(u) {
      case UrgencyLevel.HIGH: return 'bg-red-50 text-red-600 border-red-100';
      case UrgencyLevel.MEDIUM: return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case UrgencyLevel.LOW: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getStatusColor = (s: CaseStatus) => {
    switch(s) {
      case CaseStatus.IN_PROGRESS: return 'bg-yellow-500 text-white';
      case CaseStatus.ASSIGNED: return 'bg-blue-600 text-white';
      case CaseStatus.RESOLVED: return 'bg-green-600 text-white';
      case CaseStatus.PENDING: return 'bg-orange-500 text-white';
      case CaseStatus.CLOSED: return 'bg-slate-800 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <aside className="w-64 bg-[#1e3a8a] hidden lg:flex flex-col text-white">
        <div className="p-8 border-b border-white/10">
           <div className="flex items-center space-x-4">
              <div className="h-14 w-14 flex items-center justify-center">
                <img src={UCLF_LOGO} alt="UCLF Logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="font-bold text-xl tracking-tight">Counsel Hub</span>
           </div>
        </div>
        <nav className="p-4 space-y-1 flex-grow mt-6">
          {[
            { id: 'overview', name: 'Case Overview', icon: <PieChart size={18} /> },
            { id: 'pro-bono', name: 'My Case Load', icon: <Gavel size={18} /> },
            { id: 'settings', name: 'Profile', icon: <Settings size={18} /> },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveSidebarTab(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all font-semibold text-sm ${activeSidebarTab === item.id ? 'bg-white/10 text-secondary border-r-4 border-secondary' : 'text-blue-100 hover:bg-white/5'}`}
            >
              <span className={activeSidebarTab === item.id ? 'text-secondary' : 'text-blue-300'}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-6 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-all font-bold text-sm">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between sticky top-0 z-40 shadow-sm">
           <div>
                <h1 className="text-3xl font-bold text-gray-900 font-serif">
                  {activeSidebarTab === 'overview' ? 'Fraternity Dashboard' : 'My Legal Portfolio'}
                </h1>
                <p className="text-sm text-gray-500 font-medium mt-1">Republic of Uganda • Digital Case Registry</p>
           </div>
           <button onClick={() => setIsIntakeModalOpen(true)} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
             <Plus size={20} className="mr-2" /> Log Intake
           </button>
        </header>

        <div className="p-10">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center space-x-4">
                <Search className="text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search case dossiers..." 
                  className="bg-transparent border-none outline-none text-sm font-medium w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex p-1 bg-gray-100 rounded-2xl space-x-1">
                {['all', 'assigned', 'pending'].map(f => (
                  <button key={f} onClick={() => setCaseFilter(f as any)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${caseFilter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>{f}</button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-10 py-5">Case Dossier</th>
                    <th className="px-10 py-5">Program</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5">Log Date</th>
                    <th className="px-10 py-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCases.map(c => (
                    <tr key={c.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group" onClick={() => { setSelectedCase(c); setIsDetailModalOpen(true); }}>
                      <td className="px-10 py-7">
                        <p className="text-sm font-black text-gray-900">{c.caseRef}</p>
                        <p className="text-xs text-gray-500">{c.requesterName}</p>
                      </td>
                      <td className="px-10 py-7 text-xs font-bold text-gray-600">{c.program}</td>
                      <td className="px-10 py-7">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(c.status)}`}>{c.status}</span>
                      </td>
                      <td className="px-10 py-7 text-xs font-medium text-gray-400">{c.submissionDate}</td>
                      <td className="px-10 py-7 text-center">
                        <button className="text-primary hover:scale-110 transition-transform"><Eye size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Case Detail Modal */}
      {isDetailModalOpen && selectedCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-5xl relative z-10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-400 h-[90vh] flex flex-col">
             
             <header className="bg-primary p-10 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-6">
                   <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-secondary border border-white/20 shadow-inner">
                      <FileText size={32} />
                   </div>
                   <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h2 className="text-3xl font-black font-serif">{selectedCase.caseRef}</h2>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(selectedCase.status)}`}>
                          {selectedCase.status}
                        </span>
                      </div>
                      <p className="text-xs text-blue-200 uppercase font-black tracking-widest">Master Case Dossier • Republic of Uganda Registry</p>
                   </div>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                  <X size={32} />
                </button>
             </header>

             <div className="flex-grow overflow-y-auto flex flex-col lg:flex-row custom-scrollbar">
                <div className="flex-grow p-12 space-y-12">
                   <section>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6 flex items-center">
                        <User size={16} className="mr-2 text-primary" /> Applicant Identity
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Legal Name</p>
                            <p className="text-lg font-black text-gray-900">{selectedCase.requesterName}</p>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Verification</p>
                            <p className="text-lg font-black text-primary flex items-center">
                               <Phone size={16} className="mr-2" /> {selectedCase.requesterContact}
                            </p>
                         </div>
                      </div>
                   </section>

                   <section>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6 flex items-center">
                        <Gavel size={16} className="mr-2 text-primary" /> Case Program
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="flex items-start space-x-4 p-6 bg-blue-50/30 rounded-3xl border border-blue-50">
                            <div className="bg-white p-3 rounded-2xl text-primary shadow-sm"><Scale size={24} /></div>
                            <div>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Program</p>
                               <p className="font-black text-gray-900 leading-tight">{selectedCase.program}</p>
                            </div>
                         </div>
                         <div className="flex items-start space-x-4 p-6 bg-blue-50/30 rounded-3xl border border-blue-50">
                            <div className="bg-white p-3 rounded-2xl text-primary shadow-sm"><MapPin size={24} /></div>
                            <div>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Venue</p>
                               <p className="font-black text-gray-900 leading-tight">{selectedCase.courtLevel}</p>
                            </div>
                         </div>
                      </div>
                   </section>

                   <section>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Description</h3>
                      <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
                         <p className="text-gray-700 leading-relaxed italic font-medium">"{selectedCase.description}"</p>
                      </div>
                   </section>

                   <section>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6 flex items-center">
                        <Activity size={16} className="mr-2 text-primary" /> Latest Update
                      </h3>
                      <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex items-start space-x-6 relative overflow-hidden group">
                         <div className="bg-primary p-4 rounded-2xl text-secondary shadow-lg shrink-0"><MessageSquare size={24} /></div>
                         <div>
                            <p className="text-base font-bold text-primary leading-relaxed italic">"{selectedCase.latestUpdate || 'No updates logged yet.'}"</p>
                         </div>
                      </div>
                   </section>
                </div>

                <div className="w-full lg:w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
                   <div className="p-12 space-y-12 flex-grow">
                      <section className="space-y-6">
                         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 pb-4">Metadata</h3>
                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgency</span>
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 ${getUrgencyColor(selectedCase.urgency)}`}>{selectedCase.urgency}</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Counsel</span>
                               <span className="text-sm font-black text-primary">{selectedCase.assignedAdvocate || 'Unassigned'}</span>
                            </div>
                         </div>
                      </section>

                      <section className="space-y-8">
                         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 pb-4">Transition Workflow</h3>
                         <div className="grid grid-cols-1 gap-4">
                            {[
                              { status: CaseStatus.ASSIGNED, color: 'bg-blue-600', icon: <User size={16} /> },
                              { status: CaseStatus.IN_PROGRESS, color: 'bg-yellow-500', icon: <Clock size={16} /> },
                              { status: CaseStatus.RESOLVED, color: 'bg-green-600', icon: <CheckCircle size={16} /> },
                              { status: CaseStatus.CLOSED, color: 'bg-slate-800', icon: <X size={16} /> }
                            ].map(btn => (
                              <button key={btn.status} onClick={() => updateCaseStatus(selectedCase.id, btn.status)} className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center text-white ${btn.color} hover:brightness-110 active:scale-95`}>
                                {btn.icon} <span className="ml-3">Mark {btn.status}</span>
                              </button>
                            ))}
                         </div>
                      </section>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
