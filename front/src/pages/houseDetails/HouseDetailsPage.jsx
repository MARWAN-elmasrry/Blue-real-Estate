import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './HouseDetailsPage.css';
import detailsBg from '../../assets/houses-bg.png';
import closeImg from '../../assets/close.png';
import { getBuildingById, updateApartmentByNumber, clearApartmentData } from '../../api/services/admin';

const HouseDetailsPage = () => {
  const { id } = useParams();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        setLoading(true);
        const response = await getBuildingById(id);
        if (response.success) {
          setBuilding(response.building);
        }
      } catch (error) {
        console.error('Error fetching building:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [id]);

  const handleRowClick = (apartment) => {
    setSelectedApartment(apartment);
    setEditForm({
      tenantName: apartment.tenantName || '',
      tenantPhone: apartment.tenantPhone || '',
      status: 'Occupied',
      monthlyRent: apartment.monthlyRent || 0,
      rentIncreasePerYear: apartment.rentIncreasePerYear || 0,
      contractStartDate: apartment.contractStartDate ? apartment.contractStartDate.split('T')[0] : '',
      contractEndDate: apartment.contractEndDate ? apartment.contractEndDate.split('T')[0] : ''
    });
    setShowPopup(true);
    setIsEditing(false);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedApartment(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Call the update API
      await updateApartmentByNumber(
        id,
        selectedApartment.apartmentNumber,
        editForm
      );
      
      // Fetch fresh data
      const updatedBuilding = await getBuildingById(id);
      if (updatedBuilding.success) {
        setBuilding(updatedBuilding.building);
        
        // Find and update the selected apartment with fresh data
        const updatedApt = updatedBuilding.building.apartments.find(
          apt => apt.apartmentNumber === selectedApartment.apartmentNumber
        );
        setSelectedApartment(updatedApt);
      }
      
      // Exit edit mode AFTER updating data
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating apartment:', error);
      alert('Failed to update apartment: ' + error);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setShowConfirmPopup(true);
  };

  const confirmClear = async () => {
    setShowConfirmPopup(false);
    
    try {
      setSaving(true);
      
      // Call the clear API
      const response = await clearApartmentData(
        id,
        selectedApartment.apartmentNumber
      );
      
      if (response.success) {
        // Fetch fresh data
        const updatedBuilding = await getBuildingById(id);
        if (updatedBuilding.success) {
          setBuilding(updatedBuilding.building);
          
          // Find and update the selected apartment with fresh data
          const updatedApt = updatedBuilding.building.apartments.find(
            apt => apt.apartmentNumber === selectedApartment.apartmentNumber
          );
          setSelectedApartment(updatedApt);
        }
        
        // Exit edit mode
        setIsEditing(false);
      }
      
    } catch (error) {
      console.error('Error clearing apartment:', error);
      alert('Failed to clear apartment: ' + error);
    } finally {
      setSaving(false);
    }
  };

  const cancelClear = () => {
    setShowConfirmPopup(false);
  };

  const handleCancel = () => {
    setEditForm({
      tenantName: selectedApartment.tenantName || '',
      tenantPhone: selectedApartment.tenantPhone || '',
      monthlyRent: selectedApartment.monthlyRent || 0,
      rentIncreasePerYear: selectedApartment.rentIncreasePerYear || 0,
      contractStartDate: selectedApartment.contractStartDate ? selectedApartment.contractStartDate.split('T')[0] : '',
      contractEndDate: selectedApartment.contractEndDate ? selectedApartment.contractEndDate.split('T')[0] : ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotalRent = () => {
    if (!building) return 0;
    return building.apartments
      .filter(apt => apt.status === 'Occupied')
      .reduce((sum, apt) => sum + apt.monthlyRent, 0);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!building) {
    return <div className="error">Building not found</div>;
  }

  return (
    <div className="house-details-page">
      <div className="details-bg" style={{ backgroundImage: `url(${detailsBg})` }}>
        <div className="overlay">
          <h1>Total Monthly Rent: ${calculateTotalRent()}</h1>
          <h2>{building.buildingName}</h2>
          <p># {building.buildingNumber} - {building.location}</p>
        </div>
      <div className="details-content">
        <div className="table-container">
          <div className="maincard">
            <p>Apartment</p>
            <p>Status</p>
            <p>Name</p>
            <p>Monthly Rent</p>
            <p>Contract End Dates</p>
          </div>  
          {building.apartments.map((apt) => (
            <div 
              key={apt._id} 
              className={`card ${apt.status.toLowerCase()}`}
              onClick={() => handleRowClick(apt)}
            >
              <p className='apartmentNumber'>{apt.apartmentNumber}</p>
              <p>
                <span className={`status-badge ${apt.status.toLowerCase()}`}>
                  {apt.status}
                </span>
              </p>
              <p>{apt.tenantName || 'N/A'}</p>
              <p>${apt.monthlyRent || 0}</p>
              <p>{formatDate(apt.contractEndDate)}</p>
            </div>
          ))}
        </div>

        <div className="actions">
          <Link to="/houses" className="btn btn-back">
            Back to Houses
          </Link>
        </div>
      </div>
      </div>
      {showPopup && selectedApartment && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}><img src={closeImg} alt="closeImg" /></button>
            <h2>Apartment #{selectedApartment.apartmentNumber} Details</h2>
            
            {!isEditing ? (
              <>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <p style={{textAlign:'center'}} className={`value status-badge ${selectedApartment.status.toLowerCase()}`}>
                    {selectedApartment.status}
                  </p>
                </div>
                <p dir="rtl" style={{color:'#1a3d63', margin:0}}>:Contract Start</p>
                <p dir="rtl" style={{color:'#1a3d63', margin:0}}>{formatDate(selectedApartment.contractStartDate)}</p>
                <div className='white'>
                  <h2 className='text'>Name:</h2>
                  <h2 className='text'>{selectedApartment.tenantName || 'N/A'}</h2>
                  <h2 className='text'>Phone:</h2>
                  <h2 className='text'>{selectedApartment.tenantPhone || 'N/A'}</h2>
                  <br />
                  <h2 className='text'>Monthly Rent: ${selectedApartment.monthlyRent || 0}</h2>
                  <br />
                  <h2 className='text'>Rent Increase/Year: {selectedApartment.rentIncreasePerYear}%</h2>
                  <br />
                  <h2 className='text'>Contract End: {formatDate(selectedApartment.contractEndDate)}</h2>
                  <br />
                  <div className='popup-btn-div' style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                    <button className="btn popup-btn" onClick={handleEditClick}>Edit</button>
                    {selectedApartment.status !== 'Vacant' && (
                      <button 
                        className="btn popup-btn" 
                        onClick={handleClear}
                        style={{backgroundColor: '#dc3545'}}
                        disabled={saving}
                      >
                        {saving ? 'Clearing...' : 'Clear'}
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className='white'>
                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', color: '#1a3d63', fontWeight: '300'}}>Name:</label>
                  <input 
                    type="text" 
                    name="tenantName" 
                    value={editForm.tenantName} 
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                  />
                </div>

                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', color: 'white', fontWeight: '300'}}>Phone:</label>
                  <input 
                    type="text" 
                    name="tenantPhone" 
                    value={editForm.tenantPhone} 
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                  />
                </div>

                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', color: 'white', fontWeight: '300'}}>Monthly Rent:</label>
                  <input 
                    type="number" 
                    name="monthlyRent" 
                    value={editForm.monthlyRent} 
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                  />
                </div>

                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', color: 'white', fontWeight: '300'}}>Rent Increase/Year (%):</label>
                  <input 
                    type="number" 
                    name="rentIncreasePerYear" 
                    value={editForm.rentIncreasePerYear} 
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                  />
                </div>

                <div style={{marginBottom: '15px' ,display:'flex' , gap:20}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', color: 'white', fontWeight: '300'}}>Contract Start Date:</label>
                  <input 
                    type="date" 
                    name="contractStartDate" 
                    value={editForm.contractStartDate} 
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                  />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', color: 'white', fontWeight: '300'}}>Contract End Date:</label>
                  <input 
                    type="date" 
                    name="contractEndDate" 
                    value={editForm.contractEndDate} 
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                  />
                  </div>
                </div>

                <div className='popup-btn-div' style={{display: 'flex', gap: '10px',}}>
                  <button 
                    className="btn popup-btn" 
                    onClick={handleSave}
                    disabled={saving}
                    style={{backgroundColor: '#28a745'}}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="btn popup-btn" 
                    onClick={handleCancel}
                    style={{backgroundColor: '#6c757d'}}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="blue"></div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="popup-overlay" onClick={cancelClear}>
          <div 
            className="confirm-popup" 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{color: '#dc3545', marginBottom: '20px'}}>Confirm Clear</h2>
            <p style={{color: '#1a3d63', marginBottom: '30px', lineHeight: '1.6'}}>
              Are you sure you want to clear all data for Apartment #{selectedApartment?.apartmentNumber}? 
              <br/><br/>
              This will remove tenant information and reset the apartment to vacant status.
            </p>
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
              <button 
                className="btn popup-btn" 
                onClick={confirmClear}
                style={{backgroundColor: '#dc3545', color: 'white', minWidth: '100px'}}
              >
                Yes, Clear
              </button>
              <button 
                className="btn popup-btn" 
                onClick={cancelClear}
                style={{backgroundColor: '#6c757d', color: 'white', minWidth: '100px'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseDetailsPage;