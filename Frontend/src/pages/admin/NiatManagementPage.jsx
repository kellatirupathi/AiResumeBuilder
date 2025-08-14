import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
    getNiatIds, 
    addSingleNiatId, 
    addBulkNiatIds, 
    deleteNiatId, 
    checkAdminSession 
} from '@/Services/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  FileText, 
  Fingerprint, 
  LoaderCircle, 
  Search, 
  Filter,
  RefreshCw,
  Download,
  AlertCircle,
  X,
  HelpCircle
} from 'lucide-react';
import { format } from 'date-fns';

// Tooltip component
const Tooltip = ({ children, text }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute z-10 w-48 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -top-10 left-1/2 transform -translate-x-1/2 pointer-events-none">
        {text}
        <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon></svg>
      </div>
    </div>
  );
};

// Custom alert component for confirmations
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="p-5 bg-red-50 border-b border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

function NiatManagementPage() {
    const [niatIds, setNiatIds] = useState([]);
    const [filteredIds, setFilteredIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [singleIdInput, setSingleIdInput] = useState('');
    const [bulkIdInput, setBulkIdInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('single');
    const [idToDelete, setIdToDelete] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isSingleSubmitting, setIsSingleSubmitting] = useState(false);
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [stats, setStats] = useState({ total: 0, today: 0 });
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Validation regex for NIAT ID format
    const niatIdRegex = /^N24H01[A-Z]\d{4}$/;

    const fetchIds = async () => {
        setIsLoading(true);
        try {
            const response = await getNiatIds();
            const ids = response.data || [];
            setNiatIds(ids);
            setFilteredIds(ids);
            
            // Calculate statistics
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            setStats({
                total: ids.length,
                today: ids.filter(id => new Date(id.createdAt) >= today).length
            });
        } catch (error) {
            toast.error("Failed to fetch NIAT IDs.", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        checkAdminSession().then(fetchIds).catch(() => navigate('/admin/login'));
    }, [navigate]);
    
    // Filter IDs when search query changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredIds(niatIds);
            return;
        }
        
        const filtered = niatIds.filter(id => 
            id.niatId.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredIds(filtered);
    }, [searchQuery, niatIds]);

    const handleAddSingle = async () => {
        if (!singleIdInput.trim()) return;
        
        // Validate format
        if (!niatIdRegex.test(singleIdInput.trim())) {
            toast.error("Invalid NIAT ID format", { description: "Please use format: N24H01X####" });
            return;
        }
        
        setIsSingleSubmitting(true);
        try {
            await addSingleNiatId(singleIdInput.trim());
            toast.success("NIAT ID added successfully.");
            setSingleIdInput('');
            fetchIds();
        } catch (error) {
            toast.error("Failed to add ID.", { description: error.message });
        } finally {
            setIsSingleSubmitting(false);
        }
    };

    const handleAddBulk = async () => {
        const ids = bulkIdInput.split(/\r?\n/).map(id => id.trim()).filter(id => id);
        if (ids.length === 0) return;
        
        // Validate all IDs
        const invalidIds = ids.filter(id => !niatIdRegex.test(id));
        if (invalidIds.length > 0) {
            toast.error(`${invalidIds.length} invalid NIAT IDs found`, { 
                description: `Example: ${invalidIds[0]}. Please check the format.` 
            });
            return;
        }
        
        setIsBulkSubmitting(true);
        try {
            const response = await addBulkNiatIds(ids);
            toast.success(response.message, { 
                description: `Added ${response.data.addedCount} new IDs. ${response.data.duplicateCount || 0} duplicates skipped.` 
            });
            setBulkIdInput('');
            fetchIds();
        } catch (error) {
            toast.error("Error in bulk add.", { description: error.message });
        } finally {
            setIsBulkSubmitting(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.type !== "text/csv") {
            toast.warning("Invalid File", { description: "Please upload a valid .csv file."});
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
            return;
        }
        
        setIsFileUploading(true);
        
        try {
            const text = await file.text();
            const ids = text.split(/\r?\n/).map(id => id.trim()).filter(id => id);
            
            // Validate IDs
            const invalidIds = ids.filter(id => !niatIdRegex.test(id));
            if (invalidIds.length > 0) {
                toast.error(`${invalidIds.length} invalid NIAT IDs found in file`, { 
                    description: `Example: ${invalidIds[0]}. Please check the format.` 
                });
                setIsFileUploading(false);
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
                return;
            }
            
            if (ids.length > 0) {
                const response = await addBulkNiatIds(ids);
                toast.success(response.message, { 
                    description: `Added ${response.data.addedCount} IDs from the file. ${response.data.duplicateCount || 0} duplicates skipped.`
                });
                fetchIds();
            } else {
                toast.warning("No valid IDs found in file.");
            }
        } catch (error) {
            toast.error("Error processing file.", { description: error.message });
        } finally {
            setIsFileUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        }
    };

    const openDeleteConfirm = (id) => {
        setIdToDelete(id);
        setConfirmDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!idToDelete) return;
        
        try {
            await deleteNiatId(idToDelete);
            toast.success("NIAT ID deleted successfully.");
            fetchIds();
        } catch (error) {
            toast.error("Failed to delete ID.", { description: error.message });
        }
    };
    
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchIds();
        setIsRefreshing(false);
    };
    
    const exportToCSV = () => {
        // Create CSV content
        const headers = "NIAT ID,Date Added\n";
        const rows = filteredIds.map(id => 
            `${id.niatId},"${format(new Date(id.createdAt), 'PPpp')}"`
        ).join('\n');
        const csvContent = `${headers}${rows}`;
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `niat_ids_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        
        // Trigger download and cleanup
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/admin/dashboard')}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                    </Button>
                    
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        
                        <Button
                            variant="outline"
                            onClick={exportToCSV}
                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-auto flex gap-4">
                        <div className="flex items-center px-4 py-2 bg-indigo-50 rounded-lg">
                            <div className="mr-3">
                                <div className="text-xs text-indigo-500 uppercase font-semibold">Total IDs</div>
                                <div className="text-2xl font-bold text-indigo-700">{stats.total}</div>
                            </div>
                            <div className="h-8 w-px bg-indigo-200 mx-2"></div>
                            <div>
                                <div className="text-xs text-indigo-500 uppercase font-semibold">Added Today</div>
                                <div className="text-2xl font-bold text-indigo-700">{stats.today}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full sm:w-64 relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search NIAT ID..."
                            className="pl-9 pr-4 py-2 bg-white border-gray-300"
                        />
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            className={`px-4 py-3 text-sm font-medium ${
                                activeTab === 'single' 
                                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('single')}
                        >
                            Add Single ID
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${
                                activeTab === 'bulk' 
                                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('bulk')}
                        >
                            Add Multiple IDs
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${
                                activeTab === 'file' 
                                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('file')}
                        >
                            Upload CSV
                        </button>
                    </div>
                </div>
                
                <div className="p-6">
                    {activeTab === 'single' && (
                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                            <div className="w-full">
                                <div className="flex items-center mb-2">
                                    <label htmlFor="single-id" className="text-sm font-medium text-gray-700 mr-2">NIAT ID</label>
                                    <Tooltip text="Format: N24H01X#### where X is any uppercase letter and # is any digit">
                                        <HelpCircle className="h-4 w-4 text-gray-400" />
                                    </Tooltip>
                                </div>
                                <Input
                                    id="single-id"
                                    value={singleIdInput}
                                    onChange={e => setSingleIdInput(e.target.value.toUpperCase())}
                                    placeholder="N24H01B1234"
                                    className="border-gray-300"
                                />
                                <p className="mt-1 text-xs text-gray-500">Please ensure the NIAT ID follows the correct format: N24H01X####</p>
                            </div>
                            <Button 
                                onClick={handleAddSingle} 
                                disabled={!singleIdInput.trim() || isSingleSubmitting}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 sm:self-end"
                            >
                                {isSingleSubmitting ? (
                                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4 mr-2" />
                                )}
                                Add ID
                            </Button>
                        </div>
                    )}
                    
                    {activeTab === 'bulk' && (
                        <div>
                            <div className="flex items-center mb-2">
                                <label htmlFor="bulk-ids" className="text-sm font-medium text-gray-700 mr-2">Multiple NIAT IDs</label>
                                <Tooltip text="Enter one NIAT ID per line. Each must follow the format N24H01X####">
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                </Tooltip>
                            </div>
                            <Textarea 
                                id="bulk-ids"
                                value={bulkIdInput} 
                                onChange={e => setBulkIdInput(e.target.value.toUpperCase())} 
                                placeholder="Example:&#10;N24H01A1234&#10;N24H01B5678" 
                                className="min-h-[120px] border-gray-300 mb-4"
                            />
                            <Button 
                                onClick={handleAddBulk} 
                                disabled={!bulkIdInput.trim() || isBulkSubmitting}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                            >
                                {isBulkSubmitting ? (
                                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <FileText className="h-4 w-4 mr-2" />
                                )}
                                Add From Text
                            </Button>
                        </div>
                    )}
                    
                    {activeTab === 'file' && (
                        <div>
                            <div className="flex items-center mb-2">
                                <label htmlFor="file-upload" className="text-sm font-medium text-gray-700 mr-2">Upload CSV File</label>
                                <Tooltip text="Upload a CSV file containing one NIAT ID per row">
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                </Tooltip>
                            </div>
                            <div className="mb-4">
                                <Input 
                                    id="file-upload" 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept=".csv" 
                                    onChange={handleFileUpload} 
                                    disabled={isFileUploading}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">Accepts .csv files. Each ID should be in a separate row.</p>
                            </div>
                            
                            {isFileUploading && (
                                <div className="flex items-center justify-center py-4 bg-indigo-50 rounded-lg">
                                    <LoaderCircle className="h-5 w-5 animate-spin text-indigo-500 mr-2" />
                                    <span className="text-indigo-700 font-medium">Processing file...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Registered NIAT IDs</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Filter className="h-4 w-4" />
                            <span>
                                {searchQuery 
                                    ? `Showing ${filteredIds.length} of ${niatIds.length} IDs` 
                                    : `${niatIds.length} total IDs`}
                            </span>
                        </div>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <LoaderCircle className="h-8 w-8 animate-spin text-indigo-500 mr-3" />
                        <span className="text-lg text-gray-600">Loading NIAT IDs...</span>
                    </div>
                ) : (
                    <>
                        {filteredIds.length === 0 ? (
                            <div className="p-12 text-center">
                                {searchQuery ? (
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Search className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-lg font-medium">No results found</p>
                                        <p className="text-sm">Try adjusting your search query</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Fingerprint className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-lg font-medium">No NIAT IDs registered yet</p>
                                        <p className="text-sm">Add your first NIAT ID using the tools above</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="max-h-[60vh] overflow-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIAT ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredIds.map(id => (
                                            <tr key={id._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-mono text-sm text-gray-900">{id.niatId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{format(new Date(id.createdAt), 'PPpp')}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => openDeleteConfirm(id._id)} 
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete NIAT ID"
                message="Are you sure you want to delete this NIAT ID? This action cannot be undone."
            />
        </div>
    );
}

export default NiatManagementPage;
