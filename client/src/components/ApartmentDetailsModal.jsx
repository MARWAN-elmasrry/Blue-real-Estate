import React from 'react';

const ApartmentDetailsModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Some Data</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-row heading">
            <span>Room</span>
            <span>Area</span>
            <span>Notes</span>
          </div>
          <div className="modal-row">
            <span>Living Room</span>
            <span>24 m²</span>
            <span>Sea view</span>
          </div>
          <div className="modal-row">
            <span>Bedroom</span>
            <span>16 m²</span>
            <span>Balcony included</span>
          </div>
          <div className="modal-row">
            <span>Kitchen</span>
            <span>10 m²</span>
            <span>Open style</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-btn" onClick={onClose}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetailsModal;
