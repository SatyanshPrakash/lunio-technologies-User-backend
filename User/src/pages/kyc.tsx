import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { submitKYC, fetchKYCStatus, clearError } from '../store/slices/kycSlice';
import { Upload, Camera, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, X, FileText, User, CreditCard, Image as ImageIcon, ChevronDown, Info, Loader as Loader2, Shield } from 'lucide-react';

const DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport', format: 'Format: AB1234567' },
  { value: 'drivers_license', label: "Driver's License", format: 'Format: D1234567' },
  { value: 'national_id', label: 'National ID Card', format: 'Format: 123456789012' },
  { value: 'other', label: 'Other Government-issued ID', format: 'Enter document number' },
];

interface FormData {
  documentType: string;
  firstName: string;
  middleName: string;
  lastName: string;
  documentNumber: string;
  frontImage: File | null;
  backImage: File | null;
  selfieImage: File | null;
}

interface FormErrors {
  documentType?: string;
  firstName?: string;
  lastName?: string;
  documentNumber?: string;
  frontImage?: string;
  backImage?: string;
  selfieImage?: string;
}

export const KYCPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, loading, error } = useAppSelector((state) => state.kyc);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    documentNumber: '',
    frontImage: null,
    backImage: null,
    selfieImage: null,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [frontPreview, setFrontPreview] = useState<string>('');
  const [backPreview, setBackPreview] = useState<string>('');
  const [selfiePreview, setSelfiePreview] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(fetchKYCStatus());
    }
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const validateName = (name: string): boolean => {
    return /^[A-Za-z\s-']+$/.test(name);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.documentType) {
      errors.documentType = 'Please select a document type';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (!validateName(formData.firstName)) {
      errors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (!validateName(formData.lastName)) {
      errors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (formData.middleName && !validateName(formData.middleName)) {
      errors.firstName = 'Middle name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.documentNumber.trim()) {
      errors.documentNumber = 'Document number is required';
    }

    if (!formData.frontImage) {
      errors.frontImage = 'Front image of document is required';
    }

    if (!formData.backImage) {
      errors.backImage = 'Back image of document is required';
    }

    if (!formData.selfieImage) {
      errors.selfieImage = 'Selfie photo is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  const handleFileSelect = (file: File, type: 'front' | 'back') => {
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        [type === 'front' ? 'frontImage' : 'backImage']: 'File size must be less than 5MB',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'front') {
        setFrontPreview(e.target?.result as string);
        setFormData({ ...formData, frontImage: file });
        setFormErrors({ ...formErrors, frontImage: undefined });
      } else {
        setBackPreview(e.target?.result as string);
        setFormData({ ...formData, backImage: file });
        setFormErrors({ ...formErrors, backImage: undefined });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'front' | 'back') => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf')) {
      handleFileSelect(file, type);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (type: 'front' | 'back' | 'selfie') => {
    if (type === 'front') {
      setFrontPreview('');
      setFormData({ ...formData, frontImage: null });
    } else if (type === 'back') {
      setBackPreview('');
      setFormData({ ...formData, backImage: null });
    } else {
      setSelfiePreview('');
      setFormData({ ...formData, selfieImage: null });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setShowCamera(true);
      }
    } catch (err) {
      setFormErrors({
        ...formErrors,
        selfieImage: 'Camera access denied. Please enable camera permissions.',
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            setSelfiePreview(canvas.toDataURL('image/jpeg'));
            setFormData({ ...formData, selfieImage: file });
            setFormErrors({ ...formErrors, selfieImage: undefined });
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('documentType', formData.documentType);
    formDataToSend.append('fullName', `${formData.firstName} ${formData.middleName} ${formData.lastName}`.replace(/\s+/g, ' ').trim());
    formDataToSend.append('documentNumber', formData.documentNumber);

    if (formData.frontImage) formDataToSend.append('frontImage', formData.frontImage);
    if (formData.backImage) formDataToSend.append('backImage', formData.backImage);
    if (formData.selfieImage) formDataToSend.append('selfieImage', formData.selfieImage);

    const result = await dispatch(submitKYC(formDataToSend));
    if (submitKYC.fulfilled.match(result)) {
      setSubmitted(true);
    }
  };

  const getProgress = (): number => {
    let progress = 0;
    if (formData.documentType) progress += 16.67;
    if (formData.firstName && formData.lastName) progress += 16.67;
    if (formData.documentNumber) progress += 16.67;
    if (formData.frontImage) progress += 16.67;
    if (formData.backImage) progress += 16.67;
    if (formData.selfieImage) progress += 16.67;
    return Math.round(progress);
  };

  const isFormComplete = (): boolean => {
    return !!(
      formData.documentType &&
      formData.firstName &&
      formData.lastName &&
      formData.documentNumber &&
      formData.frontImage &&
      formData.backImage &&
      formData.selfieImage
    );
  };

  const getDocumentFormat = (): string => {
    const doc = DOCUMENT_TYPES.find(d => d.value === formData.documentType);
    return doc?.format || '';
  };

  if (status.status === 'approved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Approved</h2>
          <p className="text-gray-600 mb-8">
            Your identity has been successfully verified. You now have full access to all features.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (status.status === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-12 h-12 text-yellow-600 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Pending</h2>
          <p className="text-gray-600 mb-2">
            Your verification documents are being reviewed.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Submitted on {new Date(status.submittedAt!).toLocaleDateString()}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Submission Successful</h2>
          <p className="text-gray-600 mb-8">
            Your verification documents have been submitted successfully. We'll review them shortly and notify you of the results.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Identity Verification</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            To ensure security and compliance, we need to verify your identity. Please provide the required documents and information.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Completion Progress</span>
            <span className="text-sm font-bold text-blue-600">{getProgress()}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Document Type</h2>
            </div>
            <div className="relative">
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className={`w-full pl-4 pr-10 py-4 border-2 ${
                  formErrors.documentType ? 'border-red-300' : 'border-gray-200'
                } rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none appearance-none bg-white`}
                aria-label="Document type selection"
              >
                <option value="">Select document type *</option>
                {DOCUMENT_TYPES.map((doc) => (
                  <option key={doc.value} value={doc.value}>
                    {doc.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {formErrors.documentType && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.documentType}
              </p>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${
                    formErrors.firstName ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
                  placeholder="John"
                  aria-label="First name"
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="Optional"
                  aria-label="Middle name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${
                    formErrors.lastName ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
                  placeholder="Doe"
                  aria-label="Last name"
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Document Number */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Document Number</h2>
            </div>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 ${
                formErrors.documentNumber ? 'border-red-300' : 'border-gray-200'
              } rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
              placeholder={getDocumentFormat() || 'Enter document number'}
              aria-label="Document number"
            />
            {formData.documentType && (
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {getDocumentFormat()}
              </p>
            )}
            {formErrors.documentNumber && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.documentNumber}
              </p>
            )}
          </div>

          {/* Document Images */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Document Images</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload clear photos of both sides of your document. Max file size: 5MB per image.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Front Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Front *
                </label>
                {frontPreview ? (
                  <div className="relative group">
                    <img
                      src={frontPreview}
                      alt="Document front"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => frontInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage('front')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={(e) => handleDrop(e, 'front')}
                    onDragOver={handleDragOver}
                    onClick={() => frontInputRef.current?.click()}
                    className={`border-2 border-dashed ${
                      formErrors.frontImage ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    } rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all`}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF (max 5MB)</p>
                  </div>
                )}
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0], 'front')}
                  className="hidden"
                  aria-label="Upload document front"
                />
                {formErrors.frontImage && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.frontImage}
                  </p>
                )}
              </div>

              {/* Back Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Back *
                </label>
                {backPreview ? (
                  <div className="relative group">
                    <img
                      src={backPreview}
                      alt="Document back"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => backInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage('back')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={(e) => handleDrop(e, 'back')}
                    onDragOver={handleDragOver}
                    onClick={() => backInputRef.current?.click()}
                    className={`border-2 border-dashed ${
                      formErrors.backImage ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    } rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all`}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF (max 5MB)</p>
                  </div>
                )}
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0], 'back')}
                  className="hidden"
                  aria-label="Upload document back"
                />
                {formErrors.backImage && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.backImage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Live Photo Capture */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Selfie Photo</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Take a clear selfie photo. Ensure your face is well-lit and clearly visible.
            </p>

            {selfiePreview ? (
              <div className="relative group max-w-md mx-auto">
                <img
                  src={selfiePreview}
                  alt="Selfie"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      removeImage('selfie');
                      startCamera();
                    }}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage('selfie')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : showCamera ? (
              <div className="max-w-md mx-auto">
                <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white text-sm bg-black bg-opacity-50 py-2 px-4 rounded-lg inline-block">
                      Position your face in the center
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-8 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-3"
                >
                  <Camera className="w-16 h-16 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Click to start camera</p>
                    <p className="text-xs text-gray-500 mt-1">Make sure you're in a well-lit area</p>
                  </div>
                </button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {formErrors.selfieImage && (
              <p className="mt-4 text-sm text-red-600 flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.selfieImage}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <button
              type="submit"
              disabled={!isFormComplete() || loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Submit KYC verification"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Connect with KYC Verification</span>
                </>
              )}
            </button>
            {!isFormComplete() && (
              <p className="mt-3 text-sm text-gray-500 text-center">
                Please complete all required fields to submit
              </p>
            )}
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Your data is secure</p>
              <p>
                All information and documents are encrypted and stored securely. We comply with international data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};