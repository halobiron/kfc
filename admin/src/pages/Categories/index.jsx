import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, addNewCategory, updateCategory, deleteCategory } from '../../features/Product/categorySlice';
import StatCard from '../../components/StatCard';
import './categories.css';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.categories);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: '',
    slug: '',
    icon: 'bi-tag',
    isActive: true
  });

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
    } else {
      setEditMode(false);
      setCurrentCategory({ name: '', description: '', slug: '', icon: 'bi-tag', isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCategory({ name: '', description: '', slug: '', icon: 'bi-tag', isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await dispatch(updateCategory({ id: currentCategory._id, data: currentCategory })).unwrap();
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await dispatch(addNewCategory(currentCategory)).unwrap();
        toast.success('Thêm danh mục thành công!');
      }
      handleCloseModal();
      dispatch(getAllCategories());
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success('Xóa danh mục thành công!');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleToggleActive = async (category) => {
    try {
      await dispatch(updateCategory({
        id: category._id,
        data: { ...category, isActive: !category.isActive }
      })).unwrap();
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại!');
    }
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
              value={categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
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
                    <td className="ps-4 fw-bold">CAT{1000 + index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FiTag className="text-primary" />
                        <span className="fw-bold">{category.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{category.description}</td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark">{category.productCount || 0} món</span>
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={category.isActive}
                          onChange={() => handleToggleActive(category)}
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
                  <div className="mb-3">
                    <label className="form-label">Biểu tượng (Bootstrap Icon class)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentCategory.icon}
                      onChange={(e) => setCurrentCategory({ ...currentCategory, icon: e.target.value })}
                      placeholder="VD: bi-tag, bi-cup-hot..."
                    />
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
