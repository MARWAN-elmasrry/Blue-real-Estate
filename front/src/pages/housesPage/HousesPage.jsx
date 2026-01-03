import React, { useEffect, useState } from 'react';
import './HousesPage.css';
import ApartmentDetailsModal from '../../components/ApartmentDetailsModal';
import housesBg from '../../assets/houses-bg.png'; 
import cardImg from '../../assets/card-placeholder.jpg';
import searchIcon from '../../assets/search.png'
import { GetAllBuildings } from '../../api/services/admin';

const HousesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        const data = await GetAllBuildings();
        setBuildings(data.buildings);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  // Filter buildings based on search query and active filter
  const filteredBuildings = buildings.filter((building) => {
    // Search filter
    const matchesSearch = 
      building.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.buildingNumber.toString().includes(searchQuery);

    // Filter by apartment count
    let matchesFilter = true;
    if (activeFilter === 'small') {
      matchesFilter = building.apartmentsCount <= 5;
    } else if (activeFilter === 'medium') {
      matchesFilter = building.apartmentsCount > 5 && building.apartmentsCount <= 10;
    } else if (activeFilter === 'large') {
      matchesFilter = building.apartmentsCount > 10;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="houses-page" style={{ backgroundImage: `url(${housesBg})` }}>
      <span className="summary-label">Total Projects: {buildings.length}</span>
      <main className="content houses-content">
        <div className="search">
          <div className="search-box">
            <img src={searchIcon} alt="searchIcon" />
            <input 
              placeholder="Search by name, location, or number" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <section className="layout">
          <aside className="filters-panel">
            <h4>Filter by Size</h4>
            <button 
              className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({buildings.length})
            </button>
            <button 
              className={`filter-chip ${activeFilter === 'small' ? 'active' : ''}`}
              onClick={() => setActiveFilter('small')}
            >
              Small (≤5 units)
            </button>
            <button 
              className={`filter-chip ${activeFilter === 'medium' ? 'active' : ''}`}
              onClick={() => setActiveFilter('medium')}
            >
              Medium (6-10 units)
            </button>
            <button 
              className={`filter-chip ${activeFilter === 'large' ? 'active' : ''}`}
              onClick={() => setActiveFilter('large')}
            >
              Large (>10 units)
            </button>
          </aside>

          <section className="cards-grid">
            {loading ? (
              <p style={{ color: 'white' }}>Loading...</p>
            ) : filteredBuildings.length === 0 ? (
              <p style={{ color: 'white', fontSize: '18px' }}>
                No buildings found matching your search criteria.
              </p>
            ) : (
              filteredBuildings.map((building) => (
                <article key={building._id} className="house-card">
                  <img src={cardImg} alt="House" className="house-card-img" />
                  <div className="house-card-body">
                    <h5>{building.buildingName}</h5>
                    <p>{building.location}</p>
                    <div className="detials">
                      <p className='p-sm'>Building number #{building.buildingNumber}</p>
                      <p className='p-sm'>{building.apartmentsCount} apartments</p>
                    </div>
                    <div className="house-card-actions">
                      <button
                        className="primary-btn sm"
                        onClick={() =>
                          (window.location.href = `/houses/${building._id}`)
                        }
                      >
                        Details
                      </button>
                      {/* <button
                        className="secondary-btn sm"
                        onClick={() => setShowModal(true)}
                      >
                        Apartment
                      </button> */}
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>
      </main>

      <ApartmentDetailsModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default HousesPage;