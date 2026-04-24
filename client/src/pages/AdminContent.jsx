import React, { useState, useEffect } from 'react';
import { adminAPI, tutorialAPI } from '../services/api';
import toast from 'react-hot-toast';
import './AdminContent.css';

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularIntents, setPopularIntents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [formData, setFormData] = useState({
    title_english: '',
    title_urdu: '',
    description_english: '',
    description_urdu: '',
    category_id: '',
    difficulty_level: 1,
    estimated_time_minutes: 5,
    is_published: true
  });
  const [steps, setSteps] = useState([
    { step_number: 1, instruction_english: '', instruction_urdu: '' }
  ]);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const [tutRes, catRes, intentRes] = await Promise.all([
        tutorialAPI.getTutorials({ limit: 100 }),
        tutorialAPI.getCategories(),
        adminAPI.getPopularIntents(50)
      ]);
      
      setTutorials(tutRes.data?.tutorials || []);
      setCategories(catRes.data || []);
      setPopularIntents(intentRes.data || []);
    } catch (error) {
      console.error('Content fetch error:', error);
      toast.error('Failed to fetch content data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTutorial = async (e) => {
    e.preventDefault();
    try {
      const formattedSteps = steps.map((s, i) => ({
  step_number: i + 1,
  instruction_english: s.instruction_english,
  instruction_urdu: s.instruction_urdu
}));
      await adminAPI.createTutorial({...formData, steps: formattedSteps });
      toast.success('Tutorial created successfully!');
      setShowCreateModal(false);
      resetForm();
      fetchAllContent();
    } catch (error) {
      toast.error('Failed to create tutorial');
      console.error('Create error:', error);
    }
  };

  const handleUpdateTutorial = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateTutorial(editingTutorial.id, formData);
      toast.success('Tutorial updated successfully!');
      setEditingTutorial(null);
      resetForm();
      fetchAllContent();
    } catch (error) {
      toast.error('Failed to update tutorial');
      console.error('Update error:', error);
    }
  };

  const handleDeleteTutorial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tutorial?')) return;
    
    try {
      await adminAPI.deleteTutorial(id);
      toast.success('Tutorial deleted successfully!');
      fetchAllContent();
    } catch (error) {
      toast.error('Failed to delete tutorial');
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({
      title_english: tutorial.title_english || '',
      title_urdu: tutorial.title_urdu || '',
      description_english: tutorial.description_english || '',
      description_urdu: tutorial.description_urdu || '',
      category_id: tutorial.category_id || '',
      difficulty_level: tutorial.difficulty_level || 1,
      estimated_time_minutes: tutorial.estimated_time_minutes || 5,
      is_published: tutorial.is_published !== false
    });
  };

  const handleTogglePublish = async (tutorial) => {
    try {
      await adminAPI.updateTutorial(tutorial.id, {
        is_published: !tutorial.is_published
      });
      toast.success(`Tutorial ${tutorial.is_published ? 'unpublished' : 'published'} successfully!`);
      fetchAllContent();
    } catch (error) {
      toast.error('Failed to toggle publish status');
    }
  };

  const resetForm = () => {
    setFormData({
      title_english: '',
      title_urdu: '',
      description_english: '',
      description_urdu: '',
      category_id: '',
      difficulty_level: 1,
      estimated_time_minutes: 5,
      is_published: true
    });
  };
  const updateStep = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        step_number: steps.length + 1,
        instruction_english: '',
        instruction_urdu: ''
      }
    ]);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border" style={{ color: 'var(--green)' }} role="status" />
        <p className="mt-3">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Content Header */}
      <div className="content-header">
        <div className="container-xl">
          <div className="content-header-row">
            <div>
              <h1 className="content-title">Content Management</h1>
              <p className="content-subtitle">Manage tutorials, intents, and keywords</p>
            </div>
            <button 
              className="create-btn"
              onClick={() => {
                resetForm();
                setEditingTutorial(null);
                setShowCreateModal(true);
              }}
            >
              <i className="fas fa-plus me-2"></i> Create Tutorial
            </button>
          </div>
          
          {/* Stats Bar */}
          <div className="content-stats-bar">
            <div className="content-stat">
              <span className="stat-num">{tutorials.length}</span>
              <span className="stat-lbl">Total Tutorials</span>
            </div>
            <div className="content-stat">
              <span className="stat-num">{tutorials.filter(t => t.is_published).length}</span>
              <span className="stat-lbl">Published</span>
            </div>
            <div className="content-stat">
              <span className="stat-num">{popularIntents.length}</span>
              <span className="stat-lbl">Total Intents</span>
            </div>
            <div className="content-stat">
              <span className="stat-num">{categories.length}</span>
              <span className="stat-lbl">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-xl py-4">
        <div className="row g-4">
          {/* Tutorials Table */}
          <div className="col-lg-8">
            <div className="content-card">
              <div className="content-card-header">
                <h3><i className="fas fa-book me-2"></i>Tutorials</h3>
                <div className="card-actions">
                  <button className="card-action-btn" onClick={fetchAllContent}>
                    <i className="fas fa-sync-alt"></i>
                  </button>
                </div>
              </div>
              
              {tutorials.length === 0 ? (
                <div className="empty-content">
                  <i className="fas fa-book-open fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
                  <h4>No tutorials yet</h4>
                  <p className="text-soft">Create your first tutorial to get started</p>
                </div>
              ) : (
                <div className="tutorials-list">
                  {tutorials.map((tutorial) => (
                    <div key={tutorial.id} className={`tutorial-item ${!tutorial.is_published ? 'unpublished' : ''}`}>
                      <div className="tutorial-item-main">
                        <div className="tutorial-item-info">
                          <div className="tutorial-item-header">
                            <h4 className="tutorial-item-title">{tutorial.title_urdu}</h4>
                            <span className={`publish-badge ${tutorial.is_published ? 'published' : 'draft'}`}>
                              {tutorial.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="tutorial-item-english">{tutorial.title_english}</p>
                          <div className="tutorial-item-meta">
                            <span className="meta-tag">
                              <i className="fas fa-folder me-1"></i>
                              {tutorial.category_name || 'Uncategorized'}
                            </span>
                            <span className="meta-tag">
                              <i className="fas fa-signal me-1"></i>
                              Level {tutorial.difficulty_level}
                            </span>
                            <span className="meta-tag">
                              <i className="fas fa-list me-1"></i>
                              {tutorial.step_count || 0} Steps
                            </span>
                            <span className="meta-tag">
                              <i className="fas fa-search me-1"></i>
                              {tutorial.search_count || 0} Searches
                            </span>
                          </div>
                        </div>
                        <div className="tutorial-item-actions">
                          <button 
                            className="item-action-btn edit"
                            onClick={() => handleEdit(tutorial)}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="item-action-btn toggle"
                            onClick={() => handleTogglePublish(tutorial)}
                            title={tutorial.is_published ? 'Unpublish' : 'Publish'}
                          >
                            <i className={`fas fa-${tutorial.is_published ? 'eye-slash' : 'eye'}`}></i>
                          </button>
                          <button 
                            className="item-action-btn delete"
                            onClick={() => handleDeleteTutorial(tutorial.id)}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Popular Intents */}
            <div className="content-card">
              <div className="content-card-header">
                <h3><i className="fas fa-star me-2"></i>Popular Intents</h3>
              </div>
              <div className="intents-list">
                {popularIntents.slice(0, 10).map((intent) => (
                  <div key={intent.id} className="intent-item">
                    <div className="intent-info">
                      <span className="intent-name">{intent.intent_name}</span>
                      <span className="intent-tutorial">{intent.tutorial_title}</span>
                    </div>
                    <div className="intent-stats">
                      <span className="intent-popularity" title="Popularity Score">
                        <i className="fas fa-fire me-1"></i>
                        {intent.popularity_score}
                      </span>
                      <span className="intent-success-rate" title="Success Rate">
                        {intent.success_rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="content-card mt-4">
              <div className="content-card-header">
                <h3><i className="fas fa-folder-tree me-2"></i>Categories</h3>
              </div>
              <div className="categories-list">
                {categories.map((cat) => (
                  <div key={cat.id} className="category-item">
                    <span className="category-icon">
                      <i className={`fas ${cat.icon_class || 'fa-folder'}`}></i>
                    </span>
                    <div className="category-info">
                      <span className="category-name">{cat.name_english}</span>
                      <span className="category-urdu" dir="rtl">{cat.name_urdu}</span>
                    </div>
                    <span className="category-count">{cat.tutorial_count || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="content-card mt-4">
              <div className="content-card-header">
                <h3><i className="fas fa-cogs me-2"></i>Quick Actions</h3>
              </div>
              <div className="quick-actions">
                <button 
                  className="quick-action-btn"
                  onClick={() => adminAPI.refreshMVs().then(() => toast.success('Views refreshed!'))}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Refresh Materialized Views
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={fetchAllContent}
                >
                  <i className="fas fa-redo me-2"></i>
                  Refresh Content Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTutorial) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {editingTutorial ? (
                  <><i className="fas fa-edit me-2"></i>Edit Tutorial</>
                ) : (
                  <><i className="fas fa-plus me-2"></i>Create Tutorial</>
                )}
              </h3>
              <button 
                className="modal-close-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTutorial(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={editingTutorial ? handleUpdateTutorial : handleCreateTutorial} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>English Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title_english}
                    onChange={(e) => setFormData({...formData, title_english: e.target.value})}
                    required
                    placeholder="How to Send WhatsApp Location"
                  />
                </div>
                <div className="form-group">
                  <label>Urdu Title *</label>
                  <input
                    type="text"
                    className="form-input urdu-input"
                    value={formData.title_urdu}
                    onChange={(e) => setFormData({...formData, title_urdu: e.target.value})}
                    required
                    placeholder="واٹس ایپ پر لوکیشن کیسے بھیجیں"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>English Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description_english}
                  onChange={(e) => setFormData({...formData, description_english: e.target.value})}
                  rows="2"
                  placeholder="Learn how to share your location..."
                />
              </div>
              
              <div className="form-group">
                <label>Urdu Description</label>
                <textarea
                  className="form-textarea urdu-input"
                  value={formData.description_urdu}
                  onChange={(e) => setFormData({...formData, description_urdu: e.target.value})}
                  rows="2"
                  placeholder="لوکیشن شیئر کرنا سیکھیں..."
                  dir="rtl"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    className="form-select"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name_english} / {cat.name_urdu}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select
                    className="form-select"
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({...formData, difficulty_level: parseInt(e.target.value)})}
                  >
                    <option value={1}>1 - Very Easy</option>
                    <option value={2}>2 - Easy</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - Hard</option>
                    <option value={5}>5 - Advanced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated Time (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.estimated_time_minutes}
                    onChange={(e) => setFormData({...formData, estimated_time_minutes: parseInt(e.target.value)})}
                    min="1"
                    max="120"
                  />
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                  />
                  <span>Publish immediately</span>
                </label>
              </div>
              <div className="form-group mt-3">
                <label>Steps</label>
                {steps.map((step, index) => (
                    <div key={index} className="step-box">
                      <input
                        type="text"
                        placeholder="English instruction"
                        value={step.instruction_english}
                        onChange={(e) =>
                          updateStep(index, 'instruction_english', e.target.value)
                        }
                      />

                      <input
                        type="text"
                        placeholder="Urdu instruction"
                        value={step.instruction_urdu}
                        onChange={(e) =>
                          updateStep(index, 'instruction_urdu', e.target.value)
                        }
                       />
                     </div>
                  ))}
                    <button type="button" onClick={addStep}>
                       + Add Step
                    </button>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTutorial(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-pakistan">
                  {editingTutorial ? 'Update Tutorial' : 'Create Tutorial'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;