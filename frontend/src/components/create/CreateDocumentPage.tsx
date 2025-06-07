// CreateDocumentPage.tsx - Complete with all original questions and logo support - FIXED
import React, { useState, useRef } from 'react';
import { DocumentHead } from '../SEO/DocumentHead';
import { 
  FileText, 
  Users, 
  Building, 
  Shield, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Check, 
  AlertCircle,
  Home,
  Briefcase,
  CreditCard,
  UserCheck,
  FileSignature,
  Scale,
  Eye,
  EyeOff,
  ChevronDown,
  Plus,
  Trash2,
  Clock,
  X,
  Sparkles,
  Star,
  Zap,
  Upload,
  Image
} from 'lucide-react';

// Types for document creation - UPDATED WITH LOGO SUPPORT
interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  estimatedTime: string;
  questions: Question[];
  color: string;
  popularity: 'High' | 'Medium' | 'Low';
}

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'radio' | 'checkbox' | 'address' | 'dynamic-list' | 'logo-upload';
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    maxFileSize?: number;
    allowedFormats?: string[];
  };
}

interface FormData {
  [key: string]: any;
}

interface CategoryInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  textColor: string;
}

// Category Information
const categoryInfo: { [key: string]: CategoryInfo } = {
  'Business': {
    name: 'Business',
    description: 'Service agreements, consulting contracts',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'blue',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600'
  },
  'HR': {
    name: 'Human Resources',
    description: 'Employment contracts, HR documents',
    icon: <Users className="h-6 w-6" />,
    color: 'green',
    bgColor: 'bg-green-500',
    textColor: 'text-green-600'
  },
  'Legal': {
    name: 'Legal',
    description: 'NDAs, confidentiality agreements',
    icon: <Scale className="h-6 w-6" />,
    color: 'purple',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-600'
  },
  'Real Estate': {
    name: 'Real Estate',
    description: 'Rental agreements, property contracts',
    icon: <Home className="h-6 w-6" />,
    color: 'orange',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-600'
  },
  'Finance': {
    name: 'Finance',
    description: 'Purchase agreements, financial contracts',
    icon: <DollarSign className="h-6 w-6" />,
    color: 'emerald',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600'
  }
};

// LOGO UPLOAD COMPONENT - FIXED
const LogoUpload: React.FC<{
  value: any;
  onChange: (value: any) => void;
  error?: string;
}> = ({ value, onChange, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.previewUrl || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      onChange({ error: 'Please upload a PNG, JPEG, or JPG file' });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      onChange({ error: 'File size must be less than 5MB' });
      return;
    }

    setIsProcessing(true);

    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Convert to base64 for storage and PDF generation
      const base64 = await fileToBase64(file);
      
      // Process image to get optimized version
      const processedImage = await processImageForDocument(file);

      onChange({
        file: file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        previewUrl: preview,
        base64: base64,
        processedBase64: processedImage.base64,
        width: processedImage.width,
        height: processedImage.height,
        error: null
      });

    } catch (error) {
      console.error('Error processing logo:', error);
      onChange({ error: 'Error processing image. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // FIXED: Proper Image constructor and typing
  const processImageForDocument = (file: File): Promise<{base64: string, width: number, height: number}> => {
    return new Promise((resolve) => {
      const img = document.createElement('img') as HTMLImageElement; // FIXED: Use createElement
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        // Calculate optimal size for document header (max 150px height, maintain aspect ratio)
        const maxHeight = 150;
        const maxWidth = 300;
        
        let { width, height } = img;
        
        // Scale down if too large
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Draw image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const processedBase64 = canvas.toDataURL('image/png', 0.9);
        
        resolve({
          base64: processedBase64,
          width: Math.round(width),
          height: Math.round(height)
        });
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeLogo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const baseClasses = `border-2 border-dashed rounded-lg transition-all duration-200 ${
    error ? 'border-red-300' : dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
  }`;

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          className={`${baseClasses} p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-50`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`p-3 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                ) : (
                  <Upload className={`h-8 w-8 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isProcessing ? 'Processing logo...' : 'Upload Company Logo'}
              </h3>
              <p className="text-gray-600 mb-1">
                Drag and drop your logo here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPEG, JPG up to 5MB
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src={previewUrl}
                alt="Logo preview"
                className="h-20 w-auto border border-gray-200 rounded"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Image className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Logo uploaded successfully</span>
                <Check className="h-4 w-4 text-green-600" />
              </div>
              
              <p className="text-sm text-gray-600 mb-1">
                {value?.fileName} ({Math.round(value?.fileSize / 1024)} KB)
              </p>
              
              <p className="text-xs text-gray-500">
                Optimized to {value?.width}×{value?.height}px for document use
              </p>
            </div>
            
            <button
              onClick={removeLogo}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {value?.error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{value.error}</span>
        </div>
      )}
    </div>
  );
};

// DYNAMIC LIST COMPONENT
const DynamicList: React.FC<{
  value: any;
  onChange: (value: any) => void;
  error?: string;
}> = ({ value, onChange, error }) => {
  const [items, setItems] = useState<string[]>(value || ['']);

  const updateItems = (newItems: string[]) => {
    setItems(newItems);
    onChange(newItems.filter(item => item.trim().length > 0));
  };

  const addItem = () => {
    updateItems([...items, '']);
  };

  const removeItem = (index: number) => {
    updateItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    updateItems(newItems);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Item ${index + 1}`}
            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Item
      </button>
    </div>
  );
};

// COMPLETE DOCUMENT TEMPLATES WITH ALL ORIGINAL QUESTIONS RESTORED
const documentTemplates: DocumentTemplate[] = [
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    description: 'Professional services contract between service provider and client',
    icon: <Briefcase className="h-5 w-5" />,
    category: 'Business',
    estimatedTime: '10-15 mins',
    color: 'blue',
    popularity: 'High',
    questions: [
      // LOGO QUESTION ADDED
      {
        id: 'company_logo',
        type: 'logo-upload',
        question: 'Upload Company Logo (Optional)',
        required: false,
        helpText: 'Upload your company logo to include in the service agreement header.',
        validation: {
          maxFileSize: 5,
          allowedFormats: ['image/png', 'image/jpeg', 'image/jpg']
        }
      },
      {
        id: 'service_provider_name',
        type: 'text',
        question: 'Service Provider Full Name/Company Name',
        required: true,
        placeholder: 'ABC Services LLC'
      },
      {
        id: 'client_name',
        type: 'text',
        question: 'Client Full Name/Company Name',
        required: true,
        placeholder: 'XYZ Corporation'
      },
      {
        id: 'service_provider_address',
        type: 'address',
        question: 'Service Provider Address',
        required: true
      },
      {
        id: 'client_address',
        type: 'address',
        question: 'Client Address',
        required: true
      },
      {
        id: 'services_description',
        type: 'textarea',
        question: 'Detailed Description of Services',
        required: true,
        placeholder: 'Describe the services to be provided in detail...',
        helpText: 'Be specific about deliverables, timelines, and expectations'
      },
      {
        id: 'contract_value',
        type: 'number',
        question: 'Total Contract Value ($)',
        required: true,
        placeholder: '5000'
      },
      {
        id: 'payment_terms',
        type: 'select',
        question: 'Payment Terms',
        required: true,
        options: ['Net 30', 'Net 15', 'Due on Receipt', '50% Upfront, 50% on Completion', 'Monthly Payments', 'Custom']
      },
      {
        id: 'start_date',
        type: 'date',
        question: 'Service Start Date',
        required: true
      },
      {
        id: 'end_date',
        type: 'date',
        question: 'Service End Date (if applicable)',
        required: false
      },
      {
        id: 'deliverables',
        type: 'dynamic-list',
        question: 'Key Deliverables',
        required: true,
        helpText: 'List specific deliverables with deadlines'
      },
      {
        id: 'hourly_rate',
        type: 'number',
        question: 'Hourly Rate ($ - if applicable)',
        required: false,
        placeholder: '150'
      },
      {
        id: 'estimated_hours',
        type: 'number',
        question: 'Estimated Total Hours (if applicable)',
        required: false,
        placeholder: '40'
      },
      {
        id: 'billing_frequency',
        type: 'select',
        question: 'Billing Frequency',
        required: true,
        options: ['Weekly', 'Bi-weekly', 'Monthly', 'Upon Milestones', 'Project Completion']
      },
      {
        id: 'late_payment_fee',
        type: 'number',
        question: 'Late Payment Fee (%)',
        required: false,
        placeholder: '1.5'
      },
      {
        id: 'liability_cap',
        type: 'radio',
        question: 'Liability Limitation',
        required: true,
        options: ['Limited to contract value', 'Limited to $10,000', 'Limited to $50,000', 'No limitation']
      },
      {
        id: 'confidentiality',
        type: 'checkbox',
        question: 'Include Confidentiality Clause',
        required: false
      },
      {
        id: 'intellectual_property',
        type: 'radio',
        question: 'Intellectual Property Rights',
        required: true,
        options: ['Client owns all work product', 'Service Provider retains rights', 'Shared ownership', 'Case by case basis']
      },
      {
        id: 'termination_notice',
        type: 'select',
        question: 'Termination Notice Period',
        required: true,
        options: ['30 days', '15 days', '7 days', '24 hours', 'Immediate']
      },
      {
        id: 'governing_law',
        type: 'text',
        question: 'Governing Law (State/Country)',
        required: true,
        placeholder: 'New York, USA'
      },
      {
        id: 'dispute_resolution',
        type: 'radio',
        question: 'Dispute Resolution Method',
        required: true,
        options: ['Court litigation', 'Binding arbitration', 'Mediation first, then arbitration', 'Mediation only']
      },
      {
        id: 'force_majeure',
        type: 'checkbox',
        question: 'Include Force Majeure Clause',
        required: false
      },
      {
        id: 'independent_contractor',
        type: 'checkbox',
        question: 'Confirm Independent Contractor Relationship',
        required: true
      }
    ]
  },
  {
    id: 'employment-agreement',
    name: 'Employment Agreement',
    description: 'Comprehensive employment contract for new hires',
    icon: <UserCheck className="h-5 w-5" />,
    category: 'HR',
    estimatedTime: '15-20 mins',
    color: 'green',
    popularity: 'High',
    questions: [
      // LOGO UPLOAD QUESTION - FIRST FOR BETTER UX
      {
        id: 'company_logo',
        type: 'logo-upload',
        question: 'Upload Company Logo',
        required: false,
        helpText: 'Upload your company logo to include in the employment agreement header. This will make the document more professional and branded.',
        validation: {
          maxFileSize: 5, // 5MB
          allowedFormats: ['image/png', 'image/jpeg', 'image/jpg']
        }
      },
      {
        id: 'company_name',
        type: 'text',
        question: 'Company Name',
        required: true,
        placeholder: 'ABC Corporation'
      },
      {
        id: 'company_address',
        type: 'address',
        question: 'Company Address',
        required: true
      },
      {
        id: 'company_phone',
        type: 'text',
        question: 'Company Phone Number',
        required: false,
        placeholder: '(555) 123-4567'
      },
      {
        id: 'company_email',
        type: 'text',
        question: 'Company Email',
        required: false,
        placeholder: 'hr@company.com'
      },
      {
        id: 'company_website',
        type: 'text',
        question: 'Company Website',
        required: false,
        placeholder: 'www.company.com'
      },
      {
        id: 'employee_name',
        type: 'text',
        question: 'Employee Full Name',
        required: true,
        placeholder: 'John Doe'
      },
      {
        id: 'employee_address',
        type: 'address',
        question: 'Employee Address',
        required: true
      },
      {
        id: 'job_title',
        type: 'text',
        question: 'Job Title',
        required: true,
        placeholder: 'Software Engineer'
      },
      {
        id: 'department',
        type: 'text',
        question: 'Department',
        required: true,
        placeholder: 'Engineering'
      },
      {
        id: 'reporting_manager',
        type: 'text',
        question: 'Direct Supervisor/Manager',
        required: true,
        placeholder: 'Jane Smith'
      },
      {
        id: 'start_date',
        type: 'date',
        question: 'Employment Start Date',
        required: true
      },
      {
        id: 'employment_type',
        type: 'radio',
        question: 'Employment Type',
        required: true,
        options: ['Full-time', 'Part-time', 'Contract', 'Temporary']
      },
      {
        id: 'work_schedule',
        type: 'text',
        question: 'Work Schedule',
        required: true,
        placeholder: 'Monday-Friday, 9:00 AM - 5:00 PM'
      },
      {
        id: 'salary',
        type: 'number',
        question: 'Annual Salary ($)',
        required: true,
        placeholder: '75000'
      },
      {
        id: 'pay_frequency',
        type: 'select',
        question: 'Pay Frequency',
        required: true,
        options: ['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly']
      },
      {
        id: 'overtime_eligible',
        type: 'radio',
        question: 'Overtime Eligibility',
        required: true,
        options: ['Eligible for overtime pay', 'Exempt from overtime (salaried)', 'Not applicable']
      },
      {
        id: 'benefits',
        type: 'checkbox',
        question: 'Benefits Package',
        required: false,
        options: ['Health Insurance', 'Dental Insurance', 'Vision Insurance', '401(k)', 'Paid Time Off', 'Life Insurance', 'Disability Insurance', 'Flexible Spending Account']
      },
      {
        id: 'vacation_days',
        type: 'number',
        question: 'Annual Vacation Days',
        required: true,
        placeholder: '15'
      },
      {
        id: 'sick_days',
        type: 'number',
        question: 'Annual Sick Days',
        required: true,
        placeholder: '10'
      },
      {
        id: 'job_responsibilities',
        type: 'textarea',
        question: 'Key Job Responsibilities',
        required: true,
        placeholder: 'List primary duties and responsibilities...'
      },
      {
        id: 'performance_review',
        type: 'select',
        question: 'Performance Review Schedule',
        required: true,
        options: ['Quarterly', 'Semi-annually', 'Annually', 'As needed']
      },
      {
        id: 'probation_period',
        type: 'select',
        question: 'Probationary Period',
        required: false,
        options: ['None', '30 days', '60 days', '90 days', '6 months']
      },
      {
        id: 'confidentiality_agreement',
        type: 'checkbox',
        question: 'Include Confidentiality Agreement',
        required: false
      },
      {
        id: 'non_compete',
        type: 'checkbox',
        question: 'Include Non-Compete Clause',
        required: false
      },
      {
        id: 'non_compete_duration',
        type: 'select',
        question: 'Non-Compete Duration (if applicable)',
        required: false,
        options: ['6 months', '1 year', '2 years', '3 years']
      },
      {
        id: 'intellectual_property',
        type: 'checkbox',
        question: 'Include Intellectual Property Assignment',
        required: false
      },
      {
        id: 'termination_notice',
        type: 'select',
        question: 'Notice Period for Termination',
        required: true,
        options: ['1 week', '2 weeks', '30 days', '60 days', '90 days']
      },
      {
        id: 'severance_policy',
        type: 'textarea',
        question: 'Severance Policy (if applicable)',
        required: false,
        placeholder: 'Describe severance benefits...'
      },
      {
        id: 'governing_law',
        type: 'text',
        question: 'Governing Law (State)',
        required: true,
        placeholder: 'California'
      }
    ]
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Confidentiality agreement to protect sensitive information',
    icon: <Shield className="h-5 w-5" />,
    category: 'Legal',
    estimatedTime: '8-12 mins',
    color: 'purple',
    popularity: 'High',
    questions: [
      {
        id: 'nda_type',
        type: 'radio',
        question: 'Type of NDA',
        required: true,
        options: ['Mutual (Both parties share confidential info)', 'One-way (Only one party shares info)']
      },
      {
        id: 'disclosing_party',
        type: 'text',
        question: 'Disclosing Party Name',
        required: true,
        placeholder: 'ABC Corporation'
      },
      {
        id: 'disclosing_party_address',
        type: 'address',
        question: 'Disclosing Party Address',
        required: true
      },
      {
        id: 'receiving_party',
        type: 'text',
        question: 'Receiving Party Name',
        required: true,
        placeholder: 'John Doe'
      },
      {
        id: 'receiving_party_address',
        type: 'address',
        question: 'Receiving Party Address',
        required: true
      },
      {
        id: 'effective_date',
        type: 'date',
        question: 'Effective Date',
        required: true
      },
      {
        id: 'purpose',
        type: 'textarea',
        question: 'Purpose of Information Sharing',
        required: true,
        placeholder: 'Describe the business purpose for sharing confidential information...'
      },
      {
        id: 'information_types',
        type: 'checkbox',
        question: 'Types of Confidential Information',
        required: true,
        options: ['Technical data', 'Business plans', 'Financial information', 'Customer lists', 'Marketing strategies', 'Product designs', 'Software code', 'Trade secrets']
      },
      {
        id: 'duration',
        type: 'select',
        question: 'Confidentiality Duration',
        required: true,
        options: ['1 year', '2 years', '3 years', '5 years', '7 years', '10 years', 'Indefinite', 'Until information becomes public']
      },
      {
        id: 'permitted_disclosures',
        type: 'checkbox',
        question: 'Permitted Disclosures',
        required: false,
        options: ['To employees on need-to-know basis', 'To legal advisors', 'To accountants', 'To board members', 'As required by law', 'With prior written consent']
      },
      {
        id: 'return_of_information',
        type: 'checkbox',
        question: 'Require Return of Information',
        required: false
      },
      {
        id: 'return_timeline',
        type: 'select',
        question: 'Timeline for Return of Information (if applicable)',
        required: false,
        options: ['Immediately upon request', '30 days after request', '60 days after request', 'Upon termination of discussions']
      },
      {
        id: 'non_solicitation',
        type: 'checkbox',
        question: 'Include Non-Solicitation Clause',
        required: false
      },
      {
        id: 'non_solicitation_duration',
        type: 'select',
        question: 'Non-Solicitation Duration (if applicable)',
        required: false,
        options: ['6 months', '1 year', '2 years', '3 years']
      },
      {
        id: 'liquidated_damages',
        type: 'radio',
        question: 'Liquidated Damages Clause',
        required: false,
        options: ['No liquidated damages', 'Specify amount', 'Actual damages plus attorney fees']
      },
      {
        id: 'liquidated_amount',
        type: 'number',
        question: 'Liquidated Damages Amount ($ - if applicable)',
        required: false,
        placeholder: '50000'
      },
      {
        id: 'jurisdiction',
        type: 'text',
        question: 'Governing Jurisdiction',
        required: true,
        placeholder: 'New York, USA'
      },
      {
        id: 'dispute_resolution',
        type: 'radio',
        question: 'Dispute Resolution Method',
        required: true,
        options: ['Court litigation', 'Binding arbitration', 'Mediation first, then arbitration']
      },
      {
        id: 'injunctive_relief',
        type: 'checkbox',
        question: 'Include Injunctive Relief Clause',
        required: false
      }
    ]
  },
  {
    id: 'rental-agreement',
    name: 'Rental Agreement',
    description: 'Residential or commercial property rental contract',
    icon: <Home className="h-5 w-5" />,
    category: 'Real Estate',
    estimatedTime: '12-18 mins',
    color: 'orange',
    popularity: 'Medium',
    questions: [
      {
        id: 'property_type',
        type: 'radio',
        question: 'Property Type',
        required: true,
        options: ['Residential', 'Commercial']
      },
      {
        id: 'landlord_name',
        type: 'text',
        question: 'Landlord/Property Owner Name',
        required: true,
        placeholder: 'Property Management Company'
      },
      {
        id: 'landlord_address',
        type: 'address',
        question: 'Landlord Address',
        required: true
      },
      {
        id: 'tenant_name',
        type: 'text',
        question: 'Primary Tenant Name',
        required: true,
        placeholder: 'John Doe'
      },
      {
        id: 'additional_tenants',
        type: 'textarea',
        question: 'Additional Tenants (if any)',
        required: false,
        placeholder: 'List names of other tenants...'
      },
      {
        id: 'tenant_phone',
        type: 'text',
        question: 'Tenant Phone Number',
        required: true,
        placeholder: '(555) 123-4567'
      },
      {
        id: 'tenant_email',
        type: 'text',
        question: 'Tenant Email Address',
        required: true,
        placeholder: 'tenant@email.com'
      },
      {
        id: 'property_address',
        type: 'address',
        question: 'Property Address',
        required: true
      },
      {
        id: 'property_description',
        type: 'textarea',
        question: 'Property Description',
        required: true,
        placeholder: 'Describe the property (bedrooms, bathrooms, square footage, etc.)...'
      },
      {
        id: 'furnished_status',
        type: 'radio',
        question: 'Furnished Status',
        required: true,
        options: ['Furnished', 'Unfurnished', 'Partially furnished']
      },
      {
        id: 'rental_amount',
        type: 'number',
        question: 'Monthly Rent Amount ($)',
        required: true,
        placeholder: '2500'
      },
      {
        id: 'rent_due_date',
        type: 'select',
        question: 'Rent Due Date',
        required: true,
        options: ['1st of the month', '15th of the month', 'Last day of the month', 'Custom date']
      },
      {
        id: 'security_deposit',
        type: 'number',
        question: 'Security Deposit Amount ($)',
        required: true,
        placeholder: '2500'
      },
      {
        id: 'first_months_rent',
        type: 'checkbox',
        question: 'First Month\'s Rent Due at Signing',
        required: false
      },
      {
        id: 'last_months_rent',
        type: 'checkbox',
        question: 'Last Month\'s Rent Due at Signing',
        required: false
      },
      {
        id: 'lease_start',
        type: 'date',
        question: 'Lease Start Date',
        required: true
      },
      {
        id: 'lease_end',
        type: 'date',
        question: 'Lease End Date',
        required: true
      },
      {
        id: 'lease_term',
        type: 'select',
        question: 'Lease Term Type',
        required: true,
        options: ['Fixed term', 'Month-to-month', 'Week-to-week']
      },
      {
        id: 'renewal_option',
        type: 'radio',
        question: 'Renewal Options',
        required: true,
        options: ['Automatic renewal', 'Option to renew', 'No renewal option']
      },
      {
        id: 'utilities_included',
        type: 'checkbox',
        question: 'Utilities Included in Rent',
        required: false,
        options: ['Water', 'Electricity', 'Gas', 'Internet', 'Cable TV', 'Trash/Recycling', 'Heating', 'Air Conditioning']
      },
      {
        id: 'utility_responsibility',
        type: 'textarea',
        question: 'Utility Responsibility Details',
        required: true,
        placeholder: 'Specify who pays for which utilities and any caps/limits...'
      },
      {
        id: 'parking',
        type: 'radio',
        question: 'Parking Arrangements',
        required: true,
        options: ['No parking provided', '1 parking space included', '2 parking spaces included', 'Additional fee for parking', 'Street parking only']
      },
      {
        id: 'parking_fee',
        type: 'number',
        question: 'Monthly Parking Fee ($ - if applicable)',
        required: false,
        placeholder: '100'
      },
      {
        id: 'pet_policy',
        type: 'radio',
        question: 'Pet Policy',
        required: true,
        options: ['No pets allowed', 'Cats allowed with deposit', 'Dogs allowed with deposit', 'All pets allowed with deposit', 'Case by case approval', 'Pets allowed with no deposit']
      },
      {
        id: 'pet_deposit',
        type: 'number',
        question: 'Pet Deposit Amount ($ - if applicable)',
        required: false,
        placeholder: '500'
      },
      {
        id: 'pet_rent',
        type: 'number',
        question: 'Monthly Pet Rent ($ - if applicable)',
        required: false,
        placeholder: '50'
      },
      {
        id: 'smoking_policy',
        type: 'radio',
        question: 'Smoking Policy',
        required: true,
        options: ['No smoking anywhere', 'Smoking allowed outside only', 'Smoking allowed in designated areas', 'Smoking allowed throughout property']
      },
      {
        id: 'maintenance_responsibility',
        type: 'textarea',
        question: 'Maintenance Responsibilities',
        required: true,
        placeholder: 'Specify who is responsible for what maintenance items...'
      },
      {
        id: 'late_fee',
        type: 'number',
        question: 'Late Payment Fee ($)',
        required: false,
        placeholder: '50'
      },
      {
        id: 'grace_period',
        type: 'select',
        question: 'Grace Period for Late Rent',
        required: true,
        options: ['No grace period', '3 days', '5 days', '10 days', '15 days']
      },
      {
        id: 'nsf_fee',
        type: 'number',
        question: 'NSF/Returned Check Fee ($)',
        required: false,
        placeholder: '25'
      },
      {
        id: 'early_termination',
        type: 'radio',
        question: 'Early Termination Policy',
        required: true,
        options: ['Not allowed', 'Allowed with 30 days notice and fee', 'Allowed with 60 days notice and fee', 'Case by case basis']
      },
      {
        id: 'early_termination_fee',
        type: 'number',
        question: 'Early Termination Fee ($ - if applicable)',
        required: false,
        placeholder: '2000'
      },
      {
        id: 'property_access',
        type: 'textarea',
        question: 'Landlord Property Access Rights',
        required: true,
        placeholder: 'Specify notice requirements for landlord entry...'
      },
      {
        id: 'governing_law',
        type: 'text',
        question: 'Governing Law (State)',
        required: true,
        placeholder: 'California'
      }
    ]
  },
  {
    id: 'purchase-agreement',
    name: 'Purchase Agreement',
    description: 'Agreement for buying/selling goods or services',
    icon: <CreditCard className="h-5 w-5" />,
    category: 'Finance',
    estimatedTime: '8-12 mins',
    color: 'emerald',
    popularity: 'Medium',
    questions: [
      {
        id: 'buyer_name',
        type: 'text',
        question: 'Buyer Name',
        required: true
      },
      {
        id: 'seller_name',
        type: 'text',
        question: 'Seller Name',
        required: true
      },
      {
        id: 'purchase_price',
        type: 'number',
        question: 'Total Purchase Price ($)',
        required: true
      },
      {
        id: 'delivery_date',
        type: 'date',
        question: 'Expected Delivery/Completion Date',
        required: true
      }
    ]
  }
];

// QUESTION RENDERER COMPONENT WITH FIXED TYPING
const QuestionRenderer: React.FC<{
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}> = ({ question, value, onChange, error }) => {
  const renderAddressFields = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Street Address"
        value={value?.street || ''}
        onChange={(e) => onChange({ ...value, street: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="City"
          value={value?.city || ''}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="State/Province"
          value={value?.state || ''}
          onChange={(e) => onChange({ ...value, state: e.target.value })}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="ZIP/Postal Code"
          value={value?.zip || ''}
          onChange={(e) => onChange({ ...value, zip: e.target.value })}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Country"
          value={value?.country || ''}
          onChange={(e) => onChange({ ...value, country: e.target.value })}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const baseInputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
    error ? 'border-red-500' : 'border-gray-300'
  }`;

  switch (question.type) {
    case 'logo-upload':
      return <LogoUpload value={value} onChange={onChange} error={error} />;

    case 'dynamic-list':
      return <DynamicList value={value} onChange={onChange} error={error} />;

    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className={baseInputClasses}
        />
      );

    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className={baseInputClasses}
        />
      );

    case 'select':
      return (
        <div className="relative">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClasses} appearance-none pr-10`}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      );

    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className={baseInputClasses}
        />
      );

    case 'radio':
      return (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      if (question.options) {
        return (
          <div className="space-y-3">
            {question.options.map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      } else {
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">Yes, include this option</span>
          </label>
        );
      }

    case 'address':
      return renderAddressFields();

    default:
      return null;
  }
};

// AI-Enhanced Document Generation Service
const generateAIDocument = async (template: DocumentTemplate, data: FormData): Promise<string> => {
  try {
    console.log('🤖 Generating AI-powered document...');
    
    // FIXED: Removed duplicate https:// from URL
    const response = await fetch('https://legal-chat-ai.onrender.com/api/generate-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateType: template.id,
        templateName: template.name,
        templateDescription: template.description,
        formData: data
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Document generation failed');
    }
    
    console.log('✅ AI document generated successfully');
    
    if (result.warning) {
      console.warn('⚠️ Warning:', result.warning);
    }
    
    return result.document || 'Error generating document content';
  } catch (error) {
    console.error('❌ Error generating AI document:', error);
    return generateBasicTemplate(template, data);
  }
};

// Fallback basic template generation
const generateBasicTemplate = (template: DocumentTemplate, data: FormData): string => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatAddress = (addr: any) => {
    if (!addr) return '';
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`;
  };

  switch (template.id) {
    case 'service-agreement':
      return `SERVICE AGREEMENT

This Service Agreement is entered into on ${today}, between:

Service Provider: ${data.service_provider_name}
Address: ${formatAddress(data.service_provider_address)}

Client: ${data.client_name}
Address: ${formatAddress(data.client_address)}

1. SERVICES
${data.services_description}

2. COMPENSATION
Total Contract Value: ${data.contract_value}
Payment Terms: ${data.payment_terms}

3. TERM
Service Start Date: ${data.start_date}

[Additional standard clauses would be included in the full document]

Signatures:
_________________    _________________
Service Provider     Client`;

    default:
      return `${template.name.toUpperCase()}

Generated on: ${today}

${Object.entries(data).map(([key, value]) => {
  if (key === 'company_logo') return ''; // Skip logo data in text
  if (typeof value === 'object' && value?.street) {
    return `${key.replace(/_/g, ' ').toUpperCase()}: ${formatAddress(value)}`;
  }
  return `${key.replace(/_/g, ' ').toUpperCase()}: ${value}`;
}).filter(Boolean).join('\n')}

[This document would include standard legal clauses and terms appropriate for a ${template.name}]`;
  }
};

// ENHANCED PDF GENERATION WITH LOGO SUPPORT - FIXED JSPDF TYPES
const generatePDFWithLogo = async (
  content: string, 
  filename: string, 
  logoData?: any,
  templateType?: string
) => {
  try {
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let y = margin;

    // Add logo if provided
    if (logoData?.processedBase64) {
      try {
        const maxLogoWidth = 60;
        const maxLogoHeight = 30;
        
        let logoWidth = logoData.width / 3.78;
        let logoHeight = logoData.height / 3.78;
        
        if (logoWidth > maxLogoWidth) {
          logoHeight = (logoHeight * maxLogoWidth) / logoWidth;
          logoWidth = maxLogoWidth;
        }
        
        if (logoHeight > maxLogoHeight) {
          logoWidth = (logoWidth * maxLogoHeight) / logoHeight;
          logoHeight = maxLogoHeight;
        }
        
        const logoX = margin;
        const logoY = y;
        
        doc.addImage(
          logoData.processedBase64,
          'PNG',
          logoX,
          logoY,
          logoWidth,
          logoHeight,
          undefined,
          'FAST'
        );
        
        y = Math.max(y + logoHeight + 15, y + 40);
        console.log('✅ Logo added to PDF successfully');
      } catch (logoError) {
        console.warn('⚠️ Could not add logo to PDF:', logoError);
      }
    }

    // Add content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const lines = content.split('\n');
    
    lines.forEach((line) => {
      // Check if we need a new page
      if (y > pageHeight - margin - 20) {
        doc.addPage();
        y = margin;
        
        // Add page number - FIXED: Use getNumberOfPages()
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          pageWidth - margin - 15,
          pageHeight - 10
        );
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
      }

      if (line.trim() === '') {
        y += 4;
      } else if (line.match(/^[A-Z\s]+$/) && line.length < 50) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        
        const headerLines = doc.splitTextToSize(line.trim(), pageWidth - (margin * 2));
        doc.text(headerLines, margin, y);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        y += headerLines.length * 7 + 5;
      } else if (line.includes('_________________________')) {
        y += 5;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(margin, y, margin + 60, y);
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Signature', margin, y + 5);
        doc.text('Date', margin + 80, y + 5);
        
        doc.line(margin + 70, y, margin + 120, y);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        y += 15;
      } else {
        const textLines = doc.splitTextToSize(line, pageWidth - (margin * 2));
        doc.text(textLines, margin, y);
        y += textLines.length * 5 + 1;
      }
    });

    // Add footer to all pages - FIXED: Use proper page counting
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`,
        margin,
        pageHeight - 12
      );
      
      if (i === totalPages) {
        doc.text(
          'This document was generated using AI assistance. Please review with legal counsel.',
          margin,
          pageHeight - 6
        );
      }
    }

    doc.save(`${filename}.pdf`);
    console.log('✅ Enhanced PDF with logo generated successfully');
    
  } catch (error) {
    console.error('❌ Error generating PDF with logo:', error);
    
    try {
      await generateBasicPDF(content, filename);
    } catch (fallbackError) {
      console.error('❌ Fallback PDF generation also failed:', fallbackError);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
};

// Basic PDF generation without logo (fallback)
const generateBasicPDF = async (content: string, filename: string) => {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  const lines = content.split('\n');
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let y = margin;

  lines.forEach((line) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    if (line.trim() === '') {
      y += 5;
    } else {
      const splitText = doc.splitTextToSize(line, 170);
      doc.text(splitText, margin, y);
      y += splitText.length * 6;
    }
  });

  doc.save(`${filename}.pdf`);
};

// Main Create Document Component
const CreateDocumentPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setCurrentQuestionIndex(0);
    setFormData({});
    setErrors({});
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };

  const validateCurrentQuestion = (): boolean => {
    if (!selectedTemplate) return false;
    
    const currentQuestion = selectedTemplate.questions[currentQuestionIndex];
    if (!currentQuestion.required) return true;
    
    const value = formData[currentQuestion.id];
    
    if (currentQuestion.type === 'address') {
      const isValid = value?.street && value?.city && value?.state && value?.zip;
      if (!isValid) {
        setErrors(prev => ({
          ...prev,
          [currentQuestion.id]: 'Please fill in all address fields'
        }));
        return false;
      }
    } else if (currentQuestion.type === 'logo-upload') {
      if (value?.error) {
        setErrors(prev => ({
          ...prev,
          [currentQuestion.id]: value.error
        }));
        return false;
      }
      return true;
    } else if (!value || (Array.isArray(value) && value.length === 0)) {
      setErrors(prev => ({
        ...prev,
        [currentQuestion.id]: 'This field is required'
      }));
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateCurrentQuestion() && selectedTemplate) {
      if (currentQuestionIndex < selectedTemplate.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        generateDocument();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const generateDocument = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    try {
      const documentContent = await generateAIDocument(selectedTemplate, formData);
      setGeneratedDocument(documentContent);
    } catch (error) {
      console.error('Document generation failed:', error);
      setGeneratedDocument('Error generating document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDocument = async (format: 'pdf' | 'word' | 'text') => {
    if (!generatedDocument || !selectedTemplate) return;

    const filename = selectedTemplate.name.toLowerCase().replace(/\s+/g, '-');

    if (format === 'pdf') {
      const logoData = formData.company_logo?.processedBase64 ? {
        processedBase64: formData.company_logo.processedBase64,
        width: formData.company_logo.width,
        height: formData.company_logo.height,
        fileName: formData.company_logo.fileName
      } : undefined;

      await generatePDFWithLogo(
        generatedDocument, 
        filename, 
        logoData, 
        selectedTemplate.id
      );
    } else if (format === 'word') {
      let wordContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${filename}</title></head>
        <body style='font-family: Times New Roman; line-height: 1.6; margin: 40px;'>
      `;
      
      if (formData.company_logo?.processedBase64) {
        wordContent += `
          <div style='margin-bottom: 30px; text-align: left;'>
            <img src='${formData.company_logo.processedBase64}' 
                 style='max-height: 100px; max-width: 200px; height: auto; width: auto;' 
                 alt='Company Logo' />
          </div>
        `;
      }
      
      wordContent += `
          <pre style='white-space: pre-wrap; font-family: Times New Roman; font-size: 12pt;'>${generatedDocument}</pre>
        </body>
        </html>
      `;
      
      const blob = new Blob([wordContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([generatedDocument], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedTemplate(null);
    setCurrentQuestionIndex(0);
    setFormData({});
    setErrors({});
    setGeneratedDocument(null);
    setShowPreview(false);
  };

  // Document generation complete view
  if (generatedDocument) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Document Generated Successfully!</h1>
                  <p className="text-gray-600">{selectedTemplate?.name}</p>
                  {formData.company_logo && (
                    <p className="text-sm text-green-600 mt-1">✓ Company logo included</p>
                  )}
                </div>
              </div>
              <button
                onClick={resetForm}
                className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={() => downloadDocument('pdf')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => downloadDocument('word')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Word
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                  {generatedDocument}
                </pre>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important Legal Notice</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      This document has been generated using AI assistance and professional templates. 
                      Please review carefully and consult with a qualified attorney before using for 
                      any official purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Question flow view
  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Professional Document</h2>
          <p className="text-gray-600 mb-4">Creating your {selectedTemplate?.name} with professional formatting...</p>
          {formData.company_logo && (
            <p className="text-sm text-green-600 mb-4">✓ Including your company logo</p>
          )}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Processing your responses</span>
          </div>
        </div>
      </div>
    );
  }

  // Question form view
  if (selectedTemplate) {
    const currentQuestion = selectedTemplate.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedTemplate.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-${selectedTemplate.color}-100 rounded-lg`}>
                  {selectedTemplate.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h1>
                  <p className="text-gray-600 text-sm">
                    Question {currentQuestionIndex + 1} of {selectedTemplate.questions.length}
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`bg-blue-600 h-3 rounded-full transition-all duration-300 relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-0 h-3 w-3 bg-blue-600 rounded-full transform translate-x-1/2"></div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {currentQuestion.question}
                {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
              </h2>
              {currentQuestion.helpText && (
                <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                  💡 {currentQuestion.helpText}
                </p>
              )}
            </div>

            <div className="mb-6">
              <QuestionRenderer
                question={currentQuestion}
                value={formData[currentQuestion.id]}
                onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                error={errors[currentQuestion.id]}
              />
              {errors[currentQuestion.id] && (
                <p className="text-red-500 text-sm mt-2 flex items-center bg-red-50 p-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors[currentQuestion.id]}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {currentQuestionIndex === selectedTemplate.questions.length - 1 ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Document
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Template selection view (after category selection)
  if (selectedCategory) {
    const categoryTemplates = documentTemplates.filter(template => template.category === selectedCategory);
    const categoryData = categoryInfo[selectedCategory];

    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{categoryData.name} Documents</h1>
          <p className="text-gray-600 text-lg">{categoryData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300 group relative"
            >
              {template.popularity === 'High' && (
                <div className="absolute top-4 right-4">
                  <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`p-3 bg-${template.color}-100 rounded-xl group-hover:bg-${template.color}-200 transition-colors`}>
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      <Clock className="h-3 w-3 mr-1" />
                      {template.estimatedTime}
                    </span>
                    <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main category selection view
  const categories = Object.keys(categoryInfo);

  return (
    <>
      <DocumentHead
        title="AI Legal Document Generator | Create Contracts & Legal Docs | LegalChatAI"
        description="Generate professional legal documents with AI. Create contracts, NDAs, agreements, and more. Customizable templates with AI assistance. Free to use."
        keywords="AI document generator, legal document generator, AI contract generator, create legal documents, legal template generator, AI legal documents"
        canonical="https://www.legalchatai.com/create-document"
        jsonLD={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AI Legal Document Generator",
          "description": "AI-powered legal document generation platform",
          "applicationCategory": "DocumentGeneration",
          "operatingSystem": "Web",
          "provider": {
            "@type": "Organization",
            "name": "LegalChatAI",
            "url": "https://legalchatai.com"
          },
          "featureList": [
            "Contract Generation",
            "NDA Templates",
            "Agreement Creation",
            "Legal Document Templates",
            "AI-Powered Customization"
          ]
        }}
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-12 text-white">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Document Generation with Logo Support
          </div>
          <h1 className="text-4xl font-bold mb-4">Create Professional Legal Documents</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Choose a document category below to generate custom legal documents with AI assistance and professional branding
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {categories.map(category => {
          const categoryData = categoryInfo[category];
          const categoryTemplates = documentTemplates.filter(template => template.category === category);
          
          return (
            <div
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center">
                <div className={`${categoryData.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {categoryData.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {categoryData.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {categoryData.description}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {categoryTemplates.length} templates
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="bg-gray-50 rounded-2xl p-8 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our AI Document Generator?</h2>
          <p className="text-gray-600">Professional, legally sound documents created with artificial intelligence</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Enhanced</h3>
            <p className="text-gray-600 text-sm">Professional documents generated with AI for accuracy and completeness</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600 text-sm">Download in PDF, Word, or text format for maximum compatibility</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Legally Sound</h3>
            <p className="text-gray-600 text-sm">Templates crafted by professionals and enhanced with AI</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <Image className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Logo Support</h3>
            <p className="text-gray-600 text-sm">Add your company logo for professional, branded documents</p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default CreateDocumentPage;