import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import StatCard from '../../components/StatCard';
import './categories.css';

const Categories = () => {
  // Mock data
  const [categories, setCategories] = useState([
    { _id: '1', name: 'Gà rán', description: 'Các món gà rán giòn tan', slug: 'ga-ran', productCount: 15, isActive: true },
    { _id: '2', name: 'Burger', description: 'Burger nhiều loại với nhân thịt gà, bò', slug: 'burger', productCount: 12, isActive: true },
    { _id: '3', name: 'Cơm', description: 'Các món cơm với gà giòn cay', slug: 'com', productCount: 8, isActive: true },
    { _id: '4', name: 'Mì Ý', description: 'Mì Ý sốt kem, sốt cà chua', slug: 'mi-y', productCount: 6, isActive: true },
    { _id: '5', name: 'Nước uống', description: 'Pepsi, 7Up, Lipton, Aquafina', slug: 'nuoc-uong', productCount: 10, isActive: true },
    { _id: '6', name: 'Món phụ', description: 'Khoai tây chiên, salad, súp', slug: 'mon-phu', productCount: 9, isActive: true },
    { _id: '7', name: 'Tráng miệng', description: 'Bánh tart trứng, sundae kem', slug: 'trang-mieng', productCount: 5, isActive: false },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: '',
    slug: '',
    isActive: true
  });

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
    } else {
      setEditMode(false);
      setCurrentCategory({ name: '', description: '', slug: '', isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCategory({ name: '', description: '', slug: '', isActive: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      // Update category
      setCategories(categories.map(cat => 
        cat._id === currentCategory._id ? currentCategory : cat
      ));
      alert('Cập nhật danh mục thành công!');
    } else {
      // Add new category
      const newCategory = {
        ...currentCategory,
        _id: String(categories.length + 1),
        productCount: 0
      };
      setCategories([...categories, newCategory]);
      alert('Thêm danh mục thành công!');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      setCategories(categories.filter(cat => cat._id !== id));
      alert('Xóa danh mục thành công!');
    }
  };

  const handleToggleActive = (id) => {
    setCategories(categories.map(cat => 
      cat._id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  return (
    <>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h1 className="page-title">Quản lý Danh mục Sản phẩm</h1>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => handleOpenModal()}
          >
            <FiPlus size={20} /> Thêm danh mục
          </button>
        </div>

        {/* Stats Overview */}
        <div className="row mb-4 g-3">
          <div className="col-md-4">
            <StatCard
              label="Tổng danh mục"
              value={categories.length}
              icon={<FiTag size={24} />}
              color="primary"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              label="Đang hoạt động"
              value={categories.filter(cat => cat.isActive).length}
              icon={<FiTag size={24} />}
              color="success"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              label="Tổng sản phẩm"
              value={categories.reduce((sum, cat) => sum + cat.productCount, 0)}
              icon={<FiTag size={24} />}
              color="info"
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="card">
          <div className="card-header">Danh sách danh mục</div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col" className="ps-4">#</th>
                  <th scope="col">Tên danh mục</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col" className="text-center">Số sản phẩm</th>
                  <th scope="col" className="text-center">Trạng thái</th>
                  <th scope="col" className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id}>
                    <td className="ps-4 fw-bold">C{1000 + index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FiTag className="text-primary" />
                        <span className="fw-bold">{category.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{category.description}</td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark">{category.productCount} món</span>
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={category.isActive}
                          onChange={() => handleToggleActive(category._id)}
                        />
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn-action btn-edit border-0 d-inline-flex align-items-center"
                        onClick={() => handleOpenModal(category)}
                      >
                        <FiEdit2 style={{ marginRight: '4px' }} />
                        Sửa
                      </button>
                      <button
                        className="btn-action btn-delete border-0 d-inline-flex align-items-center"
                        onClick={() => handleDelete(category._id)}
                      >
                        <FiTrash2 style={{ marginRight: '4px' }} />
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên danh mục <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentCategory.name}
                      onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                      required
                      placeholder="VD: Gà rán, Burger..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Slug (URL)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentCategory.slug}
                      onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                      placeholder="VD: ga-ran, burger..."
                    />
                    <small className="text-muted">Để trống sẽ tự động tạo từ tên danh mục</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={currentCategory.description}
                      onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                      placeholder="Mô tả ngắn về danh mục này..."
                    ></textarea>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={currentCategory.isActive}
                      onChange={(e) => setCurrentCategory({ ...currentCategory, isActive: e.target.checked })}
                      id="isActiveCheck"
                    />
                    <label className="form-check-label" htmlFor="isActiveCheck">
                      Kích hoạt danh mục này
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
