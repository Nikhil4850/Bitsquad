import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  Clock, 
  DollarSign, 
  Award, 
  BookOpen, 
  Video, 
  MessageSquare,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  UserCheck,
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  feePerMinute: number;
  availability: 'available' | 'busy' | 'offline';
  image: string;
  education: string;
  languages: string[];
  casesHandled: number;
  successRate: number;
  bio: string;
  expertise: string[];
}

const LawyerAdvice: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);

  const lawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      specialty: 'Contract Law',
      experience: '15 years',
      rating: 4.9,
      reviews: 234,
      feePerMinute: 8.50,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      education: 'Harvard Law School',
      languages: ['English', 'Spanish'],
      casesHandled: 1200,
      successRate: 94,
      bio: 'Specialized in contract negotiations and corporate agreements with extensive experience in tech industry contracts.',
      expertise: ['Contract Review', 'Negotiation', 'Corporate Law', 'Tech Agreements']
    },
    {
      id: '2',
      name: 'Michael Chen',
      specialty: 'Intellectual Property',
      experience: '12 years',
      rating: 4.8,
      reviews: 189,
      feePerMinute: 10.00,
      availability: 'busy',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      education: 'Stanford Law School',
      languages: ['English', 'Mandarin'],
      casesHandled: 890,
      successRate: 91,
      bio: 'Expert in intellectual property law, patents, trademarks, and copyright protection for startups and enterprises.',
      expertise: ['Patents', 'Trademarks', 'Copyright', 'Trade Secrets']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      specialty: 'Employment Law',
      experience: '10 years',
      rating: 4.7,
      reviews: 156,
      feePerMinute: 7.00,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      education: 'Yale Law School',
      languages: ['English', 'Spanish', 'French'],
      casesHandled: 750,
      successRate: 89,
      bio: 'Focused on employment law, worker rights, and workplace discrimination cases with a proven track record.',
      expertise: ['Employment Contracts', 'Discrimination', 'Workplace Policies', 'Labor Law']
    },
    {
      id: '4',
      name: 'David Thompson',
      specialty: 'Real Estate Law',
      experience: '18 years',
      rating: 4.9,
      reviews: 312,
      feePerMinute: 6.50,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      education: 'Columbia Law School',
      languages: ['English'],
      casesHandled: 1500,
      successRate: 96,
      bio: 'Real estate law expert with extensive experience in property transactions, zoning, and landlord-tenant disputes.',
      expertise: ['Property Transactions', 'Lease Agreements', 'Zoning', 'Title Issues']
    },
    {
      id: '5',
      name: 'Lisa Park',
      specialty: 'Family Law',
      experience: '8 years',
      rating: 4.6,
      reviews: 98,
      feePerMinute: 5.50,
      availability: 'offline',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      education: 'NYU School of Law',
      languages: ['English', 'Korean'],
      casesHandled: 420,
      successRate: 87,
      bio: 'Compassionate family law attorney specializing in divorce, child custody, and domestic partnership agreements.',
      expertise: ['Divorce', 'Child Custody', 'Prenuptial Agreements', 'Adoption']
    },
    {
      id: '6',
      name: 'James Wilson',
      specialty: 'Corporate Law',
      experience: '20 years',
      rating: 4.8,
      reviews: 278,
      feePerMinute: 12.00,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      education: 'University of Chicago Law School',
      languages: ['English', 'German'],
      casesHandled: 1800,
      successRate: 92,
      bio: 'Seasoned corporate attorney with expertise in mergers, acquisitions, and complex business transactions.',
      expertise: ['Mergers & Acquisitions', 'Corporate Governance', 'Securities', 'Business Formation']
    }
  ];

  const specialties = ['all', 'Contract Law', 'Intellectual Property', 'Employment Law', 'Real Estate Law', 'Family Law', 'Corporate Law'];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'all' || lawyer.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'busy': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'offline': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available Now';
      case 'busy': return 'In Consultation';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const handleStartConsultation = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    // Here you would typically initiate a video call or chat session
    console.log('Starting consultation with:', lawyer.name);
  };

  const handleScheduleConsultation = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    // Here you would typically open a scheduling modal
    console.log('Scheduling consultation with:', lawyer.name);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Expert Legal Advice</h1>
        <p className="text-slate-600">
          Connect with experienced lawyers for personalized legal guidance. Pay per minute for expert consultation.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{lawyers.length}</div>
              <div className="text-sm text-slate-600">Expert Lawyers</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {lawyers.filter(l => l.availability === 'available').length}
              </div>
              <div className="text-sm text-slate-600">Available Now</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">4.8</div>
              <div className="text-sm text-slate-600">Average Rating</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">$5-12</div>
              <div className="text-sm text-slate-600">Per Minute</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-slate-400 mt-3" />
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSpecialty === specialty
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLawyers.map((lawyer) => (
          <div key={lawyer.id} className="bg-white rounded-xl border border-slate-200 shadow-soft hover:shadow-lg transition-shadow">
            {/* Lawyer Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{lawyer.name}</h3>
                  <p className="text-sm text-primary-600 font-medium">{lawyer.specialty}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-sm font-medium text-slate-900">{lawyer.rating}</span>
                    </div>
                    <span className="text-sm text-slate-400">({lawyer.reviews} reviews)</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(lawyer.availability)}`}>
                  {getAvailabilityText(lawyer.availability)}
                </div>
              </div>
            </div>

            {/* Lawyer Details */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{lawyer.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{lawyer.education}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{lawyer.casesHandled} cases handled</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Award className="w-4 h-4" />
                  <span>{lawyer.successRate}% success rate</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 line-clamp-2">{lawyer.bio}</p>
              </div>

              <div className="mb-4">
                <div className="text-xs font-medium text-slate-500 mb-2">Expertise:</div>
                <div className="flex flex-wrap gap-1">
                  {lawyer.expertise.slice(0, 3).map((exp, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      {exp}
                    </span>
                  ))}
                  {lawyer.expertise.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      +{lawyer.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Fee and Actions */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">${lawyer.feePerMinute}</div>
                    <div className="text-sm text-slate-500">per minute</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Languages:</div>
                    <div className="text-xs font-medium text-slate-700">{lawyer.languages.join(', ')}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {lawyer.availability === 'available' ? (
                    <button
                      onClick={() => handleStartConsultation(lawyer)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Start Consultation
                    </button>
                  ) : (
                    <button
                      onClick={() => handleScheduleConsultation(lawyer)}
                      className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </button>
                  )}
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLawyers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No lawyers found</h3>
          <p className="text-slate-600">Try adjusting your search or filters to find available lawyers.</p>
        </div>
      )}
    </div>
  );
};

export default LawyerAdvice;
