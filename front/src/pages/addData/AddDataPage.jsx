import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddDataPage.css';
import addBg from '../../assets/addb.png';
import { addBuilding } from '../../api/services/admin';

const AddDataPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    buildingName: '',
    buildingNumber: '',
    location: '',
    numberOfApartments: '',
    apartmentsPerFloor: ''
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.buildingName || !formData.buildingNumber || !formData.location || 
        !formData.numberOfApartments || !formData.apartmentsPerFloor) {
      showAlert('error', 'Please fill in all fields');
      return;
    }

    // Validate that apartmentsPerFloor doesn't exceed numberOfApartments
    if (parseInt(formData.apartmentsPerFloor) > parseInt(formData.numberOfApartments)) {
      showAlert('error', 'Apartments per floor cannot exceed total number of apartments');
      return;
    }

    try {
      setLoading(true);

      const buildingData = {
        buildingName: formData.buildingName,
        buildingNumber: parseInt(formData.buildingNumber),
        location: formData.location,
        numberOfApartments: parseInt(formData.numberOfApartments),
        apartmentsPerFloor: parseInt(formData.apartmentsPerFloor)
      };

      const response = await addBuilding(buildingData);
      
      if (response.message === "Building added successfully") {
        showAlert('success', 'Building added successfully!');
        
        setFormData({
          buildingName: '',
          buildingNumber: '',
          location: '',
          numberOfApartments: '',
          apartmentsPerFloor: ''
        });

        setTimeout(() => {
          navigate('/houses');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding building:', error);
      showAlert('error', 'Failed to add building: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="add-page"
      style={{ backgroundImage: `url(${addBg})` }}
    >
      <main className="add-content">
        <section className="add-form-wrapper">
          <h2>Add Building</h2>

          <form onSubmit={handleSubmit} className="add-form">
            <div className="form-row">
              <div className="form-col">
                <label>Building Name</label>
                <input 
                  type="text" 
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleInputChange}
                  placeholder="Enter building name" 
                  disabled={loading}
                />
              </div>
              <div className="form-col">
                <label>Building Number</label>
                <input 
                  type="number" 
                  name="buildingNumber"
                  value={formData.buildingNumber}
                  onChange={handleInputChange}
                  placeholder="Enter building number" 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location" 
                  disabled={loading}
                />
              </div>
              <div className="form-col">
                <label>Apartments Per Floor</label>
                <input 
                  type="number" 
                  name="apartmentsPerFloor"
                  value={formData.apartmentsPerFloor}
                  onChange={handleInputChange}
                  placeholder="Enter apartments per floor" 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col full">
                <label>Number of Apartments</label>
                <input 
                  type="number" 
                  name="numberOfApartments"
                  value={formData.numberOfApartments}
                  onChange={handleInputChange}
                  placeholder="Enter total number of apartments" 
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
              {alert.show && (
                <div 
                  className={`inline-alert ${alert.type}`}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    flex: 1,
                    animation: 'slideInLeft 0.4s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: 0,
                  }}
                >
                  <span style={{ fontSize: '18px' }}>
                    {alert.type === 'success' ? '✓' : '⚠'}
                  </span>
                  {alert.message}
                </div>
              )}
              
              <button 
                type="submit" 
                className="primary-btn submit-right"
                disabled={loading}
                style={{ marginTop: 0, marginLeft: alert.show ? 0 : 'auto' }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddDataPage;