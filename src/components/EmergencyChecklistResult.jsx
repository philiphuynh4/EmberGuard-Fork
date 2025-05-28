import React, { useState } from 'react';

const EmergencyChecklistResult = ({ formData, onClose }) => {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [customItems, setCustomItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [customHelplines, setCustomHelplines] = useState([]);
  const [newHelplineText, setNewHelplineText] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [showAddHelplineInput, setShowAddHelplineInput] = useState(false);
  const [defaultItems, setDefaultItems] = useState([
    {
      id: 'food-water',
      text: 'At least a 3-day supply of non-perishable food and water for each person and 3 gallons of water for each person'
    },
    {
      id: 'pet-supplies',
      text: 'Food and water for your pets'
    },
    {
      id: 'flashlight',
      text: 'Flashlight, extra batteries and a battery-powered or hand-crank radio'
    },
    {
      id: 'medications',
      text: '1 week supply of prescriptions or medications'
    },
    {
      id: 'first-aid',
      text: 'First aid kit and a sanitation kit'
    },
    {
      id: 'masks',
      text: 'Masks'
    },
    {
      id: 'documents',
      text: 'Copies of important documents (ID, insurance, medical records) stored in a safe waterproof place or digitally backed up'
    },
    {
      id: 'clothes',
      text: 'A change of clothes and eye glasses/contacts'
    },
    {
      id: 'keys-cash',
      text: 'Extra car keys, credit cards, cash, or traveler\'s checks'
    },
    {
      id: 'evacuation-map',
      text: 'A map with at least 2 evacuation routes'
    }
  ]);

  const toggleItem = (itemId) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const addCustomItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: `custom-${Date.now()}`,
        text: newItemText.trim()
      };
      setCustomItems([...customItems, newItem]);
      setNewItemText('');
    }
  };

  const removeCustomItem = (itemId) => {
    setCustomItems(customItems.filter(item => item.id !== itemId));
    const newChecked = new Set(checkedItems);
    newChecked.delete(itemId);
    setCheckedItems(newChecked);
  };

  const removeDefaultItem = (itemId) => {
    setDefaultItems(defaultItems.filter(item => item.id !== itemId));
    const newChecked = new Set(checkedItems);
    newChecked.delete(itemId);
    setCheckedItems(newChecked);
  };

  const addCustomHelpline = () => {
    if (newHelplineText.trim()) {
      const newHelpline = {
        id: `helpline-${Date.now()}`,
        text: newHelplineText.trim()
      };
      setCustomHelplines([...customHelplines, newHelpline]);
      setNewHelplineText('');
    }
  };

  const removeCustomHelpline = (helplineId) => {
    setCustomHelplines(customHelplines.filter(helpline => helpline.id !== helplineId));
  };

  const [defaultHelplines, setDefaultHelplines] = useState([
    { id: 'emergency-911', text: 'Emergency Response - 911' },
    { id: 'wildfire-reporting', text: 'Wildfire Reporting - 800-562-6010' },
  ]);

  const removeDefaultHelpline = (helplineId) => {
    setDefaultHelplines(defaultHelplines.filter(helpline => helpline.id !== helplineId));
  };

  const educationalVideos = [
    {
      id: 'fire-proof',
      title: 'Fire Proof tips',
      thumbnail: '/fireprooftips.png',
      labels: []
    },
    {
      id: 'training',
      title: 'Training Educational Resources',
      thumbnail: '/training.png',
      labels: []
    },
    {
      id: 'evacuation',
      title: 'Evacuation Plan Help',
      thumbnail: '/evacuationplan.png',
      labels: []
    }
  ];

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-white d-flex flex-column" style={{zIndex: 1002}}>
        <div className="p-4 border-bottom d-flex justify-content-center align-items-center position-relative">
            <h1 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Emergency Checklist</h1>
            <button
                className="btn-close position-absolute end-0"
                onClick={onClose}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6L18 18" />
                </svg>
            </button>
        </div>

      <div className="flex-grow-1 overflow-auto p-4">
        <div className="mb-5">
          <h2 className="fw-bold mb-4" style={{fontSize: '1.3rem'}}>Educational videos</h2>
          
          <div className="d-none d-md-flex gap-4">
            {educationalVideos.map(video => (
              <div key={video.id} className="card border-0 shadow-sm" style={{flex: '1'}}>
                <div className="position-relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="card-img-top"
                    style={{height: '160px', objectFit: 'cover'}}
                  />
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                  {video.labels.length > 0 && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-around p-2" style={{fontSize: '0.65rem', color: 'white'}}>
                      {video.labels.map((label, index) => (
                        <span key={index} className="bg-dark bg-opacity-75 px-2 py-1 rounded" style={{fontSize: '0.65rem'}}>
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="card-body p-3">
                  <h5 className="card-title mb-2" style={{fontSize: '1rem'}}>{video.title}</h5>
                  <button className="btn btn-link p-0 text-decoration-underline" style={{fontSize: '0.9rem', color: '#84B5CE'}}>Source</button>
                </div>
              </div>
            ))}
          </div>

          <div className="d-md-none">
            <div className="d-flex gap-3 overflow-auto pb-3" style={{scrollSnapType: 'x mandatory'}}>
              {educationalVideos.map(video => (
                <div key={video.id} className="card border-0 shadow-sm flex-shrink-0" style={{width: '280px', scrollSnapAlign: 'start'}}>
                  <div className="position-relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="card-img-top"
                      style={{height: '140px', objectFit: 'cover'}}
                    />
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    {video.labels.length > 0 && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-around p-2" style={{fontSize: '0.6rem', color: 'white'}}>
                        {video.labels.map((label, index) => (
                          <span key={index} className="bg-dark bg-opacity-75 px-1 py-1 rounded">
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="card-body p-3">
                    <h6 className="card-title mb-2">{video.title}</h6>
                    <button className="btn btn-link p-0 text-decoration-underline small" style={{color: '#84B5CE'}}>Source</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="fw-bold mb-4" style={{fontSize: '1.3rem'}}>Checklist</h2>
          
          {[...defaultItems, ...customItems].map(item => (
            <div key={item.id} className="d-flex align-items-start gap-3 mb-3">
              <input
                type="checkbox"
                className="form-check-input mt-1 custom-checkbox"
                style={{
                  transform: 'scale(1.1)',
                  accentColor: '#84B5CE'
                }}
                checked={checkedItems.has(item.id)}
                onChange={() => toggleItem(item.id)}
              />
              <label className="flex-grow-1" style={{lineHeight: '1.4', fontSize: '0.95rem', color: '#374151'}}>
                {item.text}
              </label>
              <button 
                className="btn btn-sm text-danger border-0 bg-transparent p-1"
                onClick={() => item.id.startsWith('custom-') ? removeCustomItem(item.id) : removeDefaultItem(item.id)}
                style={{fontSize: '1rem', lineHeight: '1'}}
                title="Remove item"
              >
                ×
              </button>
            </div>
          ))}

          {!showAddInput ? (
            <div className="d-flex justify-content-center mt-4">
              <button 
                className="btn d-flex align-items-center gap-2 px-3"
                onClick={() => setShowAddInput(true)}
                style={{
                  backgroundColor: '#84B5CE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add more
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2 mt-4">
              <input
                type="text"
                className="form-control custom-focus"
                placeholder="Add custom checklist item..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCustomItem();
                    setShowAddInput(false);
                  }
                }}
                autoFocus
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.95rem'
                }}
              />
              <button 
                className="btn d-flex align-items-center gap-2 px-3"
                onClick={() => {
                  addCustomItem();
                  setShowAddInput(false);
                }}
                style={{
                  backgroundColor: '#84B5CE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              >
                Add
              </button>
              <button 
                className="btn btn-outline-secondary px-3"
                onClick={() => {
                  setShowAddInput(false);
                  setNewItemText('');
                }}
                style={{
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mb-5">
          <h2 className="fw-bold mb-4" style={{fontSize: '1.3rem'}}>Emergency Helplines in your county</h2>
          
          <div className="border rounded-3 p-4" style={{backgroundColor: '#f8f9fa'}}>
            {defaultHelplines.map(helpline => (
              <div key={helpline.id} className="d-flex justify-content-between align-items-center mb-3" style={{fontSize: '0.95rem', fontWeight: '500'}}>
                <span>{helpline.text}</span>
                <button 
                  className="btn btn-sm text-danger border-0 bg-transparent p-1"
                  onClick={() => removeDefaultHelpline(helpline.id)}
                  style={{fontSize: '1rem', lineHeight: '1'}}
                  title="Remove helpline"
                >
                  ×
                </button>
              </div>
            ))}

            {customHelplines.map(helpline => (
              <div key={helpline.id} className="d-flex justify-content-between align-items-center mb-3" style={{fontSize: '0.95rem', fontWeight: '500'}}>
                <span>{helpline.text}</span>
                <button 
                  className="btn btn-sm text-danger border-0 bg-transparent p-1"
                  onClick={() => removeCustomHelpline(helpline.id)}
                  style={{fontSize: '1rem', lineHeight: '1'}}
                  title="Remove helpline"
                >
                  ×
                </button>
              </div>
            ))}

            {!showAddHelplineInput ? (
              <div className="d-flex justify-content-center">
                <button 
                  className="btn d-flex align-items-center gap-2 px-3"
                  onClick={() => setShowAddHelplineInput(true)}
                  style={{
                    backgroundColor: '#84B5CE',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Add more
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control custom-focus"
                  placeholder="Add emergency contact (Shelters, Police, Fire Stations, etc.)"
                  value={newHelplineText}
                  onChange={(e) => setNewHelplineText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addCustomHelpline();
                      setShowAddHelplineInput(false);
                    }
                  }}
                  autoFocus
                  style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
                <button 
                  className="btn d-flex align-items-center gap-2 px-3"
                  onClick={() => {
                    addCustomHelpline();
                    setShowAddHelplineInput(false);
                  }}
                  style={{
                    backgroundColor: '#84B5CE',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  Add
                </button>
                <button 
                  className="btn btn-outline-secondary px-3"
                  onClick={() => {
                    setShowAddHelplineInput(false);
                    setNewHelplineText('');
                  }}
                  style={{
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-top bg-white">
          <div className="d-flex justify-content-center">
            <button
              className="btn px-5 py-3 fw-medium"
              onClick={() => {
                  onClose();
              }}
              style={{
                backgroundColor: '#003049',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem'
              }}
            >
            Save list
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyChecklistResult;